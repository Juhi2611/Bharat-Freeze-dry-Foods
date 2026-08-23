import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.SUPER_ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'super_admin', 'Super Admin'
        EXPORT_MANAGER = 'export_manager', 'Export Manager'
        CONTENT_EDITOR = 'content_editor', 'Content Editor'
        CUSTOMER = 'customer', 'Customer / Buyer'

    username = None
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    avatar_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class EmailOTP(models.Model):
	"""Short-lived OTP used to verify an email before customer registration."""

	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	email = models.EmailField(db_index=True)
	# SHA-256 hex digest of peppered OTP — never store the raw 6-digit code.
	code_hash = models.CharField(
		max_length=64,
		help_text='SHA-256 hex digest of peppered OTP; raw codes are never stored.',
	)
	is_verified = models.BooleanField(default=False)
	attempts = models.PositiveSmallIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	expires_at = models.DateTimeField()
	verified_at = models.DateTimeField(null=True, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=['email', '-created_at']),
		]

	def __str__(self):
		status = 'verified' if self.is_verified else 'pending'
		return f"{self.email} ({status})"

	@property
	def is_expired(self):
		return timezone.now() >= self.expires_at
