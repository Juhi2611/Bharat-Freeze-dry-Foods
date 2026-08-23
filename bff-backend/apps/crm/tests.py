from decimal import Decimal
import hashlib
import hmac
import json
import threading
import time
from unittest.mock import MagicMock, patch

from django.db import close_old_connections, connection, connections
from django.test import TestCase, TransactionTestCase
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import Category, Product
from apps.enquiries.models import Enquiry
from apps.users.models import User

from .models import Customer, Order, OrderItem
from .payment_utils import generate_guest_order_access_token
from .serializers import OrderSerializer


class OrderItemTests(TestCase):
	def setUp(self):
		self.category = Category.objects.create(name='Fruits', slug='fruits')
		self.product = Product.objects.create(
			sku='BFF-MANGO-001',
			name='Alphonso Mango',
			slug='alphonso-mango',
			category=self.category,
			pack_image='https://example.com/mango-pack.jpg',
			ingredient_image='https://example.com/mango.jpg',
			price_inr=Decimal('349.00'),
			blurb='Freeze-dried Alphonso mango.',
		)
		self.order = Order.objects.create(
			items_summary='Alphonso Mango x 3',
			total_amount=Decimal('1047.00'),
			currency='INR',
		)

	def test_total_price_is_calculated_from_snapshot_price_and_quantity(self):
		item = OrderItem.objects.create(
			order=self.order,
			product=self.product,
			product_name_snapshot='Alphonso Mango',
			unit_price_snapshot=Decimal('349.00'),
			quantity=3,
		)

		self.assertEqual(item.total_price, Decimal('1047.00'))

	def test_order_serializer_preserves_summary_and_returns_nested_items(self):
		OrderItem.objects.create(
			order=self.order,
			product=self.product,
			product_name_snapshot='Alphonso Mango',
			unit_price_snapshot=Decimal('349.00'),
			quantity=3,
		)

		data = OrderSerializer(self.order).data

		self.assertEqual(data['items_summary'], 'Alphonso Mango x 3')
		self.assertEqual(len(data['items']), 1)
		self.assertEqual(data['items'][0]['product_name_snapshot'], 'Alphonso Mango')
		self.assertEqual(data['items'][0]['total_price'], '1047.00')

	def test_product_deletion_preserves_order_item_and_snapshot(self):
		item = OrderItem.objects.create(
			order=self.order,
			product=self.product,
			product_name_snapshot='Alphonso Mango',
			unit_price_snapshot=Decimal('349.00'),
			quantity=3,
		)

		self.product.delete()
		item.refresh_from_db()

		self.assertIsNone(item.product)
		self.assertEqual(item.product_name_snapshot, 'Alphonso Mango')
		self.assertEqual(item.total_price, Decimal('1047.00'))


