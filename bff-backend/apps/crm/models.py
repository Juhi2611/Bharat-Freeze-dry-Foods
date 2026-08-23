import uuid
from django.db import IntegrityError, models, transaction
from django.conf import settings

from config.business_codes import allocate_prefixed_code


class Customer(models.Model):
    class Tier(models.TextChoices):
        VIP = 'VIP', 'VIP'
        STANDARD = 'Standard', 'Standard'
        LEAD = 'Lead', 'Lead'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_code = models.CharField(max_length=20, unique=True, editable=False, db_index=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='crm_profile',
    )
    full_name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=255)
    # Not unique: email-conflict isolation may create a second Customer for a
    # different user with the same email rather than sharing CRM profiles (IDOR).
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.LEAD)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.customer_code:
            return super().save(*args, **kwargs)
        last_error = None
        for _ in range(12):
            self.customer_code = allocate_prefixed_code(
                model=Customer,
                field='customer_code',
                prefix='CUST',
                offset=400,
            )
            try:
                with transaction.atomic():
                    return super().save(*args, **kwargs)
            except IntegrityError as exc:
                last_error = exc
                self.customer_code = ''
        raise last_error

    def __str__(self):
        return f"{self.customer_code} - {self.company_name}"


class Order(models.Model):
    class PaymentStatus(models.TextChoices):
        AWAITING_QUOTE = 'awaiting_quote', 'Awaiting Quote'
        QUOTED = 'quoted', 'Quoted'
        ADVANCE_PAID = 'advance_paid', 'Advance Paid'
        PAID = 'Paid', 'Paid'
        PENDING = 'Pending', 'Pending'
        REFUNDED = 'Refunded', 'Refunded'
        # Set by release_abandoned_orders when unpaid reservation TTL expires.
        CANCELLED = 'cancelled', 'Cancelled'

    class FulfillmentStatus(models.TextChoices):
        PROCESSING = 'Processing', 'Processing'
        SHIPPED = 'Shipped', 'Shipped'
        DELIVERED = 'Delivered', 'Delivered'
        PENDING = 'Pending', 'Pending'

    class PaymentRail(models.TextChoices):
        RAZORPAY = 'razorpay', 'Razorpay (Domestic)'
        ADVANCE_TT = 'advance_tt', 'Advance TT (International)'
        LC_SIGHT = 'lc_sight', 'LC at Sight (International)'
        CREDIT_TERMS = 'credit_terms', 'Approved Credit Terms'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_code = models.CharField(max_length=20, unique=True, editable=False, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, related_name='orders')
    # Guest checkout contact snapshot (populated when customer is null).
    guest_company_name = models.CharField(max_length=255, blank=True, default='')
    guest_contact_name = models.CharField(max_length=150, blank=True, default='')
    guest_email = models.EmailField(blank=True, default='')
    guest_phone = models.CharField(max_length=50, blank=True, default='')
    guest_country = models.CharField(max_length=100, blank=True, default='')
    guest_shipping_method = models.CharField(max_length=20, blank=True, default='')
    guest_incoterm = models.CharField(max_length=10, blank=True, default='')
    guest_payment_terms = models.CharField(max_length=20, blank=True, default='')
    guest_message = models.TextField(blank=True, default='')
    source_enquiry = models.ForeignKey('enquiries.Enquiry', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    source_private_label_enquiry = models.ForeignKey('enquiries.PrivateLabelEnquiry', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    is_domestic = models.BooleanField(default=False)
    payment_rail = models.CharField(max_length=20, choices=PaymentRail.choices, blank=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    items_summary = models.TextField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.AWAITING_QUOTE)
    fulfillment_status = models.CharField(max_length=20, choices=FulfillmentStatus.choices, default=FulfillmentStatus.PENDING)
    order_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.order_code:
            return super().save(*args, **kwargs)
        last_error = None
        for _ in range(12):
            self.order_code = allocate_prefixed_code(
                model=Order,
                field='order_code',
                prefix='ORD',
                offset=8900,
            )
            try:
                with transaction.atomic():
                    return super().save(*args, **kwargs)
            except IntegrityError as exc:
                last_error = exc
                self.order_code = ''
        raise last_error

    def __str__(self):
        return f"{self.order_code} ({self.payment_status})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(
        'catalog.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_items',
    )
    product_name_snapshot = models.CharField(max_length=255)
    unit_price_snapshot = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.total_price = self.unit_price_snapshot * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_name_snapshot} x {self.quantity}"
