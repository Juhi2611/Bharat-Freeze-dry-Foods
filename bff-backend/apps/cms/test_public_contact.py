"""Public CMS contact endpoint — no auth, narrow fields only."""

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.cms.models import SiteSettings
from apps.users.models import User


class PublicContactApiTests(APITestCase):
	def setUp(self):
		self.settings, _ = SiteSettings.objects.get_or_create(pk=1)
		self.settings.whatsapp_number = '+91 99933 77038'
		self.settings.support_phone = '+91 99933 77038'
		self.settings.support_email = 'export@bff-foods.com'
		self.settings.company_name = 'Secret Internal Name'
		self.settings.social_links = {'internal': 'admin-only'}
		self.settings.save()

	def test_public_contact_without_auth(self):
		response = self.client.get('/api/v1/cms/public-contact/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['whatsapp_number'], '+91 99933 77038')
		self.assertEqual(response.data['support_phone'], '+91 99933 77038')
		self.assertEqual(response.data['support_email'], 'export@bff-foods.com')
		self.assertNotIn('company_name', response.data)
		self.assertNotIn('social_links', response.data)
		self.assertNotIn('tagline', response.data)

	def test_full_site_settings_get_requires_staff(self):
		editor = User.objects.create_user(
			email='editor@example.com',
			password='Pass123!',
			full_name='Editor',
			role=User.Role.CUSTOMER,
		)
		token = RefreshToken.for_user(editor).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
		response = self.client.get('/api/v1/cms/settings')
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_full_site_settings_get_allowed_for_content_staff(self):
		editor = User.objects.create_user(
			email='staff@example.com',
			password='Pass123!',
			full_name='Staff',
			role=User.Role.CONTENT_EDITOR,
			is_staff=True,
		)
		token = RefreshToken.for_user(editor).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
		response = self.client.get('/api/v1/cms/settings')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('company_name', response.data)
