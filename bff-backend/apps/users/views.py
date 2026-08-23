from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.crm.services import ensure_customer_for_user
from apps.users.permissions import IsSuperAdmin

from .auth_cookies import (
	clear_refresh_cookie,
	ensure_csrf_cookie,
	enforce_csrf,
	get_refresh_token_from_cookie,
	set_refresh_cookie,
)
from .models import User
from .otp import OTP_SEND_SUCCESS_DETAIL, create_and_send_otp, verify_otp
from .serializers import (
	RegisterSerializer,
	SendOTPSerializer,
	UserSerializer,
	VerifyOTPSerializer,
)


class SendOTPIPThrottle(AnonRateThrottle):
	"""IP-scoped rate limit for send-otp (in addition to per-email resend cooldown)."""

	scope = 'otp_send'


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [IsSuperAdmin]


class MeView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		if request.user.role == User.Role.CUSTOMER:
			ensure_customer_for_user(request.user)
		serializer = UserSerializer(request.user)
		return Response(serializer.data)


class CsrfCookieView(APIView):
	"""Issue the csrftoken cookie so SPAs can send X-CSRFToken on refresh/logout."""

	permission_classes = [permissions.AllowAny]
	authentication_classes = []

	def get(self, request):
		token = ensure_csrf_cookie(request)
		return Response({'detail': 'CSRF cookie set.', 'csrfToken': token})


class CookieTokenObtainPairView(TokenObtainPairView):
	"""Login: return access in JSON; set refresh as httpOnly cookie (F5)."""

	serializer_class = TokenObtainPairSerializer

	def post(self, request, *args, **kwargs):
		response = super().post(request, *args, **kwargs)
		if response.status_code != status.HTTP_200_OK:
			return response

		refresh = response.data.pop('refresh', None)
		ensure_csrf_cookie(request)
		if refresh:
			set_refresh_cookie(response, refresh)
		return response


class CookieTokenRefreshView(APIView):
	"""Refresh: read refresh from httpOnly cookie; return new access; rotate cookie."""

	permission_classes = [permissions.AllowAny]
	authentication_classes = []

	def post(self, request):
		enforce_csrf(request)
		refresh_token = get_refresh_token_from_cookie(request)
		if not refresh_token:
			return Response(
				{'detail': 'Refresh token cookie missing.'},
				status=status.HTTP_401_UNAUTHORIZED,
			)

		serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
		try:
			serializer.is_valid(raise_exception=True)
		except TokenError as exc:
			response = Response(
				{'detail': str(exc.args[0]) if exc.args else 'Token is invalid or expired.'},
				status=status.HTTP_401_UNAUTHORIZED,
			)
			clear_refresh_cookie(response)
			return response
		except InvalidToken as exc:
			response = Response(exc.detail, status=status.HTTP_401_UNAUTHORIZED)
			clear_refresh_cookie(response)
			return response

		access = serializer.validated_data['access']
		new_refresh = serializer.validated_data.get('refresh', refresh_token)
		response = Response({'access': access})
		ensure_csrf_cookie(request)
		set_refresh_cookie(response, new_refresh)
		return response


class LogoutView(APIView):
	"""Clear the httpOnly refresh cookie and blacklist the refresh token (F5/B12)."""

	permission_classes = [permissions.AllowAny]
	authentication_classes = []

	def post(self, request):
		enforce_csrf(request)
		refresh_token = get_refresh_token_from_cookie(request)
		if refresh_token:
			try:
				RefreshToken(refresh_token).blacklist()
			except TokenError:
				pass
		response = Response({'detail': 'Logged out.'}, status=status.HTTP_200_OK)
		clear_refresh_cookie(response)
		return response


class RegisterView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		if serializer.is_valid():
			user = serializer.save()
			ensure_customer_for_user(user)
			refresh = RefreshToken.for_user(user)
			response = Response({
				'user': UserSerializer(user).data,
				'access': str(refresh.access_token),
			}, status=status.HTTP_201_CREATED)
			ensure_csrf_cookie(request)
			set_refresh_cookie(response, str(refresh))
			return response
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendEmailOTPView(APIView):
	permission_classes = [permissions.AllowAny]
	throttle_classes = [SendOTPIPThrottle]

	def post(self, request):
		serializer = SendOTPSerializer(data=request.data)
		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		try:
			create_and_send_otp(serializer.validated_data['email'])
		except ValueError as exc:
			# Per-email resend cooldown — does not leak whether the account exists.
			return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
		except Exception:
			return Response(
				{'error': 'Unable to send verification email. Please try again later.'},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		# Identical body for registered and unregistered emails (anti-enumeration).
		return Response({'detail': OTP_SEND_SUCCESS_DETAIL})


class VerifyEmailOTPView(APIView):
	permission_classes = [permissions.AllowAny]

	def post(self, request):
		serializer = VerifyOTPSerializer(data=request.data)
		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		try:
			verify_otp(
				serializer.validated_data['email'],
				serializer.validated_data['otp'],
			)
		except ValueError as exc:
			return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

		return Response({
			'detail': 'Email verified successfully.',
			'email': serializer.validated_data['email'],
			'verified': True,
		})
