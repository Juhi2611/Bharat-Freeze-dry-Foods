from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
	UserViewSet,
	MeView,
	RegisterView,
	SendEmailOTPView,
	VerifyEmailOTPView,
	CookieTokenObtainPairView,
	CookieTokenRefreshView,
	LogoutView,
	CsrfCookieView,
)

router = DefaultRouter()
router.register('admin/users', UserViewSet, basename='user')

urlpatterns = [
	path('auth/login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('auth/register/', RegisterView.as_view(), name='token_register'),
	path('auth/send-otp/', SendEmailOTPView.as_view(), name='auth_send_otp'),
	path('auth/verify-otp/', VerifyEmailOTPView.as_view(), name='auth_verify_otp'),
	path('auth/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
	path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
	path('auth/csrf/', CsrfCookieView.as_view(), name='auth_csrf'),
	path('auth/me/', MeView.as_view(), name='auth_me'),
	path('', include(router.urls)),
]
