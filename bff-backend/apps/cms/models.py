import uuid
from django.db import models

class WebsiteSection(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # sec-hero, sec-about
    title = models.CharField(max_length=255)
    subtitle = models.TextField()
    route_url = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='Active')
    content_payload = models.JSONField(default=dict)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.title}"


class SiteSettings(models.Model):
    company_name = models.CharField(max_length=255, default="Bharat Freeze Dry Foods (BFF)")
    tagline = models.CharField(max_length=255, default="Sourcing the Best Quality, For You.")
    company_address = models.TextField(default="Gujarat, India")
    support_email = models.EmailField(default="export@bff-foods.com")
    support_phone = models.CharField(max_length=50, default="+91 98765 43210")
    whatsapp_number = models.CharField(max_length=50, default="+91 98765 43210")
    default_currency = models.CharField(max_length=10, default="INR")
    social_links = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1  # Singleton pattern
        super().save(*args, **kwargs)

    def __str__(self):
        return self.company_name


class FAQ(models.Model):
    class Category(models.TextChoices):
        GENERAL = 'general', 'General'
        PRODUCT = 'product', 'Product'
        PRIVATE_LABEL = 'private_label', 'Private Label'
        SHIPPING = 'shipping', 'Shipping & Trade'
        QUALITY = 'quality', 'Quality & Certification'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.GENERAL)
    question = models.CharField(max_length=500)
    answer = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'display_order']

    def __str__(self):
        return self.question


class RegionComplianceProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    region_code = models.CharField(max_length=10, unique=True)  # 'US', 'EU', 'ME', 'JP'
    region_name = models.CharField(max_length=100)
    required_fields = models.JSONField(default=list)          # ['fda_registration_number', 'fsma_facility_id']
    relevant_certifications = models.JSONField(default=list)  # ['Halal']
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.region_name} ({self.region_code})"


class Certification(models.Model):
    class Status(models.TextChoices):
        OBTAINED = 'obtained', 'Obtained'
        IN_PROGRESS = 'in_progress', 'In Progress'
        PLANNED = 'planned', 'Planned'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)  # BRCGS, IFS, HACCP, Halal, Kosher, US FDA, etc.
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PLANNED)
    target_date = models.DateField(blank=True, null=True)
    badge_icon_url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"


class CompanyTimelineEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    period_label = models.CharField(max_length=50)   # "2025/2026"
    title = models.CharField(max_length=255)           # "Concept & Formation"
    description = models.TextField()
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"{self.period_label} - {self.title}"


class FounderMessage(models.Model):
    founder_name = models.CharField(max_length=150, blank=True)
    title = models.CharField(max_length=150, default="Founder & Executive Director")
    message = models.TextField()
    photo_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1  # Singleton pattern
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Founder Message ({self.founder_name or 'BFF Leadership'})"


class QualityAssuranceStep(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stage_name = models.CharField(max_length=100)  # "Raw Material Inspection", "Sublimation Vacuum Testing"
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default="ShieldCheck")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.stage_name
