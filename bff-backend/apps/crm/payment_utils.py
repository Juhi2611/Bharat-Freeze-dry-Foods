import hashlib
import hmac
import json
from decimal import Decimal

from django.conf import settings
from django.core import signing

try:
	import razorpay
except ImportError:  # pragma: no cover
	razorpay = None


def generate_guest_order_access_token(order_id: str) -> str:
	return signing.dumps({'order_id': str(order_id)}, salt='crm.guest.order.access')


def verify_guest_order_access_token(
	order_id: str,
	token: str,
	max_age_seconds: int = 60 * 60 * 24 * 7,
) -> bool:
	if not token:
		return False
	try:
		data = signing.loads(token, salt='crm.guest.order.access', max_age=max_age_seconds)
	except signing.BadSignature:
		return False
	except signing.SignatureExpired:
		return False
	return str(data.get('order_id')) == str(order_id)


def calculate_order_total_from_items(order) -> Decimal:
	total = Decimal('0.00')
	for item in order.items.all():
		total += item.unit_price_snapshot * item.quantity
	return total


def verify_razorpay_payment_signature(order_id: str, payment_id: str, signature: str, secret: str) -> bool:
	payload = f'{order_id}|{payment_id}'.encode('utf-8')
	digest = hmac.new(secret.encode('utf-8'), payload, hashlib.sha256).hexdigest()
	return hmac.compare_digest(digest, signature)


def verify_razorpay_webhook_signature(raw_body: bytes, signature: str, webhook_secret: str) -> bool:
	digest = hmac.new(webhook_secret.encode('utf-8'), raw_body, hashlib.sha256).hexdigest()
	return hmac.compare_digest(digest, signature)


def load_webhook_payload(raw_body: bytes) -> dict:
	return json.loads(raw_body.decode('utf-8'))


def fetch_razorpay_payment(payment_id: str) -> dict:
	"""Server-side Razorpay Payments API fetch used as a B9 cross-check."""
	if razorpay is None:
		raise RuntimeError('Razorpay SDK is not installed.')
	if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
		raise RuntimeError('Razorpay is not configured.')

	client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
	return client.payment.fetch(payment_id)


def assert_razorpay_payment_matches_order(payment: dict, order) -> None:
	"""
	Confirm payment is captured and matches this order's amount/currency/order id.

	Raises ValueError with a safe client-facing message on mismatch.
	"""
	status = str(payment.get('status') or '').lower()
	if status != 'captured':
		raise ValueError(f'Payment is not captured (status={status or "unknown"}).')

	razorpay_order_id = payment.get('order_id') or ''
	if order.razorpay_order_id and razorpay_order_id and razorpay_order_id != order.razorpay_order_id:
		raise ValueError('Payment does not belong to this order.')

	expected_paise = int((Decimal(order.total_amount) * Decimal('100')).quantize(Decimal('1')))
	paid_paise = int(payment.get('amount') or 0)
	if paid_paise != expected_paise:
		raise ValueError(
			f'Payment amount mismatch (expected {expected_paise} paise, got {paid_paise}).'
		)

	paid_currency = str(payment.get('currency') or '').upper()
	order_currency = str(order.currency or '').upper()
	if paid_currency and order_currency and paid_currency != order_currency:
		raise ValueError('Payment currency mismatch.')
