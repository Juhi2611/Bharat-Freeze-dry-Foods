from rest_framework import serializers
from .models import Customer, Order, OrderItem


class CheckoutCartItemSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1)
    price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)


class CheckoutOrderRequestSerializer(serializers.Serializer):
    cart = CheckoutCartItemSerializer(many=True, allow_empty=False)
    company_name = serializers.CharField(max_length=255, allow_blank=True)
    contact_person = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=50, allow_blank=True, required=False)
    country = serializers.CharField(max_length=100)
    shipping_method = serializers.CharField(max_length=20, allow_blank=True, required=False)
    incoterm = serializers.CharField(max_length=10, allow_blank=True, required=False)
    payment_terms = serializers.CharField(max_length=20, allow_blank=True, required=False)
    message = serializers.CharField(allow_blank=True, required=False)


class CreatePaymentRequestSerializer(serializers.Serializer):
    order_access_token = serializers.CharField(required=False, allow_blank=True)


class VerifyPaymentRequestSerializer(serializers.Serializer):
    razorpay_payment_id = serializers.CharField(max_length=100)
    razorpay_signature = serializers.CharField(max_length=255)
    order_access_token = serializers.CharField(required=False, allow_blank=True)


class CustomerSerializer(serializers.ModelSerializer):
    linked_user_id = serializers.ReadOnlyField(source='user.id')
    linked_user_email = serializers.ReadOnlyField(source='user.email')
    total_orders = serializers.IntegerField(read_only=True)
    lifetime_value = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = [
            'customer_code', 'created_at', 'linked_user_id', 'linked_user_email',
            'total_orders', 'lifetime_value',
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['total_price']


class _GuestContactMixin:
    """Expose customer_* fields with guest-contact fallback for unpaid guest orders."""

    def get_customer_name(self, obj):
        if obj.customer_id:
            return obj.customer.full_name
        return obj.guest_contact_name

    def get_customer_company(self, obj):
        if obj.customer_id:
            return obj.customer.company_name
        return obj.guest_company_name

    def get_customer_email(self, obj):
        if obj.customer_id:
            return obj.customer.email
        return obj.guest_email

    def get_customer_phone(self, obj):
        if obj.customer_id:
            return obj.customer.phone
        return obj.guest_phone

    def get_customer_country(self, obj):
        if obj.customer_id:
            return obj.customer.country
        return obj.guest_country


class OrderSerializer(_GuestContactMixin, serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_company = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    customer_country = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_code', 'created_at']


class CustomerOrderSerializer(_GuestContactMixin, serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_company = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    customer_country = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_code', 'customer', 'customer_name', 'customer_company',
            'customer_email', 'customer_phone', 'customer_country',
            'items_summary', 'items', 'total_amount', 'currency',
            'payment_status', 'fulfillment_status', 'order_date', 'created_at',
            'guest_company_name', 'guest_contact_name', 'guest_email',
            'guest_phone', 'guest_country',
        ]
        read_only_fields = fields
