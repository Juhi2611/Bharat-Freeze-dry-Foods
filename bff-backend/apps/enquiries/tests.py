from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User

from .models import Enquiry, PrivateLabelEnquiry


class PrivateLabelEnquiryAccessTests(APITestCase):
	"""B4: PL enquiry retrieve/PATCH must not be public; create stays public."""

	def setUp(self):
		self.admin = User.objects.create_user(
			email='pl-admin@example.com',
			password='AdminPass123!',
			full_name='PL Admin',
			role=User.Role.SUPER_ADMIN,
			is_staff=True,
		)
		self.create_url = '/api/v1/private-label-enquiries/'
		self.base_payload = {
			'company_name': 'Acme Foods Ltd',
			'contact_person': 'Alex Buyer',
			'email': 'alex@acme.example',
			'phone': '+91 98765 43210',
			'country': 'India',
			'brand_name': 'Acme Freeze',
		}

	def _admin_client(self):
		refresh = RefreshToken.for_user(self.admin)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

	def test_anonymous_create_still_works(self):
		response = self.client.post(self.create_url, self.base_payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(PrivateLabelEnquiry.objects.filter(email='alex@acme.example').exists())
		enquiry = PrivateLabelEnquiry.objects.get(pk=response.data['id'])
		self.assertEqual(enquiry.status, Enquiry.Status.NEW)
		self.assertEqual(enquiry.internal_notes, '')

	def test_anonymous_retrieve_is_rejected(self):
		enquiry = PrivateLabelEnquiry.objects.create(**self.base_payload)

		response = self.client.get(f'{self.create_url}{enquiry.id}/')

		self.assertIn(
			response.status_code,
			(status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
		)

	def test_anonymous_partial_update_is_rejected(self):
		enquiry = PrivateLabelEnquiry.objects.create(**self.base_payload)

		response = self.client.patch(
			f'{self.create_url}{enquiry.id}/',
			{'status': Enquiry.Status.CONTACTED, 'internal_notes': 'hacked'},
			format='json',
		)

		self.assertIn(
			response.status_code,
			(status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
		)
		enquiry.refresh_from_db()
		self.assertEqual(enquiry.status, Enquiry.Status.NEW)
		self.assertEqual(enquiry.internal_notes, '')

	def test_anonymous_create_ignores_staff_only_fields(self):
		payload = {
			**self.base_payload,
			'email': 'attacker@example.com',
			'status': Enquiry.Status.CLOSED,
			'internal_notes': 'attacker-controlled notes',
		}

		response = self.client.post(self.create_url, payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		enquiry = PrivateLabelEnquiry.objects.get(pk=response.data['id'])
		self.assertEqual(enquiry.status, Enquiry.Status.NEW)
		self.assertEqual(enquiry.internal_notes, '')
		self.assertNotIn('status', response.data)
		self.assertNotIn('internal_notes', response.data)

	def test_admin_retrieve_and_update_still_work(self):
		enquiry = PrivateLabelEnquiry.objects.create(**self.base_payload)
		self._admin_client()

		get_response = self.client.get(f'{self.create_url}{enquiry.id}/')
		self.assertEqual(get_response.status_code, status.HTTP_200_OK)
		self.assertEqual(get_response.data['company_name'], 'Acme Foods Ltd')

		patch_response = self.client.patch(
			f'{self.create_url}{enquiry.id}/',
			{
				'status': Enquiry.Status.CONTACTED,
				'internal_notes': 'Follow up next week',
			},
			format='json',
		)
		self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
		enquiry.refresh_from_db()
		self.assertEqual(enquiry.status, Enquiry.Status.CONTACTED)
		self.assertEqual(enquiry.internal_notes, 'Follow up next week')
