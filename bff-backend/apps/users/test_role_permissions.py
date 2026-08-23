"""B10: content_editor vs CRM staff permission matrix."""

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import Category, Product
from apps.crm.models import Customer, Order
from apps.users.models import User


class RolePermissionMatrixTests(APITestCase):
	def setUp(self):
		self.super_admin = User.objects.create_user(
			email='super@example.com',
			password='Pass123!',
			full_name='Super Admin',
			role=User.Role.SUPER_ADMIN,
			is_staff=True,
			is_superuser=True,
		)
		self.export_manager = User.objects.create_user(
			email='export@example.com',
			password='Pass123!',
			full_name='Export Manager',
			role=User.Role.EXPORT_MANAGER,
			is_staff=True,
		)
		self.content_editor = User.objects.create_user(
			email='editor@example.com',
			password='Pass123!',
			full_name='Content Editor',
			role=User.Role.CONTENT_EDITOR,
			is_staff=True,
		)
		self.category = Category.objects.create(
			name='Test Cat',
			slug='test-cat',
			description='d',
			availability='available',
			display_order=1,
		)
		self.product = Product.objects.create(
			sku='SKU-B10',
			name='B10 Product',
			slug='b10-product',
			category=self.category,
			price_inr=100,
			status=Product.Status.PUBLISHED,
			blurb='b',
			stock_quantity=10,
		)
		self.customer = Customer.objects.create(
			full_name='Buyer',
			company_name='Co',
			email='buyer@example.com',
			phone='',
			country='IN',
		)
		self.order = Order.objects.create(
			customer=self.customer,
			items_summary='1x item',
			total_amount='100.00',
			currency='INR',
			payment_status=Order.PaymentStatus.PENDING,
		)

	def _auth(self, user):
		token = RefreshToken.for_user(user).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

	def test_content_editor_can_manage_products(self):
		self._auth(self.content_editor)
		response = self.client.patch(
			f'/api/v1/products/{self.product.slug}/',
			{'blurb': 'updated by editor'},
			format='json',
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.product.refresh_from_db()
		self.assertEqual(self.product.blurb, 'updated by editor')

	def test_content_editor_forbidden_on_orders_and_customers(self):
		self._auth(self.content_editor)
		self.assertEqual(
			self.client.get('/api/v1/orders/').status_code,
			status.HTTP_403_FORBIDDEN,
		)
		self.assertEqual(
			self.client.get('/api/v1/customers/').status_code,
			status.HTTP_403_FORBIDDEN,
		)
		self.assertEqual(
			self.client.get(f'/api/v1/orders/{self.order.id}/').status_code,
			status.HTTP_403_FORBIDDEN,
		)

	def test_export_manager_forbidden_on_crm_endpoints(self):
		"""CRM restricted to super_admin — export_manager gets 403."""
		self._auth(self.export_manager)
		self.assertEqual(
			self.client.get('/api/v1/orders/').status_code,
			status.HTTP_403_FORBIDDEN,
		)
		self.assertEqual(
			self.client.get('/api/v1/customers/').status_code,
			status.HTTP_403_FORBIDDEN,
		)
		self.assertEqual(
			self.client.get('/api/v1/enquiries/').status_code,
			status.HTTP_403_FORBIDDEN,
		)

	def test_super_admin_unaffected(self):
		self._auth(self.super_admin)
		self.assertEqual(self.client.get('/api/v1/orders/').status_code, status.HTTP_200_OK)
		self.assertEqual(
			self.client.patch(
				f'/api/v1/products/{self.product.slug}/',
				{'blurb': 'by super'},
				format='json',
			).status_code,
			status.HTTP_200_OK,
		)
