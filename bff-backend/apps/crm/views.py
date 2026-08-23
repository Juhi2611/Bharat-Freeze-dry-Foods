from decimal import Decimal
import logging

from django.db import transaction
from django.db.models import Count, DecimalField, Q, Sum, Value
from django.db.models.functions import Coalesce
from django.conf import settings
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from apps.catalog.models import Product
from apps.users.permissions import IsCrmStaff

try:
    import razorpay
except ImportError:  # pragma: no cover
    razorpay = None

from .models import Customer, Order, OrderItem
from .payment_utils import (
    assert_razorpay_payment_matches_order,
    calculate_order_total_from_items,
    fetch_razorpay_payment,
    generate_guest_order_access_token,
    load_webhook_payload,
    verify_guest_order_access_token,
    verify_razorpay_payment_signature,
    verify_razorpay_webhook_signature,
)
from .serializers import (
    CheckoutOrderRequestSerializer,
    CreatePaymentRequestSerializer,
    CustomerSerializer,
    CustomerOrderSerializer,
    OrderSerializer,
    VerifyPaymentRequestSerializer,
)
from .services import ensure_customer_for_user

logger = logging.getLogger(__name__)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.annotate(
        total_orders=Count('orders', distinct=True),
        lifetime_value=Coalesce(
            Sum(
                'orders__total_amount',
                filter=Q(orders__payment_status=Order.PaymentStatus.PAID),
            ),
            Value(Decimal('0.00')),
            output_field=DecimalField(max_digits=12, decimal_places=2),
        ),
    ).order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [IsCrmStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tier', 'is_active', 'country']
    search_fields = ['full_name', 'company_name', 'email', 'customer_code', 'phone']
    ordering_fields = ['created_at', 'company_name']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('customer', 'source_enquiry', 'source_private_label_enquiry').all()
    serializer_class = OrderSerializer
    permission_classes = [IsCrmStaff]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['payment_status', 'fulfillment_status', 'is_domestic', 'payment_rail']
    search_fields = ['order_code', 'customer__company_name', 'customer__full_name', 'razorpay_order_id']
    ordering_fields = ['order_date', 'total_amount', 'created_at']

    @action(detail=True, methods=['get'], url_path='invoice')
    def invoice(self, request, pk=None):
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        from io import BytesIO

        order = self.get_object()
        buffer = BytesIO()
        document = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        y = height - 48

        document.setTitle(f'Invoice {order.order_code}')
        document.setFont('Helvetica-Bold', 16)
        document.drawString(48, y, 'BFF Foods - Order Invoice')
        y -= 28
        document.setFont('Helvetica', 10)
        document.drawString(48, y, f'Order: {order.order_code}')
        document.drawString(330, y, f'Date: {order.order_date}')
        y -= 18
        document.drawString(48, y, f'Payment: {order.payment_status} ({order.payment_rail or "Not set"})')
        document.drawString(330, y, f'Fulfillment: {order.fulfillment_status}')
        y -= 30

        customer = order.customer
        document.setFont('Helvetica-Bold', 11)
        document.drawString(48, y, 'Customer')
        y -= 16
        document.setFont('Helvetica', 10)
        customer_lines = [
            (customer.full_name if customer else order.guest_contact_name) or 'Guest customer',
            customer.company_name if customer else order.guest_company_name,
            customer.email if customer else order.guest_email,
            customer.phone if customer else order.guest_phone,
            customer.country if customer else order.guest_country,
        ]
        for line in customer_lines:
            if line:
                document.drawString(48, y, line)
                y -= 14

        y -= 12
        document.setFont('Helvetica-Bold', 10)
        document.drawString(48, y, 'Item')
        document.drawString(300, y, 'Qty')
        document.drawString(350, y, 'Unit price')
        document.drawString(450, y, 'Line total')
        y -= 16
        document.setFont('Helvetica', 10)
        for item in order.items.all():
            document.drawString(48, y, item.product_name_snapshot[:38])
            document.drawRightString(325, y, str(item.quantity))
            document.drawRightString(425, y, f'{item.unit_price_snapshot:.2f}')
            document.drawRightString(540, y, f'{item.total_price:.2f}')
            y -= 16
            if y < 72:
                document.showPage()
                y = height - 48
                document.setFont('Helvetica', 10)

        y -= 12
        document.setFont('Helvetica-Bold', 12)
        document.drawRightString(540, y, f'Total: {order.currency} {order.total_amount:.2f}')
        document.save()

        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice-{order.order_code}.pdf"'
        return response


class MyOrderPagination(PageNumberPagination):
    page_size = 20


class MyOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomerOrderSerializer
    pagination_class = MyOrderPagination

    def get_queryset(self):
        customer = ensure_customer_for_user(self.request.user)
        return Order.objects.filter(customer=customer).prefetch_related('items').order_by('-created_at')


class MyOrderDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CustomerOrderSerializer
    lookup_url_kwarg = 'order_id'

    def get_queryset(self):
        customer = ensure_customer_for_user(self.request.user)
        return Order.objects.filter(customer=customer).prefetch_related('items')


class CustomerOrderHistoryView(generics.ListAPIView):
    permission_classes = [IsCrmStaff]
    serializer_class = OrderSerializer
    pagination_class = MyOrderPagination

    def get_queryset(self):
        return Order.objects.filter(customer_id=self.kwargs['customer_id']).prefetch_related('items').order_by('-created_at')


class OrderCheckoutView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutOrderRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        requested_lines = payload['cart']
        product_ids = [line['product_id'] for line in requested_lines]
        products_by_id = (
            Product.objects
            .select_for_update()
            .filter(id__in=product_ids)
            .in_bulk()
        )
        requested_quantities = {}
        for line in requested_lines:
            requested_quantities[line['product_id']] = (
                requested_quantities.get(line['product_id'], 0) + line['quantity']
            )

        order_items_payload = []
        total_amount = Decimal('0.00')

        for product_id, requested_quantity in requested_quantities.items():
            product = products_by_id.get(product_id)
            if not product:
                return Response(
                    {'error': f"Product {product_id} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if product.status != Product.Status.PUBLISHED:
                return Response(
                    {'error': f"Product '{product.name}' is inactive and cannot be ordered."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if product.stock_quantity < requested_quantity:
                return Response(
                    {
                        'error': (
                            f"Product '{product.name}' has insufficient stock "
                            f"({product.stock_quantity} available, {requested_quantity} requested)."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        for line in requested_lines:
            product = products_by_id[line['product_id']]
            quantity = line['quantity']
            unit_price = product.price_inr
            line_total = unit_price * quantity
            total_amount += line_total

            order_items_payload.append(
                {
                    'product': product,
                    'product_name_snapshot': product.name,
                    'unit_price_snapshot': unit_price,
                    'quantity': quantity,
                }
            )

        for product_id, requested_quantity in requested_quantities.items():
            product = products_by_id[product_id]
            product.stock_quantity -= requested_quantity
            product.save(update_fields=['stock_quantity', 'updated_at'])

        customer = None
        if request.user.is_authenticated:
            customer = ensure_customer_for_user(request.user)

        items_summary = ', '.join(
            f"{line['product_name_snapshot']} x {line['quantity']}"
            for line in order_items_payload
        )

        order = Order.objects.create(
            customer=customer,
            guest_company_name='' if customer else payload.get('company_name', ''),
            guest_contact_name='' if customer else payload.get('contact_person', ''),
            guest_email='' if customer else payload.get('email', ''),
            guest_phone='' if customer else payload.get('phone', '') or '',
            guest_country='' if customer else payload.get('country', ''),
            guest_shipping_method='' if customer else payload.get('shipping_method', '') or '',
            guest_incoterm='' if customer else payload.get('incoterm', '') or '',
            guest_payment_terms='' if customer else payload.get('payment_terms', '') or '',
            guest_message='' if customer else payload.get('message', '') or '',
            items_summary=items_summary,
            total_amount=total_amount,
            currency='INR',
            payment_status=Order.PaymentStatus.AWAITING_QUOTE,
            fulfillment_status=Order.FulfillmentStatus.PENDING,
        )

        OrderItem.objects.bulk_create(
            [
                OrderItem(
                    order=order,
                    product=line['product'],
                    product_name_snapshot=line['product_name_snapshot'],
                    unit_price_snapshot=line['unit_price_snapshot'],
                    quantity=line['quantity'],
                    total_price=line['unit_price_snapshot'] * line['quantity'],
                )
                for line in order_items_payload
            ]
        )

        order.refresh_from_db()
        response_data = OrderSerializer(order).data
        if not request.user.is_authenticated:
            response_data['order_access_token'] = generate_guest_order_access_token(order.id)

        return Response(response_data, status=status.HTTP_201_CREATED)


def _get_order_or_404(order_id):
    try:
        return Order.objects.select_related('customer').prefetch_related('items').get(id=order_id)
    except Order.DoesNotExist as exc:
        raise NotFound('Order not found.') from exc


def _can_access_order(request, order, order_access_token):
    if order.customer_id:
        if not request.user.is_authenticated:
            return False
        requester_customer = ensure_customer_for_user(request.user)
        return requester_customer.id == order.customer_id

    return verify_guest_order_access_token(order.id, order_access_token)


class OrderCreatePaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request, order_id):
        serializer = CreatePaymentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_access_token = serializer.validated_data.get('order_access_token', '')

        order = _get_order_or_404(order_id)
        if not _can_access_order(request, order, order_access_token):
            return Response({'error': 'You do not have access to this order.'}, status=status.HTTP_403_FORBIDDEN)

        if order.payment_status == Order.PaymentStatus.PAID:
            return Response({'error': 'Order is already paid.'}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response({'error': 'Razorpay is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if razorpay is None:
            return Response({'error': 'Razorpay SDK is not installed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        recalculated_total = calculate_order_total_from_items(order)
        order.total_amount = recalculated_total
        order.currency = 'INR'
        order.payment_rail = Order.PaymentRail.RAZORPAY
        order.save(update_fields=['total_amount', 'currency', 'payment_rail'])

        amount_paise = int((recalculated_total * Decimal('100')).quantize(Decimal('1')))
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        razorpay_order = client.order.create(
            {
                'amount': amount_paise,
                'currency': order.currency,
                'receipt': order.order_code,
                'notes': {'order_id': str(order.id), 'order_code': order.order_code},
            }
        )

        order.razorpay_order_id = razorpay_order['id']
        order.save(update_fields=['razorpay_order_id'])

        return Response(
            {
                'order_id': str(order.id),
                'amount': amount_paise,
                'currency': order.currency,
                'razorpay_order_id': order.razorpay_order_id,
                'key_id': settings.RAZORPAY_KEY_ID,
            },
            status=status.HTTP_200_OK,
        )


class OrderVerifyPaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request, order_id):
        serializer = VerifyPaymentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        order = _get_order_or_404(order_id)
        if not _can_access_order(request, order, payload.get('order_access_token', '')):
            return Response({'error': 'You do not have access to this order.'}, status=status.HTTP_403_FORBIDDEN)

        if not order.razorpay_order_id:
            return Response({'error': 'No Razorpay order exists for this order yet.'}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = verify_razorpay_payment_signature(
            order.razorpay_order_id,
            payload['razorpay_payment_id'],
            payload['razorpay_signature'],
            settings.RAZORPAY_KEY_SECRET,
        )

        if not is_valid:
            logger.warning(
                'Razorpay signature mismatch for order %s with payment %s',
                order.id,
                payload['razorpay_payment_id'],
            )
            return Response({'error': 'Invalid payment signature.'}, status=status.HTTP_400_BAD_REQUEST)

        # B9: HMAC alone is not enough — confirm capture + amount via Razorpay API.
        try:
            payment = fetch_razorpay_payment(payload['razorpay_payment_id'])
            assert_razorpay_payment_matches_order(payment, order)
        except ValueError as exc:
            logger.warning(
                'Razorpay payment cross-check failed for order %s payment %s: %s',
                order.id,
                payload['razorpay_payment_id'],
                exc,
            )
            return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.exception(
                'Razorpay payment fetch failed for order %s payment %s',
                order.id,
                payload['razorpay_payment_id'],
            )
            return Response(
                {'error': 'Unable to verify payment with Razorpay. Please try again.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        order.payment_status = Order.PaymentStatus.PAID
        order.razorpay_payment_id = payload['razorpay_payment_id']
        order.save(update_fields=['payment_status', 'razorpay_payment_id'])

        return Response(
            {
                'order_id': str(order.id),
                'payment_status': order.payment_status,
                'razorpay_payment_id': order.razorpay_payment_id,
            },
            status=status.HTTP_200_OK,
        )


class RazorpayWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        signature = request.headers.get('X-Razorpay-Signature', '')
        if not settings.RAZORPAY_WEBHOOK_SECRET:
            return Response({'error': 'Razorpay webhook secret is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not verify_razorpay_webhook_signature(request.body, signature, settings.RAZORPAY_WEBHOOK_SECRET):
            logger.warning('Rejected Razorpay webhook due to invalid signature.')
            return Response({'error': 'Invalid webhook signature.'}, status=status.HTTP_400_BAD_REQUEST)

        payload = load_webhook_payload(request.body)
        event_type = payload.get('event')
        payment_entity = payload.get('payload', {}).get('payment', {}).get('entity', {})
        razorpay_order_id = payment_entity.get('order_id')

        if not razorpay_order_id:
            return Response({'status': 'ignored', 'reason': 'missing_order_id'}, status=status.HTTP_200_OK)

        order = Order.objects.filter(razorpay_order_id=razorpay_order_id).first()
        if not order:
            logger.warning('Razorpay webhook order_id %s not found locally.', razorpay_order_id)
            return Response({'status': 'ignored', 'reason': 'order_not_found'}, status=status.HTTP_200_OK)

        if event_type == 'payment.captured':
            payment_id = payment_entity.get('id', '')
            updates = []
            if order.payment_status != Order.PaymentStatus.PAID:
                order.payment_status = Order.PaymentStatus.PAID
                updates.append('payment_status')
            if payment_id and order.razorpay_payment_id != payment_id:
                order.razorpay_payment_id = payment_id
                updates.append('razorpay_payment_id')
            if updates:
                order.save(update_fields=updates)
            return Response({'status': 'ok', 'event': event_type}, status=status.HTTP_200_OK)

        if event_type == 'payment.failed':
            if order.payment_status != Order.PaymentStatus.PAID and order.payment_status != Order.PaymentStatus.PENDING:
                order.payment_status = Order.PaymentStatus.PENDING
                order.save(update_fields=['payment_status'])
            return Response({'status': 'ok', 'event': event_type}, status=status.HTTP_200_OK)

        return Response({'status': 'ignored', 'event': event_type}, status=status.HTTP_200_OK)
