"""B11 default-deny + gated schema; B12 refresh blacklist."""

from django.conf import settings
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.auth_cookies import REFRESH_COOKIE_NAME
from apps.users.models import User


class DefaultPermissionAndDocsTests(APITestCase):
	"""B11"""

	def setUp(self):
		self.admin = User.objects.create_user(
			email='docs-admin@example.com',
			password='Pass123!',
			full_name='Docs Admin',
			role=User.Role.SUPER_ADMIN,
			is_staff=True,
			is_superuser=True,
		)

	def test_default_permission_is_authenticated(self):
		classes = settings.REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES']
		self.assertIn('rest_framework.permissions.IsAuthenticated', classes)

	def test_public_product_list_still_anonymous(self):
		response = self.client.get('/api/v1/products/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_public_auth_csrf_still_anonymous(self):
		response = self.client.get('/api/v1/auth/csrf/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)

	def test_media_list_requires_auth(self):
		# Media has no AllowAny — defaults / IsContentStaff require auth.
		response = self.client.get('/api/v1/media/files/')
		self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

	def test_schema_docs_reject_anonymous(self):
		self.assertIn(
			self.client.get('/api/schema/').status_code,
			(status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
		)
		self.assertIn(
			self.client.get('/api/docs/').status_code,
			(status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
		)
		self.assertIn(
			self.client.get('/api/redoc/').status_code,
			(status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
		)

	def test_schema_allows_staff(self):
		token = RefreshToken.for_user(self.admin).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
		response = self.client.get('/api/schema/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)


class RefreshTokenBlacklistTests(APITestCase):
	"""B12: rotated refresh tokens cannot be reused."""

	def setUp(self):
		self.client = APIClient(enforce_csrf_checks=True)
		self.user = User.objects.create_user(
			email='blacklist@example.com',
			password='Pass123!',
			full_name='Blacklist User',
			role=User.Role.CUSTOMER,
		)

	def _csrf(self):
		resp = self.client.get('/api/v1/auth/csrf/')
		return {'HTTP_X_CSRFTOKEN': resp.data['csrfToken']}

	def test_rotated_refresh_cookie_is_rejected(self):
		login = self.client.post('/api/v1/auth/login/', {
			'email': self.user.email,
			'password': 'Pass123!',
		})
		self.assertEqual(login.status_code, status.HTTP_200_OK)
		old_refresh = login.cookies[REFRESH_COOKIE_NAME].value

		first = self.client.post('/api/v1/auth/refresh/', {}, **self._csrf())
		self.assertEqual(first.status_code, status.HTTP_200_OK)
		self.assertIn('access', first.data)

		# Restore the old (rotated) refresh cookie and attempt reuse.
		self.client.cookies[REFRESH_COOKIE_NAME] = old_refresh
		reuse = self.client.post('/api/v1/auth/refresh/', {}, **self._csrf())
		self.assertEqual(reuse.status_code, status.HTTP_401_UNAUTHORIZED)
