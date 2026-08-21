import uuid
from django.db import models

class Enquiry(models.Model):
    class Status(models.TextChoices):
        NEW = 'New', 'New'
        CONTACTED = 'Contacted', 'Contacted'
        PENDING = 'Pending', 'Pending'
        CLOSED = 'Closed', 'Closed'

    class BuyerType(models.TextChoices):
        IMPORTER = 'importer', 'Importer'
        DISTRIBUTOR = 'distributor', 'Distributor'
        WHOLESALER = 'wholesaler', 'Wholesaler'
        FOOD_MANUFACTURER = 'food_manufacturer', 'Food Manufacturer'
        RETAILER = 'retailer', 'Retailer'
        HORECA = 'horeca', 'HoReCa'
        RESTAURANT = 'restaurant', 'Restaurant / Food Service'
        PRIVATE_LABEL_BRAND = 'private_label_brand', 'Private Label Brand'
        PET_FOOD_MANUFACTURER = 'pet_food_manufacturer', 'Pet Food Manufacturer'
        INGREDIENT_TRADER = 'ingredient_trader', 'Ingredient Trader'
        ECOMMERCE = 'ecommerce', 'E-commerce'
        OTHER = 'other', 'Other'

    class ShippingMethod(models.TextChoices):
        SEA_FCL = 'sea_fcl', 'Sea FCL'
        SEA_LCL = 'sea_lcl', 'Sea LCL'
        AIR = 'air', 'Air Freight'
        COURIER = 'courier', 'Courier / Express'
        BUYER_ARRANGED = 'buyer_arranged', 'Buyer-arranged logistics'

    class Incoterm(models.TextChoices):
        EXW = 'EXW', 'EXW'
        FOB = 'FOB', 'FOB'
        CFR = 'CFR', 'CFR'
        CIF = 'CIF', 'CIF'
        DDP = 'DDP', 'DDP'

    class PaymentTerms(models.TextChoices):
        ADVANCE_TT = 'advance_tt', 'Advance TT'
        LC_SIGHT = 'lc_sight', 'LC at Sight'
        PARTIAL_ADVANCE = 'partial_advance', 'Partial Advance + Balance'
        CREDIT_TERMS = 'credit_terms', 'Credit Terms (subject to approval)'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enquiry_code = models.CharField(max_length=20, unique=True, editable=False, db_index=True)

    # Core company & contact
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    buyer_type = models.CharField(max_length=30, choices=BuyerType.choices, blank=True)
    interested_products = models.JSONField(default=list)
    quantity_requirement = models.CharField(max_length=100)
    private_label_required = models.BooleanField(default=False)
    packaging_preference = models.CharField(max_length=100, blank=True)
    target_market = models.CharField(max_length=100, blank=True)
    additional_requirements = models.TextField(blank=True)

    # Shipping & trade terms
    shipping_method = models.CharField(max_length=20, choices=ShippingMethod.choices, blank=True)
    delivery_timeline = models.CharField(max_length=100, blank=True)
    incoterm = models.CharField(max_length=10, choices=Incoterm.choices, blank=True)
    payment_terms = models.CharField(max_length=20, choices=PaymentTerms.choices, blank=True)
    packaging_reference_file = models.FileField(upload_to='enquiries/packaging_refs/', blank=True, null=True)
    brand_guidelines_file = models.FileField(upload_to='enquiries/brand_guidelines/', blank=True, null=True)
    po_file = models.FileField(upload_to='enquiries/purchase_orders/', blank=True, null=True)

    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW, db_index=True)
    internal_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.enquiry_code:
            count = Enquiry.objects.count() + 9000
            self.enquiry_code = f"ENQ-{count + 1}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.enquiry_code} - {self.company_name}"


class PrivateLabelEnquiry(models.Model):
    class BrandStatus(models.TextChoices):
        EXISTING = 'existing', 'Existing Brand'
        NEW = 'new', 'New Brand'

    class PackagingFormat(models.TextChoices):
        RETAIL_POUCH = 'retail_pouch', 'Retail Pouch'
        GLASS_JAR = 'glass_jar', 'Glass Jar/Bottle'
        BULK_BAG = 'bulk_bag', 'Bulk Bag'
        SACHET = 'sachet', 'Sachet'
        CUSTOM = 'custom', 'Custom Packaging'

    class QuantityRange(models.TextChoices):
        TRIAL = 'trial', 'Trial Order'
        R_100_500 = '100_500', '100–500 units'
        R_500_1000 = '500_1000', '500–1,000 units'
        R_1000_5000 = '1000_5000', '1,000–5,000 units'
        R_5000_10000 = '5000_10000', '5,000–10,000 units'
        R_10000_PLUS = '10000_plus', '10,000+ units'
        BULK_MT = 'bulk_mt', 'Bulk / MT requirement'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enquiry_code = models.CharField(max_length=20, unique=True, editable=False, db_index=True)
    step_completed = models.PositiveIntegerField(default=1)  # 1 to 8 tracking progress

    # Step 1 — Company
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    buyer_type = models.CharField(max_length=30, choices=Enquiry.BuyerType.choices, blank=True)

    # Step 2 — Brand
    brand_name = models.CharField(max_length=255, blank=True)
    brand_status = models.CharField(max_length=10, choices=BrandStatus.choices, blank=True)
    brand_website_social = models.CharField(max_length=255, blank=True)
    target_market = models.CharField(max_length=100, blank=True)

    # Step 3 — Product
    product_category = models.ForeignKey('catalog.Category', on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey('catalog.Product', on_delete=models.SET_NULL, null=True, blank=True)
    desired_specification = models.TextField(blank=True)
    cut_size_form = models.CharField(max_length=255, blank=True)
    flavour_recipe = models.CharField(max_length=255, blank=True)

    # Step 4 — Quantity
    packaging_format = models.CharField(max_length=20, choices=PackagingFormat.choices, blank=True)
    quantity_range = models.CharField(max_length=20, choices=QuantityRange.choices, blank=True)

    # Step 5 — Branding
    has_existing_artwork = models.BooleanField(default=False)
    needs_design_support = models.BooleanField(default=False)
    logo_file = models.FileField(upload_to='private_label/logos/', blank=True, null=True)
    brand_guidelines_file = models.FileField(upload_to='private_label/guidelines/', blank=True, null=True)
    packaging_reference_file = models.FileField(upload_to='private_label/packaging_refs/', blank=True, null=True)
    custom_label_requirements = models.TextField(blank=True)

    # Step 6 — Regulatory
    target_country = models.CharField(max_length=100, blank=True)
    intended_application = models.CharField(max_length=255, blank=True)
    required_certifications = models.JSONField(default=list)  # ["Halal", "Kosher", "FDA"]
    import_requirements = models.TextField(blank=True)
    existing_regulatory_specs = models.TextField(blank=True)

    # Step 7 — Commercial
    target_launch_date = models.DateField(blank=True, null=True)
    target_price_range = models.CharField(max_length=100, blank=True)
    desired_incoterm = models.CharField(max_length=10, choices=Enquiry.Incoterm.choices, blank=True)
    preferred_payment_terms = models.CharField(max_length=20, choices=Enquiry.PaymentTerms.choices, blank=True)
    shipping_destination = models.CharField(max_length=255, blank=True)

    # Step 8 — Submission Status
    status = models.CharField(max_length=20, choices=Enquiry.Status.choices, default=Enquiry.Status.NEW)
    internal_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.enquiry_code:
            count = PrivateLabelEnquiry.objects.count() + 5000
            self.enquiry_code = f"PL-{count + 1}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.enquiry_code} - {self.brand_name or self.company_name}"
