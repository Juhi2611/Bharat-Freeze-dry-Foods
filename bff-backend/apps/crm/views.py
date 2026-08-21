from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Customer, Order
from .serializers import CustomerSerializer, OrderSerializer
from apps.users.permissions import IsAdminRole

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminRole]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tier', 'is_active', 'country']
    search_fields = ['full_name', 'company_name', 'email', 'customer_code', 'phone']
    ordering_fields = ['created_at', 'company_name']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('customer', 'source_enquiry', 'source_private_label_enquiry').all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminRole]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['payment_status', 'fulfillment_status', 'is_domestic', 'payment_rail']
    search_fields = ['order_code', 'customer__company_name', 'customer__full_name', 'razorpay_order_id']
    ordering_fields = ['order_date', 'total_amount', 'created_at']