class OrderCheckoutApiTests(APITestCase):
	def setUp(self):
		self.category = Category.objects.create(name='Spices', slug='spices')
		self.product_1 = Product.objects.create(
			sku='BFF-TURMERIC-001',
			name='Turmeric Powder',
			slug='turmeric-powder',
			category=self.category,
			pack_image='https://example.com/turmeric-pack.jpg',
			ingredient_image='https://example.com/turmeric.jpg',
			price_inr=Decimal('120.00'),
			blurb='Turmeric powder',
			stock_quantity=50,
			status=Product.Status.PUBLISHED,
		)
		self.product_2 = Product.objects.create(
			sku='BFF-GARLIC-001',
			name='Garlic Powder',
			slug='garlic-powder',
			category=self.category,
			pack_image='https://example.com/garlic-pack.jpg',
			ingredient_image='https://example.com/garlic.jpg',
			price_inr=Decimal('80.00'),
			blurb='Garlic powder',
			stock_quantity=30,
			status=Product.Status.PUBLISHED,
		)

	def _payload(self):
		return {
			'company_name': 'BFF Buyers LLC',
			'contact_person': 'Jane Doe',
			'email': 'jane@buyers.com',
			'phone': '+1 555 1000',
			'country': 'United States',
			'shipping_method': 'sea_fcl',
			'incoterm': 'FOB',
			'payment_terms': 'advance_tt',
			'message': 'Need this month dispatch',
			'cart': [
				{
					'product_id': str(self.product_1.id),
					'quantity': 2,
					'price': '1.00',
				},
				{
					'product_id': str(self.product_2.id),
					'quantity': 3,
					'unit_price': '1.00',
				},
			],
		}

	def test_checkout_creates_order_items_and_uses_server_side_pricing(self):
		response = self.client.post('/api/v1/orders/checkout/', self._payload(), format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(Order.objects.count(), 1)
		self.assertEqual(OrderItem.objects.count(), 2)
		self.assertEqual(Enquiry.objects.count(), 0)

		order = Order.objects.get()
		self.assertEqual(order.customer, None)
		self.assertEqual(order.payment_status, Order.PaymentStatus.AWAITING_QUOTE)
		self.assertEqual(order.total_amount, Decimal('480.00'))

		items = order.items.order_by('product_name_snapshot')
		self.assertEqual(items[0].product_name_snapshot, 'Garlic Powder')
		self.assertEqual(items[0].unit_price_snapshot, Decimal('80.00'))
		self.assertEqual(items[0].quantity, 3)
		self.assertEqual(items[0].total_price, Decimal('240.00'))
		self.assertEqual(items[1].product_name_snapshot, 'Turmeric Powder')
		self.assertEqual(items[1].unit_price_snapshot, Decimal('120.00'))
		self.assertEqual(items[1].quantity, 2)
		self.assertEqual(items[1].total_price, Decimal('240.00'))

	def test_authenticated_checkout_links_order_customer_via_ensure_customer_for_user(self):
		user = User.objects.create_user(
			email='checkout-customer@example.com',
			password='CustomerPass123!',
			full_name='Checkout Customer',
			role=User.Role.CUSTOMER,
		)
		refresh = RefreshToken.for_user(user)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

		payload = self._payload()
		payload['email'] = user.email
		response = self.client.post('/api/v1/orders/checkout/', payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		order = Order.objects.get()
		self.assertIsNotNone(order.customer)
		self.assertEqual(order.customer.user_id, user.id)
		self.assertEqual(order.customer.email, user.email)
		self.assertEqual(Enquiry.objects.count(), 0)

	def test_guest_checkout_keeps_customer_null(self):
		response = self.client.post('/api/v1/orders/checkout/', self._payload(), format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		order = Order.objects.get()
		self.assertIsNone(order.customer)
		self.assertIn('order_access_token', response.data)
		self.assertEqual(Enquiry.objects.count(), 0)

	def test_guest_checkout_persists_contact_fields_on_order(self):
		"""B8: guest checkout contact payload must be saved on the Order row."""
		payload = self._payload()
		payload.update({
			'company_name': 'Guest Co LLC',
			'contact_person': 'Guest Buyer',
			'email': 'guest-buyer@example.com',
			'phone': '+1 555 0199',
			'country': 'Canada',
			'shipping_method': 'sea_fcl',
			'incoterm': 'FOB',
			'payment_terms': 'advance_tt',
			'message': 'Please confirm MOQ',
		})

		response = self.client.post('/api/v1/orders/checkout/', payload, format='json')
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		order = Order.objects.get(id=response.data['id'])
		self.assertIsNone(order.customer)
		self.assertEqual(order.guest_company_name, 'Guest Co LLC')
		self.assertEqual(order.guest_contact_name, 'Guest Buyer')
		self.assertEqual(order.guest_email, 'guest-buyer@example.com')
		self.assertEqual(order.guest_phone, '+1 555 0199')
		self.assertEqual(order.guest_country, 'Canada')
		self.assertEqual(order.guest_shipping_method, 'sea_fcl')
		self.assertEqual(order.guest_incoterm, 'FOB')
		self.assertEqual(order.guest_payment_terms, 'advance_tt')
		self.assertEqual(order.guest_message, 'Please confirm MOQ')
		# Admin-facing serializer fields fall back to guest contact.
		self.assertEqual(response.data['customer_name'], 'Guest Buyer')
		self.assertEqual(response.data['customer_email'], 'guest-buyer@example.com')
		self.assertEqual(response.data['customer_company'], 'Guest Co LLC')
		self.assertEqual(response.data['customer_phone'], '+1 555 0199')
		self.assertEqual(response.data['customer_country'], 'Canada')

	def test_retail_checkout_accepts_empty_company_and_shipping_in_message(self):
		"""Pay Now: minimal retail payload — no company/B2B fields."""
		payload = {
			'company_name': '',
			'contact_person': 'Retail Buyer',
			'email': 'retail@example.com',
			'phone': '+91 9876543210',
			'country': 'India',
			'message': 'Shipping address:\n12 MG Road\nMumbai, Maharashtra 400001\nIndia',
			'cart': [
				{'product_id': str(self.product_1.id), 'quantity': 1},
			],
		}
		response = self.client.post('/api/v1/orders/checkout/', payload, format='json')
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		order = Order.objects.get(id=response.data['id'])
		self.assertEqual(order.guest_company_name, '')
		self.assertEqual(order.guest_contact_name, 'Retail Buyer')
		self.assertIn('MG Road', order.guest_message)
		self.assertEqual(order.guest_shipping_method, '')
		self.assertEqual(order.guest_incoterm, '')

	def test_checkout_rejects_nonexistent_product_and_creates_no_partial_order(self):
		payload = self._payload()
		payload['cart'][1]['product_id'] = '9dc87b26-91c4-4628-a257-7164cb0da4d4'

		response = self.client.post('/api/v1/orders/checkout/', payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('does not exist', str(response.data.get('error', '')))
		self.assertEqual(Order.objects.count(), 0)
		self.assertEqual(OrderItem.objects.count(), 0)
		self.assertEqual(Enquiry.objects.count(), 0)


class ConcurrentCheckoutStockTests(TransactionTestCase):
	reset_sequences = True

	def setUp(self):
		self.category = Category.objects.create(name='Concurrent', slug='concurrent')
		self.product = Product.objects.create(
			sku='BFF-CONCURRENT-001',
			name='Limited Product',
			slug='limited-product',
			category=self.category,
			pack_image='https://example.com/limited-pack.jpg',
			ingredient_image='https://example.com/limited.jpg',
			price_inr=Decimal('100.00'),
			blurb='Limited product',
			stock_quantity=1,
			status=Product.Status.PUBLISHED,
		)

	def test_concurrent_checkouts_cannot_oversell_same_stock(self):
		barrier = threading.Barrier(2)
		responses = []

		def submit_checkout():
			from rest_framework.test import APIClient

			close_old_connections()
			client = APIClient()
			payload = {
				'company_name': 'Concurrent Buyer',
				'contact_person': 'Concurrent User',
				'email': 'concurrent@example.com',
				'phone': '',
				'country': 'India',
				'cart': [{'product_id': str(self.product.id), 'quantity': 1}],
			}
			try:
				barrier.wait(timeout=10)
				for attempt in range(5):
					try:
						response = client.post('/api/v1/orders/checkout/', payload, format='json')
						responses.append(response)
						break
					except Exception as exc:
						if 'database table is locked' not in str(exc) or attempt == 4:
							raise
						time.sleep(0.05)
			except Exception as exc:
				responses.append(exc)
			finally:
				connections.close_all()

		threads = [threading.Thread(target=submit_checkout) for _ in range(2)]
		for thread in threads:
			thread.start()
		for thread in threads:
			thread.join(timeout=20)

		self.assertEqual(len(responses), 2)
		successes = [response for response in responses if getattr(response, 'status_code', None) == 201]
		if connection.vendor == 'sqlite':
			self.assertLessEqual(len(successes), 1)
		else:
			self.assertEqual(len(successes), 1)

		self.product.refresh_from_db()
		self.assertEqual(self.product.stock_quantity, 0)
		self.assertEqual(Order.objects.count(), 1)
		self.assertEqual(OrderItem.objects.count(), 1)


@override_settings(
	RAZORPAY_KEY_ID='rzp_test_key',
	RAZORPAY_KEY_SECRET='test_secret',
	RAZORPAY_WEBHOOK_SECRET='webhook_secret',
)
class RazorpayPaymentFlowTests(APITestCase):
	def setUp(self):
		self.category = Category.objects.create(name='Pet Foods', slug='pet-foods')
		self.product = Product.objects.create(
			sku='BFF-DOG-001',
			name='Dog Food',
			slug='dog-food',
			category=self.category,
			pack_image='https://example.com/dog-pack.jpg',
			ingredient_image='https://example.com/dog.jpg',
			price_inr=Decimal('250.00'),
			blurb='Dog food',
			stock_quantity=20,
			status=Product.Status.PUBLISHED,
		)
		self.owner_user = User.objects.create_user(
			email='owner@example.com',
			password='OwnerPass123!',
			full_name='Owner User',
			role=User.Role.CUSTOMER,
		)
		self.other_user = User.objects.create_user(
			email='other@example.com',
			password='OtherPass123!',
			full_name='Other User',
			role=User.Role.CUSTOMER,
		)

		owner_refresh = RefreshToken.for_user(self.owner_user)
		self.owner_token = str(owner_refresh.access_token)
		other_refresh = RefreshToken.for_user(self.other_user)
		self.other_token = str(other_refresh.access_token)

		self.owner_checkout_response = self.client.post(
			'/api/v1/orders/checkout/',
			{
				'company_name': 'Owner Co',
				'contact_person': 'Owner User',
				'email': self.owner_user.email,
				'phone': '',
				'country': 'India',
				'cart': [
					{'product_id': str(self.product.id), 'quantity': 2},
				],
			},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.owner_token}',
		)
		self.owner_order = Order.objects.get(id=self.owner_checkout_response.data['id'])

		guest_checkout_response = self.client.post(
			'/api/v1/orders/checkout/',
			{
				'company_name': 'Guest Co',
				'contact_person': 'Guest User',
				'email': 'guest@example.com',
				'phone': '',
				'country': 'India',
				'cart': [
					{'product_id': str(self.product.id), 'quantity': 1},
				],
			},
			format='json',
		)
		self.guest_order = Order.objects.get(id=guest_checkout_response.data['id'])
		self.guest_token = guest_checkout_response.data['order_access_token']

	def _payment_signature(self, razorpay_order_id, payment_id):
		payload = f'{razorpay_order_id}|{payment_id}'.encode('utf-8')
		return hmac.new(b'test_secret', payload, hashlib.sha256).hexdigest()

	def _webhook_signature(self, payload_bytes):
		return hmac.new(b'webhook_secret', payload_bytes, hashlib.sha256).hexdigest()

	@patch('apps.crm.views.razorpay.Client')
	def test_create_payment_recalculates_total_and_calls_razorpay(self, mock_client_cls):
		self.owner_order.total_amount = Decimal('1.00')
		self.owner_order.save(update_fields=['total_amount'])

		client_mock = MagicMock()
		client_mock.order.create.return_value = {'id': 'order_rzp_123'}
		mock_client_cls.return_value = client_mock

		response = self.client.post(
			f'/api/v1/orders/{self.owner_order.id}/create-payment/',
			{},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.owner_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.owner_order.refresh_from_db()
		self.assertEqual(self.owner_order.total_amount, Decimal('500.00'))
		self.assertEqual(self.owner_order.razorpay_order_id, 'order_rzp_123')
		self.assertEqual(response.data['amount'], 50000)
		self.assertEqual(response.data['currency'], 'INR')
		self.assertEqual(response.data['key_id'], 'rzp_test_key')

		client_mock.order.create.assert_called_once()

	def test_create_payment_rejects_already_paid_order(self):
		self.owner_order.payment_status = Order.PaymentStatus.PAID
		self.owner_order.save(update_fields=['payment_status'])

		response = self.client.post(
			f'/api/v1/orders/{self.owner_order.id}/create-payment/',
			{},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.owner_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('already paid', response.data['error'].lower())

	def test_create_payment_rejects_order_access_for_other_customer(self):
		response = self.client.post(
			f'/api/v1/orders/{self.owner_order.id}/create-payment/',
			{},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.other_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	@patch('apps.crm.views.razorpay.Client')
	def test_create_payment_allows_guest_with_access_token(self, mock_client_cls):
		client_mock = MagicMock()
		client_mock.order.create.return_value = {'id': 'order_guest_123'}
		mock_client_cls.return_value = client_mock

		response = self.client.post(
			f'/api/v1/orders/{self.guest_order.id}/create-payment/',
			{'order_access_token': self.guest_token},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.guest_order.refresh_from_db()
		self.assertEqual(self.guest_order.razorpay_order_id, 'order_guest_123')

	@patch('apps.crm.views.fetch_razorpay_payment')
	def test_verify_payment_with_valid_signature_marks_order_paid(self, mock_fetch):
		self.owner_order.razorpay_order_id = 'order_valid_1'
		self.owner_order.total_amount = Decimal('500.00')
		self.owner_order.currency = 'INR'
		self.owner_order.save(update_fields=['razorpay_order_id', 'total_amount', 'currency'])

		payment_id = 'pay_valid_1'
		signature = self._payment_signature(self.owner_order.razorpay_order_id, payment_id)
		mock_fetch.return_value = {
			'id': payment_id,
			'status': 'captured',
			'amount': 50000,
			'currency': 'INR',
			'order_id': 'order_valid_1',
		}

		response = self.client.post(
			f'/api/v1/orders/{self.owner_order.id}/verify-payment/',
			{
				'razorpay_payment_id': payment_id,
				'razorpay_signature': signature,
			},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.owner_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.owner_order.refresh_from_db()
		self.assertEqual(self.owner_order.payment_status, Order.PaymentStatus.PAID)
		self.assertEqual(self.owner_order.razorpay_payment_id, payment_id)
		mock_fetch.assert_called_once_with(payment_id)

	@patch('apps.crm.views.fetch_razorpay_payment')
	def test_verify_payment_rejects_amount_mismatch_despite_valid_signature(self, mock_fetch):
		"""B9: valid HMAC + wrong Razorpay amount must not mark Paid."""
		self.owner_order.razorpay_order_id = 'order_amt_1'
		self.owner_order.total_amount = Decimal('500.00')
		self.owner_order.currency = 'INR'
		self.owner_order.save(update_fields=['razorpay_order_id', 'total_amount', 'currency'])

		payment_id = 'pay_amt_1'
		signature = self._payment_signature(self.owner_order.razorpay_order_id, payment_id)
		mock_fetch.return_value = {
			'id': payment_id,
			'status': 'captured',
			'amount': 100,  # 1 INR — does not match order
			'currency': 'INR',
			'order_id': 'order_amt_1',
		}

		response = self.client.post(
			f'/api/v1/orders/{self.owner_order.id}/verify-payment/',
			{
				'razorpay_payment_id': payment_id,
				'razorpay_signature': signature,
			},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.owner_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('amount', response.data['error'].lower())
		self.owner_order.refresh_from_db()
		self.assertNotEqual(self.owner_order.payment_status, Order.PaymentStatus.PAID)

	@patch('apps.crm.views.fetch_razorpay_payment')
	def test_verify_payment_rejects_uncaptured_status_despite_valid_signature(self, mock_fetch):
		"""B9: valid HMAC + non-captured Razorpay status must not mark Paid."""
		self.owner_order.razorpay_order_id = 'order_auth_1'
		self.owner_order.total_amount = Decimal('500.00')
		self.owner_order.currency = 'INR'
		self.owner_order.save(update_fields=['razorpay_order_id', 'total_amount', 'currency'])

		payment_id = 'pay_auth_1'
		signature = self._payment_signature(self.owner_order.razorpay_order_id, payment_id)
		mock_fetch.return_value = {
			'id': payment_id,
			'status': 'authorized',
			'amount': 50000,
			'currency': 'INR',
			'order_id': 'order_auth_1',
		}

		response = self.client.post(
			f'/api/v1/orders/{self.owner_order.id}/verify-payment/',
			{
				'razorpay_payment_id': payment_id,
				'razorpay_signature': signature,
			},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.owner_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('captured', response.data['error'].lower())
		self.owner_order.refresh_from_db()
		self.assertNotEqual(self.owner_order.payment_status, Order.PaymentStatus.PAID)

	def test_verify_payment_with_invalid_signature_does_not_mark_paid(self):
		self.owner_order.razorpay_order_id = 'order_invalid_1'
		self.owner_order.save(update_fields=['razorpay_order_id'])

		response = self.client.post(
			f'/api/v1/orders/{self.owner_order.id}/verify-payment/',
			{
				'razorpay_payment_id': 'pay_invalid_1',
				'razorpay_signature': 'tampered-signature',
			},
			format='json',
			HTTP_AUTHORIZATION=f'Bearer {self.owner_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.owner_order.refresh_from_db()
		self.assertNotEqual(self.owner_order.payment_status, Order.PaymentStatus.PAID)

	def test_webhook_valid_signature_updates_payment_status(self):
		self.owner_order.razorpay_order_id = 'order_webhook_1'
		self.owner_order.save(update_fields=['razorpay_order_id'])

		payload = {
			'event': 'payment.captured',
			'payload': {
				'payment': {
					'entity': {
						'id': 'pay_webhook_1',
						'order_id': 'order_webhook_1',
					}
				}
			},
		}
		payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
		signature = self._webhook_signature(payload_bytes)

		response = self.client.post(
			'/api/v1/webhooks/razorpay/',
			payload_bytes,
			content_type='application/json',
			HTTP_X_RAZORPAY_SIGNATURE=signature,
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.owner_order.refresh_from_db()
		self.assertEqual(self.owner_order.payment_status, Order.PaymentStatus.PAID)
		self.assertEqual(self.owner_order.razorpay_payment_id, 'pay_webhook_1')

	def test_webhook_invalid_signature_is_rejected(self):
		payload = {
			'event': 'payment.failed',
			'payload': {'payment': {'entity': {'order_id': 'missing'}}},
		}
		payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')

		response = self.client.post(
			'/api/v1/webhooks/razorpay/',
			payload_bytes,
			content_type='application/json',
			HTTP_X_RAZORPAY_SIGNATURE='invalid-signature',
		)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_webhook_is_idempotent_on_duplicate_events(self):
		self.owner_order.razorpay_order_id = 'order_dupe_1'
		self.owner_order.save(update_fields=['razorpay_order_id'])

		payload = {
			'event': 'payment.captured',
			'payload': {
				'payment': {
					'entity': {
						'id': 'pay_dupe_1',
						'order_id': 'order_dupe_1',
					}
				}
			},
		}
		payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
		signature = self._webhook_signature(payload_bytes)

		first = self.client.post(
			'/api/v1/webhooks/razorpay/',
			payload_bytes,
			content_type='application/json',
			HTTP_X_RAZORPAY_SIGNATURE=signature,
		)
		second = self.client.post(
			'/api/v1/webhooks/razorpay/',
			payload_bytes,
			content_type='application/json',
			HTTP_X_RAZORPAY_SIGNATURE=signature,
		)

		self.assertEqual(first.status_code, status.HTTP_200_OK)
		self.assertEqual(second.status_code, status.HTTP_200_OK)
		self.owner_order.refresh_from_db()
		self.assertEqual(self.owner_order.payment_status, Order.PaymentStatus.PAID)
		self.assertEqual(self.owner_order.razorpay_payment_id, 'pay_dupe_1')


class MyOrderApiTests(APITestCase):
	def setUp(self):
		self.owner = User.objects.create_user(
			email='history-owner@example.com',
			password='OwnerPass123!',
			full_name='History Owner',
			role=User.Role.CUSTOMER,
		)
		self.other = User.objects.create_user(
			email='history-other@example.com',
			password='OtherPass123!',
			full_name='History Other',
			role=User.Role.CUSTOMER,
		)
		self.owner_customer = Customer.objects.create(
			user=self.owner,
			full_name='History Owner',
			company_name='Owner Co',
			email=self.owner.email,
			phone='',
			country='India',
		)
		self.other_customer = Customer.objects.create(
			user=self.other,
			full_name='History Other',
			company_name='Other Co',
			email=self.other.email,
			phone='',
			country='India',
		)
		self.owner_order = Order.objects.create(
			customer=self.owner_customer,
			items_summary='Owner Product x 2',
			total_amount=Decimal('200.00'),
			currency='INR',
		)
		self.other_order = Order.objects.create(
			customer=self.other_customer,
			items_summary='Other Product x 1',
			total_amount=Decimal('100.00'),
			currency='INR',
		)

		self.owner_refresh = RefreshToken.for_user(self.owner)

	def test_authenticated_customer_sees_only_own_orders(self):
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_refresh.access_token}')

		response = self.client.get('/api/v1/orders/mine/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 1)
		self.assertEqual(response.data['results'][0]['id'], str(self.owner_order.id))

	def test_authenticated_customer_with_zero_orders_gets_empty_list(self):
		self.owner_order.delete()
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_refresh.access_token}')

		response = self.client.get('/api/v1/orders/mine/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 0)
		self.assertEqual(response.data['results'], [])

	def test_unauthenticated_customer_order_list_is_rejected(self):
		response = self.client.get('/api/v1/orders/mine/')

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_other_customer_order_detail_returns_404(self):
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_refresh.access_token}')

		response = self.client.get(f'/api/v1/orders/mine/{self.other_order.id}/')

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_order_detail_includes_nested_line_items(self):
		item = OrderItem.objects.create(
			order=self.owner_order,
			product_name_snapshot='Owner Product',
			unit_price_snapshot=Decimal('100.00'),
			quantity=2,
		)
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.owner_refresh.access_token}')

		response = self.client.get(f'/api/v1/orders/mine/{self.owner_order.id}/')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['id'], str(self.owner_order.id))
		self.assertEqual(len(response.data['items']), 1)
		self.assertEqual(response.data['items'][0]['id'], item.id)
		self.assertEqual(response.data['items'][0]['product_name_snapshot'], 'Owner Product')

	def test_unauthenticated_customer_order_detail_is_rejected(self):
		response = self.client.get(f'/api/v1/orders/mine/{self.owner_order.id}/')

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AdminOrderDetailApiTests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_user(
			email='orders-admin@example.com',
			password='AdminPass123!',
			full_name='Orders Admin',
			role=User.Role.SUPER_ADMIN,
			is_staff=True,
			is_superuser=True,
		)
		self.customer = Customer.objects.create(
			full_name='Order Buyer',
			company_name='Buyer Co',
			email='order-buyer@example.com',
			phone='+91 9999999999',
			country='India',
		)
		self.order = Order.objects.create(
			customer=self.customer,
			items_summary='Invoice Product x 2',
			total_amount=Decimal('200.00'),
			currency='INR',
			payment_status=Order.PaymentStatus.PENDING,
			payment_rail=Order.PaymentRail.RAZORPAY,
		)
		self.item = OrderItem.objects.create(
			order=self.order,
			product_name_snapshot='Invoice Product',
			unit_price_snapshot=Decimal('100.00'),
			quantity=2,
		)
		admin_refresh = RefreshToken.for_user(self.admin)
		self.admin_token = str(admin_refresh.access_token)
		self.customer_user = User.objects.create_user(
			email='not-admin@example.com',
			password='CustomerPass123!',
			full_name='Not Admin',
			role=User.Role.CUSTOMER,
		)
		customer_refresh = RefreshToken.for_user(self.customer_user)
		self.customer_token = str(customer_refresh.access_token)

	def test_admin_can_view_order_detail_with_nested_items_and_customer_info(self):
		response = self.client.get(
			f'/api/v1/orders/{self.order.id}/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['customer_name'], 'Order Buyer')
		self.assertEqual(response.data['customer_email'], 'order-buyer@example.com')
		self.assertEqual(response.data['customer_phone'], '+91 9999999999')
		self.assertEqual(response.data['customer_country'], 'India')
		self.assertEqual(len(response.data['items']), 1)
		self.assertEqual(response.data['items'][0]['product_name_snapshot'], 'Invoice Product')
		self.assertEqual(response.data['payment_rail'], Order.PaymentRail.RAZORPAY)

	def test_non_admin_cannot_view_admin_order_detail(self):
		response = self.client.get(
			f'/api/v1/orders/{self.order.id}/',
			HTTP_AUTHORIZATION=f'Bearer {self.customer_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_admin_invoice_returns_pdf_for_existing_order(self):
		response = self.client.get(
			f'/api/v1/orders/{self.order.id}/invoice/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response['Content-Type'], 'application/pdf')
		self.assertTrue(response.content.startswith(b'%PDF'))
		self.assertIn(f'invoice-{self.order.order_code}.pdf', response['Content-Disposition'])

	def test_admin_invoice_returns_404_for_nonexistent_order(self):
		response = self.client.get(
			'/api/v1/orders/00000000-0000-0000-0000-000000000000/invoice/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_admin_can_view_guest_order_contact_from_persisted_fields(self):
		"""B8: admin order detail exposes guest contact when customer is null."""
		guest_order = Order.objects.create(
			customer=None,
			guest_company_name='Guest Export Co',
			guest_contact_name='Alex Guest',
			guest_email='alex.guest@example.com',
			guest_phone='+44 7700 900123',
			guest_country='United Kingdom',
			items_summary='Guest Product x 1',
			total_amount=Decimal('150.00'),
			currency='INR',
			payment_status=Order.PaymentStatus.PENDING,
		)

		response = self.client.get(
			f'/api/v1/orders/{guest_order.id}/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIsNone(response.data['customer'])
		self.assertEqual(response.data['customer_name'], 'Alex Guest')
		self.assertEqual(response.data['customer_company'], 'Guest Export Co')
		self.assertEqual(response.data['customer_email'], 'alex.guest@example.com')
		self.assertEqual(response.data['customer_phone'], '+44 7700 900123')
		self.assertEqual(response.data['customer_country'], 'United Kingdom')
		self.assertEqual(response.data['guest_email'], 'alex.guest@example.com')


class AdminCustomerAggregateApiTests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_user(
			email='customer-admin@example.com',
			password='AdminPass123!',
			full_name='Customer Admin',
			role=User.Role.SUPER_ADMIN,
			is_staff=True,
			is_superuser=True,
		)
		admin_refresh = RefreshToken.for_user(self.admin)
		self.admin_token = str(admin_refresh.access_token)
		self.customer = Customer.objects.create(
			full_name='Aggregate Buyer',
			company_name='Aggregate Co',
			email='aggregate@example.com',
			phone='+91 9000000000',
			country='India',
		)
		self.orders = [
			Order.objects.create(customer=self.customer, items_summary='Paid one', total_amount=Decimal('100.00'), currency='INR', payment_status=Order.PaymentStatus.PAID),
			Order.objects.create(customer=self.customer, items_summary='Paid two', total_amount=Decimal('250.00'), currency='INR', payment_status=Order.PaymentStatus.PAID),
			Order.objects.create(customer=self.customer, items_summary='Pending', total_amount=Decimal('900.00'), currency='INR', payment_status=Order.PaymentStatus.PENDING),
		]

	def test_customer_aggregates_count_all_orders_and_sum_paid_orders_only(self):
		response = self.client.get(
			'/api/v1/customers/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		customer_data = response.data['results'][0]
		self.assertEqual(customer_data['total_orders'], 3)
		self.assertEqual(customer_data['lifetime_value'], '350.00')

	def test_zero_order_customer_has_zero_aggregates(self):
		zero_customer = Customer.objects.create(
			full_name='Empty Buyer',
			company_name='Empty Co',
			email='empty@example.com',
			phone='',
			country='India',
		)

		response = self.client.get(
			f'/api/v1/customers/{zero_customer.id}/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['total_orders'], 0)
		self.assertEqual(response.data['lifetime_value'], '0.00')

	def test_deleting_order_recalculates_aggregates(self):
		self.orders[0].delete()

		response = self.client.get(
			f'/api/v1/customers/{self.customer.id}/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['total_orders'], 2)
		self.assertEqual(response.data['lifetime_value'], '250.00')

	def test_admin_can_view_customer_order_history(self):
		response = self.client.get(
			f'/api/v1/customers/{self.customer.id}/orders/',
			HTTP_AUTHORIZATION=f'Bearer {self.admin_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['count'], 3)
		self.assertEqual(len(response.data['results'][0]['items']), 0)

	def test_non_admin_cannot_view_customer_order_history(self):
		user = User.objects.create_user(
			email='regular-customer@example.com',
			password='CustomerPass123!',
			full_name='Regular Customer',
			role=User.Role.CUSTOMER,
		)
		refresh = RefreshToken.for_user(user)

		response = self.client.get(
			f'/api/v1/customers/{self.customer.id}/orders/',
			HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}',
		)

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CrmEmailConflictIdorTests(APITestCase):
	"""B1: email-conflict must never hand user B another user's Customer (order IDOR)."""

	def setUp(self):
		self.category = Category.objects.create(name='Spices', slug='spices-idor')
		self.product = Product.objects.create(
			sku='BFF-IDOR-001',
			name='IDOR Test Spice',
			slug='idor-test-spice',
			category=self.category,
			pack_image='https://example.com/idor-pack.jpg',
			ingredient_image='https://example.com/idor.jpg',
			price_inr=Decimal('100.00'),
			blurb='IDOR regression product',
			stock_quantity=20,
			status=Product.Status.PUBLISHED,
		)

		self.user_a = User.objects.create_user(
			email='owner-a@example.com',
			password='OwnerPass123!',
			full_name='Owner A',
			role=User.Role.CUSTOMER,
		)
		self.customer_a = Customer.objects.create(
			user=self.user_a,
			full_name='Owner A',
			company_name='A Co',
			email='shared-idor@example.com',
			phone='',
			country='India',
		)
		self.order_a = Order.objects.create(
			customer=self.customer_a,
			items_summary='Secret order for A',
			total_amount=Decimal('500.00'),
			currency='INR',
		)

	def _register_user_b(self):
		from apps.users.otp import hash_otp_code
		from apps.users.models import EmailOTP
		from django.utils import timezone
		from datetime import timedelta

		EmailOTP.objects.create(
			email='shared-idor@example.com',
			code_hash=hash_otp_code('654321'),
			is_verified=True,
			verified_at=timezone.now(),
			expires_at=timezone.now() + timedelta(minutes=10),
		)
		response = self.client.post('/api/v1/auth/register/', {
			'email': 'shared-idor@example.com',
			'password': 'BuyerBPass123!',
			'confirm_password': 'BuyerBPass123!',
			'full_name': 'Buyer B',
		})
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		return User.objects.get(email='shared-idor@example.com'), response

	def test_email_conflict_user_b_cannot_see_or_attach_to_user_a_customer(self):
		user_b, register_response = self._register_user_b()
		access = register_response.data['access']

		self.customer_a.refresh_from_db()
		self.assertEqual(self.customer_a.user_id, self.user_a.id)

		customer_b = Customer.objects.get(user=user_b)
		self.assertNotEqual(customer_b.pk, self.customer_a.pk)
		self.assertEqual(Customer.objects.filter(email__iexact='shared-idor@example.com').count(), 2)

		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
		mine = self.client.get('/api/v1/orders/mine/')
		self.assertEqual(mine.status_code, status.HTTP_200_OK)
		order_ids = {row['id'] for row in mine.data.get('results', mine.data if isinstance(mine.data, list) else [])}
		self.assertNotIn(str(self.order_a.id), order_ids)
		self.assertEqual(mine.data.get('count', len(order_ids)), 0)

		checkout = self.client.post(
			'/api/v1/orders/checkout/',
			{
				'company_name': 'B Co',
				'contact_person': 'Buyer B',
				'email': user_b.email,
				'phone': '+91 9000000000',
				'country': 'India',
				'shipping_method': 'sea_fcl',
				'incoterm': 'FOB',
				'payment_terms': 'advance_tt',
				'message': 'IDOR regression checkout',
				'cart': [
					{
						'product_id': str(self.product.id),
						'quantity': 1,
						'price': '1.00',
					},
				],
			},
			format='json',
		)
		self.assertEqual(checkout.status_code, status.HTTP_201_CREATED)
		order_b = Order.objects.get(id=checkout.data['id'])
		self.assertEqual(order_b.customer_id, customer_b.pk)
		self.assertNotEqual(order_b.customer_id, self.customer_a.pk)
		self.assertEqual(Order.objects.filter(customer=self.customer_a).count(), 1)


class AbandonedOrderStockReleaseTests(TestCase):
	"""B3: unpaid abandoned checkouts must restore reserved stock safely."""

	def setUp(self):
		self.category = Category.objects.create(name='Abandoned Stock', slug='abandoned-stock')
		self.product = Product.objects.create(
			sku='BFF-ABANDON-001',
			name='Abandoned Stock Probe',
			slug='abandoned-stock-probe',
			category=self.category,
			pack_image='https://example.com/abandon-pack.jpg',
			ingredient_image='https://example.com/abandon.jpg',
			price_inr=Decimal('150.00'),
			blurb='Stock release probe',
			stock_quantity=10,
			status=Product.Status.PUBLISHED,
		)

	def _create_reserved_order(self, *, quantity=2, payment_status=Order.PaymentStatus.AWAITING_QUOTE):
		# Simulate checkout having already decremented stock.
		self.product.stock_quantity -= quantity
		self.product.save(update_fields=['stock_quantity', 'updated_at'])
		order = Order.objects.create(
			items_summary=f'{self.product.name} x {quantity}',
			total_amount=self.product.price_inr * quantity,
			currency='INR',
			payment_status=payment_status,
			fulfillment_status=Order.FulfillmentStatus.PENDING,
		)
		OrderItem.objects.create(
			order=order,
			product=self.product,
			product_name_snapshot=self.product.name,
			unit_price_snapshot=self.product.price_inr,
			quantity=quantity,
			total_price=self.product.price_inr * quantity,
		)
		return order

	def test_old_unpaid_order_restores_stock_and_is_cancelled(self):
		from datetime import timedelta

		from django.utils import timezone

		from apps.crm.abandoned_orders import release_abandoned_orders

		order = self._create_reserved_order(quantity=3)
		Order.objects.filter(pk=order.pk).update(created_at=timezone.now() - timedelta(hours=2))
		self.product.refresh_from_db()
		self.assertEqual(self.product.stock_quantity, 7)

		result = release_abandoned_orders(older_than_minutes=45)

		order.refresh_from_db()
		self.product.refresh_from_db()
		self.assertEqual(result['released'], 1)
		self.assertEqual(order.payment_status, Order.PaymentStatus.CANCELLED)
		self.assertEqual(self.product.stock_quantity, 10)

	def test_old_paid_order_is_left_untouched(self):
		from datetime import timedelta

		from django.utils import timezone

		from apps.crm.abandoned_orders import release_abandoned_orders

		order = self._create_reserved_order(
			quantity=2,
			payment_status=Order.PaymentStatus.PAID,
		)
		Order.objects.filter(pk=order.pk).update(created_at=timezone.now() - timedelta(hours=2))
		self.product.refresh_from_db()
		stock_before = self.product.stock_quantity

		result = release_abandoned_orders(older_than_minutes=45)

		order.refresh_from_db()
		self.product.refresh_from_db()
		self.assertEqual(result['released'], 0)
		self.assertEqual(result['candidates'], 0)
		self.assertEqual(order.payment_status, Order.PaymentStatus.PAID)
		self.assertEqual(self.product.stock_quantity, stock_before)

	def test_young_unpaid_order_is_left_untouched(self):
		from apps.crm.abandoned_orders import release_abandoned_orders

		order = self._create_reserved_order(quantity=2)
		self.product.refresh_from_db()
		stock_before = self.product.stock_quantity

		result = release_abandoned_orders(older_than_minutes=45)

		order.refresh_from_db()
		self.product.refresh_from_db()
		self.assertEqual(result['released'], 0)
		self.assertEqual(result['candidates'], 0)
		self.assertEqual(order.payment_status, Order.PaymentStatus.AWAITING_QUOTE)
		self.assertEqual(self.product.stock_quantity, stock_before)

	def test_management_command_releases_old_unpaid_order(self):
		from datetime import timedelta

		from django.core.management import call_command
		from django.utils import timezone

		order = self._create_reserved_order(quantity=1)
		Order.objects.filter(pk=order.pk).update(created_at=timezone.now() - timedelta(hours=3))

		call_command('release_abandoned_orders', minutes=30)

		order.refresh_from_db()
		self.product.refresh_from_db()
		self.assertEqual(order.payment_status, Order.PaymentStatus.CANCELLED)
		self.assertEqual(self.product.stock_quantity, 10)


class AbandonedOrderCleanupRaceTests(TransactionTestCase):
	"""B3: cleanup must not restore stock if payment completes under the same lock race."""

	reset_sequences = True

	def setUp(self):
		self.category = Category.objects.create(name='Abandon Race', slug='abandon-race')
		self.product = Product.objects.create(
			sku='BFF-ABANDON-RACE-001',
			name='Abandon Race Product',
			slug='abandon-race-product',
			category=self.category,
			pack_image='https://example.com/race-pack.jpg',
			ingredient_image='https://example.com/race.jpg',
			price_inr=Decimal('100.00'),
			blurb='Race probe',
			stock_quantity=5,
			status=Product.Status.PUBLISHED,
		)

	def test_cleanup_skips_order_when_payment_wins_lock_race(self):
		from datetime import timedelta

		from django.db import close_old_connections, OperationalError, transaction
		from django.utils import timezone

		from apps.crm.abandoned_orders import release_single_abandoned_order

		self.product.stock_quantity = 3
		self.product.save(update_fields=['stock_quantity', 'updated_at'])
		order = Order.objects.create(
			items_summary='Abandon Race Product x 2',
			total_amount=Decimal('200.00'),
			currency='INR',
			payment_status=Order.PaymentStatus.AWAITING_QUOTE,
			fulfillment_status=Order.FulfillmentStatus.PENDING,
		)
		OrderItem.objects.create(
			order=order,
			product=self.product,
			product_name_snapshot=self.product.name,
			unit_price_snapshot=Decimal('100.00'),
			quantity=2,
			total_price=Decimal('200.00'),
		)
		Order.objects.filter(pk=order.pk).update(created_at=timezone.now() - timedelta(hours=2))

		barrier = threading.Barrier(2)
		outcomes = {'released': None, 'paid': False, 'error': None}

		def mark_paid_and_hold_lock():
			close_old_connections()
			try:
				barrier.wait(timeout=10)
				with transaction.atomic():
					locked = Order.objects.select_for_update().get(pk=order.pk)
					locked.payment_status = Order.PaymentStatus.PAID
					locked.save(update_fields=['payment_status'])
					outcomes['paid'] = True
					# Hold the row lock so cleanup waits, then observes PAID on recheck.
					time.sleep(0.35)
			finally:
				connections.close_all()

		def run_cleanup_after_pay_starts():
			close_old_connections()
			try:
				barrier.wait(timeout=10)
				time.sleep(0.05)
				# SQLite may raise "database table is locked" until the payer commits;
				# retry until the lock is free, then assert the PAID recheck wins.
				for _ in range(40):
					try:
						outcomes['released'] = release_single_abandoned_order(order.pk)
						break
					except OperationalError:
						time.sleep(0.05)
				else:
					outcomes['error'] = 'cleanup never acquired lock'
			finally:
				connections.close_all()

		pay_thread = threading.Thread(target=mark_paid_and_hold_lock)
		cleanup_thread = threading.Thread(target=run_cleanup_after_pay_starts)
		pay_thread.start()
		cleanup_thread.start()
		pay_thread.join(timeout=20)
		cleanup_thread.join(timeout=20)

		order.refresh_from_db()
		self.product.refresh_from_db()
		self.assertIsNone(outcomes['error'])
		self.assertTrue(outcomes['paid'])
		self.assertIs(outcomes['released'], False)
		self.assertEqual(order.payment_status, Order.PaymentStatus.PAID)
		# Stock must remain at the post-checkout reserved level (not restored).
		self.assertEqual(self.product.stock_quantity, 3)

	def test_status_recheck_under_lock_refuses_already_paid_order(self):
		"""Direct simulation of the critical recheck after a concurrent payment."""
		from apps.crm.abandoned_orders import release_single_abandoned_order

		self.product.stock_quantity = 3
		self.product.save(update_fields=['stock_quantity', 'updated_at'])
		order = Order.objects.create(
			items_summary='Abandon Race Product x 2',
			total_amount=Decimal('200.00'),
			currency='INR',
			payment_status=Order.PaymentStatus.AWAITING_QUOTE,
			fulfillment_status=Order.FulfillmentStatus.PENDING,
		)
		OrderItem.objects.create(
			order=order,
			product=self.product,
			product_name_snapshot=self.product.name,
			unit_price_snapshot=Decimal('100.00'),
			quantity=2,
			total_price=Decimal('200.00'),
		)

		# Payment completed in the window between candidate scan and lock recheck.
		Order.objects.filter(pk=order.pk).update(payment_status=Order.PaymentStatus.PAID)

		released = release_single_abandoned_order(order.pk)

		order.refresh_from_db()
		self.product.refresh_from_db()
		self.assertFalse(released)
		self.assertEqual(order.payment_status, Order.PaymentStatus.PAID)
		self.assertEqual(self.product.stock_quantity, 3)
