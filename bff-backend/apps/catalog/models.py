import uuid
from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    class Availability(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        COMING_SOON = 'coming_soon', 'Coming Soon'
        CUSTOM_DEVELOPMENT = 'custom_dev', 'Custom Development Only'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    cover_image = models.URLField(blank=True, default='')
    availability = models.CharField(max_length=20, choices=Availability.choices, default=Availability.AVAILABLE)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or 'category'
            self.slug = base_slug
            suffix = 2
            while Category.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base_slug}-{suffix}'
                suffix += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    class Status(models.TextChoices):
        PUBLISHED = 'Published', 'Published'
        DRAFT = 'Draft', 'Draft'
        OUT_OF_STOCK = 'Out of Stock', 'Out of Stock'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    pack_image = models.URLField()
    ingredient_image = models.URLField()
    accent_color = models.CharField(max_length=10, default='#4FA8D8')
    price_inr = models.DecimalField(max_digits=10, decimal_places=2)
    is_organic = models.BooleanField(default=False)
    white_label_available = models.BooleanField(default=True)
    export_ready = models.BooleanField(default=True)
    blurb = models.TextField()
    full_description = models.TextField(blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or slugify(self.sku)
            self.slug = base_slug
            suffix = 2
            while Product.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{base_slug}-{suffix}'
                suffix += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'Easy', 'Easy'
        MEDIUM = 'Medium', 'Medium'
        HARD = 'Hard', 'Hard'

    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='recipe')
    slug = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    video_url = models.URLField()
    prep_time = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.EASY)
    ingredients = models.JSONField(default=list)
    calories = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class InteractiveExperience(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='interactive_experience')
    title = models.CharField(max_length=255)
    description = models.TextField()
    features = models.JSONField(default=list)
    video_url = models.URLField()
    ingredient_benefits = models.JSONField(default=list)

    def __str__(self):
        return self.title
