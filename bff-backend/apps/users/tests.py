from datetime import timedelta
from unittest.mock import patch

from django.core import mail
from django.test import override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.crm.models import Customer

from .models import EmailOTP, User
from .otp import OTP_SEND_SUCCESS_DETAIL, check_otp_code, hash_otp_code


@override_settings(
	EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
	# Keep IP throttle high for most tests; B7 throttle test overrides lower.
	REST_FRAMEWORK={
		'DEFAULT_AUTHENTICATION_CLASSES': (
			'rest_framework_simplejwt.authentication.JWTAuthentication',
		),
		'DEFAULT_PERMISSION_CLASSES': (
			'rest_framework.permissions.IsAuthenticated',
		),
		'DEFAULT_THROTTLE_RATES': {
			'otp_send': '1000/hour',
		},
	},
)
class AuthenticationTests(APITestCase):
	def setUp(self):
		# Enforce CSRF so cookie-auth endpoints are tested as in production (F5).
		from rest_framework.test import APIClient
		self.client = APIClient(enforce_csrf_checks=True)
		self.admin = User.objects.create_user(
			email='admin@example.com',
			password='AdminPass123!',
			full_name='Admin User',
			role=User.Role.SUPER_ADMIN,
			is_staff=True,
			is_superuser=True,
		)
		self.customer = User.objects.create_user(
			email='customer@example.com',
			password='CustomerPass123!',
			full_name='Customer User',
			role=User.Role.CUSTOMER,
		)

	def _verify_email(self, email: str, code: str = '123456'):
		EmailOTP.objects.create(
			email=email.lower(),
			code_hash=hash_otp_code(code),
			is_verified=True,
			verified_at=timezone.now(),
			expires_at=timezone.now() + timedelta(minutes=10),
		)

	def _csrf_header(self):
		"""Fetch CSRF cookie + header required for cookie-authenticated auth mutations."""
		resp = self.client.get('/api/v1/auth/csrf/')
		self.assertEqual(resp.status_code, status.HTTP_200_OK)
		token = resp.data['csrfToken']
		self.assertTrue(token)
		return {'HTTP_X_CSRFTOKEN': token}

	def test_successful_login_sets_httponly_refresh_cookie_not_body(self):
		"""F5: login returns access only; refresh is httpOnly cookie."""
		from apps.users.auth_cookies import REFRESH_COOKIE_NAME

		response = self.client.post('/api/v1/auth/login/', {
			'email': self.admin.email,
			'password': 'AdminPass123!',
		})

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('access', response.data)
		self.assertNotIn('refresh', response.data)
		self.assertIn(REFRESH_COOKIE_NAME, response.cookies)
		cookie = response.cookies[REFRESH_COOKIE_NAME]
		self.assertTrue(cookie['httponly'])
		self.assertTrue(cookie.value)

	def test_invalid_credentials_are_rejected(self):
		response = self.client.post('/api/v1/auth/login/', {
			'email': self.admin.email,
			'password': 'wrong-password',
		})

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_refresh_via_cookie_returns_access_and_rotates_cookie(self):
		"""F5: refresh reads cookie (not body), returns access, rotates refresh cookie."""
		from apps.users.auth_cookies import REFRESH_COOKIE_NAME

		login = self.client.post('/api/v1/auth/login/', {
			'email': self.admin.email,
			'password': 'AdminPass123!',
		})
		old_refresh = login.cookies[REFRESH_COOKIE_NAME].value
		csrf = self._csrf_header()

		response = self.client.post('/api/v1/auth/refresh/', {}, **csrf)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('access', response.data)
		self.assertNotIn('refresh', response.data)
		self.assertIn(REFRESH_COOKIE_NAME, response.cookies)
		self.assertNotEqual(response.cookies[REFRESH_COOKIE_NAME].value, old_refresh)

	def test_refresh_without_cookie_is_rejected(self):
		csrf = self._csrf_header()
		response = self.client.post('/api/v1/auth/refresh/', {}, **csrf)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_refresh_without_csrf_is_rejected(self):
		from apps.users.auth_cookies import REFRESH_COOKIE_NAME

		login = self.client.post('/api/v1/auth/login/', {
			'email': self.admin.email,
			'password': 'AdminPass123!',
		})
		self.assertIn(REFRESH_COOKIE_NAME, login.cookies)
		self.client.get('/api/v1/auth/csrf/')
		response = self.client.post('/api/v1/auth/refresh/', {})
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_logout_clears_refresh_cookie(self):
		"""F5: logout expires/clears the httpOnly refresh cookie."""
		from apps.users.auth_cookies import REFRESH_COOKIE_NAME

		login = self.client.post('/api/v1/auth/login/', {
			'email': self.admin.email,
			'password': 'AdminPass123!',
		})
		self.assertIn(REFRESH_COOKIE_NAME, login.cookies)
		csrf = self._csrf_header()

		response = self.client.post('/api/v1/auth/logout/', {}, **csrf)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		cleared = response.cookies.get(REFRESH_COOKIE_NAME)
		self.assertIsNotNone(cleared)
		self.assertEqual(cleared.value, '')

		self.client.cookies.pop(REFRESH_COOKIE_NAME, None)
		csrf2 = self._csrf_header()
		blocked = self.client.post('/api/v1/auth/refresh/', {}, **csrf2)
		self.assertEqual(blocked.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_me_without_access_token_is_rejected(self):
		response = self.client.get('/api/v1/auth/me/')
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_customer_is_denied_admin_api_access(self):
		refresh = RefreshToken.for_user(self.customer)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

		response = self.client.get('/api/v1/admin/users/')

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_unauthenticated_user_is_denied_admin_api_access(self):
		response = self.client.get('/api/v1/admin/users/')

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_clearing_client_credentials_removes_authenticated_access(self):
		refresh = RefreshToken.for_user(self.admin)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
		self.assertEqual(self.client.get('/api/v1/auth/me/').status_code, status.HTTP_200_OK)

		self.client.credentials()

		self.assertEqual(
			self.client.get('/api/v1/auth/me/').status_code,
			status.HTTP_401_UNAUTHORIZED,
		)

	def test_send_otp_same_response_for_existing_and_new_email(self):
		"""B7: send-otp must not reveal whether an email is already registered."""
		existing_response = self.client.post('/api/v1/auth/send-otp/', {
			'email': self.customer.email,
		})
		new_response = self.client.post('/api/v1/auth/send-otp/', {
			'email': 'brand-new-otp@example.com',
		})

		self.assertEqual(existing_response.status_code, status.HTTP_200_OK)
		self.assertEqual(new_response.status_code, status.HTTP_200_OK)
		self.assertEqual(existing_response.data, new_response.data)
		self.assertEqual(existing_response.data['detail'], OTP_SEND_SUCCESS_DETAIL)
		# No OTP row for already-registered emails.
		self.assertFalse(
			EmailOTP.objects.filter(email=self.customer.email.lower()).exists()
		)
		self.assertTrue(
			EmailOTP.objects.filter(email='brand-new-otp@example.com').exists()
		)

	@patch('apps.users.otp.generate_otp_code', return_value='424242')
	def test_send_and_verify_otp_stores_hash_not_plaintext(self, _mock_code):
		"""B7: OTP round-trip works and DB never stores the raw code."""
		email = 'otp-user@example.com'
		send_response = self.client.post('/api/v1/auth/send-otp/', {'email': email})
		self.assertEqual(send_response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(mail.outbox), 1)
		self.assertIn('424242', mail.outbox[0].body)

		otp = EmailOTP.objects.get(email=email)
		self.assertNotEqual(otp.code_hash, '424242')
		self.assertEqual(len(otp.code_hash), 64)
		self.assertTrue(check_otp_code('424242', otp.code_hash))
		self.assertEqual(otp.code_hash, hash_otp_code('424242'))
		# Ensure no accidental plaintext column/value.
		self.assertFalse(hasattr(otp, 'code') and otp.__dict__.get('code') == '424242')

		verify_response = self.client.post('/api/v1/auth/verify-otp/', {
			'email': email,
			'otp': '424242',
		})
		self.assertEqual(verify_response.status_code, status.HTTP_200_OK)
		self.assertTrue(verify_response.data['verified'])

		register_response = self.client.post('/api/v1/auth/register/', {
			'email': email,
			'password': 'NewCustomerPass123!',
			'confirm_password': 'NewCustomerPass123!',
			'full_name': 'OTP User',
		})
		self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
		self.assertFalse(EmailOTP.objects.filter(email=email).exists())

	@override_settings(
		REST_FRAMEWORK={
			'DEFAULT_AUTHENTICATION_CLASSES': (
				'rest_framework_simplejwt.authentication.JWTAuthentication',
			),
			'DEFAULT_PERMISSION_CLASSES': (
				'rest_framework.permissions.IsAuthenticated',
			),
			'DEFAULT_THROTTLE_RATES': {
				'otp_send': '3/hour',
			},
		},
	)
	def test_send_otp_ip_throttle_rejects_excessive_requests(self):
		"""B7: IP throttle blocks burst send-otp abuse."""
		from django.core.cache import cache

		from apps.users.views import SendOTPIPThrottle

		cache.clear()
		# DRF caches rate resolution; force the narrowed rate for this test.
		with patch.object(SendOTPIPThrottle, 'get_rate', return_value='3/hour'):
			statuses = []
			for i in range(5):
				response = self.client.post(
					'/api/v1/auth/send-otp/',
					{'email': f'throttle-{i}@example.com'},
					REMOTE_ADDR='203.0.113.50',
				)
				statuses.append(response.status_code)

		self.assertEqual(statuses[:3], [status.HTTP_200_OK] * 3)
		self.assertIn(status.HTTP_429_TOO_MANY_REQUESTS, statuses)

	def test_register_without_otp_verification_is_rejected(self):
		response = self.client.post('/api/v1/auth/register/', {
			'email': 'unverified@example.com',
			'password': 'NewCustomerPass123!',
			'confirm_password': 'NewCustomerPass123!',
			'full_name': 'Unverified User',
		})
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('email', response.data)

	def test_customer_registration_links_existing_crm_customer_case_insensitively(self):
		crm_customer = Customer.objects.create(
			full_name='Existing Customer',
			company_name='Existing Company',
			email='EXISTING@EXAMPLE.COM',
			phone='+1 555 0100',
			country='United States',
		)
		self._verify_email('existing@example.com')

		response = self.client.post('/api/v1/auth/register/', {
			'email': 'existing@example.com',
			'password': 'NewCustomerPass123!',
			'confirm_password': 'NewCustomerPass123!',
			'full_name': 'Customer User',
		})

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		crm_customer.refresh_from_db()
		self.assertEqual(Customer.objects.filter(email__iexact='existing@example.com').count(), 1)
		self.assertEqual(crm_customer.user.email, 'existing@example.com')

	def test_customer_registration_creates_new_linked_crm_customer(self):
		self._verify_email('new-customer@example.com')
		response = self.client.post('/api/v1/auth/register/', {
			'email': 'new-customer@example.com',
			'password': 'NewCustomerPass123!',
			'confirm_password': 'NewCustomerPass123!',
			'full_name': 'New Customer',
		})

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		crm_customer = Customer.objects.get(email='new-customer@example.com')
		self.assertEqual(str(crm_customer.user_id), response.data['user']['id'])
		self.assertEqual(crm_customer.full_name, 'New Customer')
		self.assertEqual(crm_customer.company_name, '')

	def test_customer_me_links_existing_crm_customer(self):
		crm_customer = Customer.objects.create(
			full_name='Customer User',
			company_name='Customer Company',
			email=self.customer.email,
			phone='',
			country='',
		)
		refresh = RefreshToken.for_user(self.customer)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

		response = self.client.get('/api/v1/auth/me/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		crm_customer.refresh_from_db()
		self.assertEqual(crm_customer.user_id, self.customer.id)

	def test_existing_customer_linked_to_another_user_is_not_relinked(self):
		other_user = User.objects.create_user(
			email='other@example.com',
			password='OtherPass123!',
			full_name='Other User',
			role=User.Role.CUSTOMER,
		)
		crm_customer = Customer.objects.create(
			full_name='Conflict Customer',
			company_name='',
			email='CONFLICT@example.com',
			phone='',
			country='',
			user=other_user,
		)
		self._verify_email('conflict@example.com')

		response = self.client.post('/api/v1/auth/register/', {
			'email': 'conflict@example.com',
			'password': 'NewCustomerPass123!',
			'confirm_password': 'NewCustomerPass123!',
			'full_name': 'Conflicting User',
		})

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		crm_customer.refresh_from_db()
		self.assertEqual(crm_customer.user_id, other_user.id)
		self.assertEqual(Customer.objects.filter(email__iexact='conflict@example.com').count(), 2)
		new_user = User.objects.get(email='conflict@example.com')
		new_customer = Customer.objects.get(user=new_user)
		self.assertNotEqual(new_customer.pk, crm_customer.pk)
		self.assertEqual(new_customer.email.lower(), 'conflict@example.com')
