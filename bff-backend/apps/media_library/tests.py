"""Media library upload tests."""

from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.media_library.models import MediaFile
from apps.users.models import User


class MediaUploadTests(APITestCase):
	def setUp(self):
		self.editor = User.objects.create_user(
			email='media-editor@example.com',
			password='Pass123!',
			full_name='Media Editor',
			role=User.Role.CONTENT_EDITOR,
			is_staff=True,
		)
		token = RefreshToken.for_user(self.editor).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

	def test_upload_image_from_device(self):
		# Minimal valid-enough PNG header bytes for content-type check.
		png = SimpleUploadedFile(
			'category-cover.png',
			b'\x89PNG\r\n\x1a\n' + b'\x00' * 64,
			content_type='image/png',
		)
		response = self.client.post(
			'/api/v1/media/files/',
			{'file': png, 'category': 'Categories'},
			format='multipart',
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(response.data['file_url'])
		self.assertEqual(response.data['file_name'], 'category-cover.png')
		self.assertEqual(response.data['category'], 'Categories')
		self.assertTrue(MediaFile.objects.filter(id=response.data['id']).exists())

	def test_reject_non_image(self):
		txt = SimpleUploadedFile('notes.txt', b'hello', content_type='text/plain')
		response = self.client.post(
			'/api/v1/media/files/',
			{'file': txt},
			format='multipart',
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
