import uuid
from django.db import models

class Customer(models.Model):
    class Tier(models.TextChoices):
        VIP = 'VIP', 'VIP'
        STANDARD = 'Standard', 'Standard'
        LEAD = 'Lead', 'Lead'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_code = models.CharField(max_length=20, unique=True, editable=False, db_index=True)
    full_name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.LEAD)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.customer_code:
            count = Customer.objects.count() + 400
            self.customer_code = f"CUST-{count + 1}"
        super().save(*args, **kwargs)

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
    source_enquiry = models.ForeignKey('enquiries.Enquiry', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    source_private_label_enquiry = models.ForeignKey('enquiries.PrivateLabelEnquiry', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    is_domestic = models.BooleanField(default=False)
    payment_rail = models.CharField(max_length=20, choices=PaymentRail.choices, blank=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    items_summary = models.TextField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.AWAITING_QUOTE)
    fulfillment_status = models.CharField(max_length=20, choices=FulfillmentStatus.choices, default=FulfillmentStatus.PENDING)
    order_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.order_code:
            count = Order.objects.count() + 8900
            self.order_code = f"ORD-{count + 1}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_code} ({self.payment_status})"
