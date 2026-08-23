from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import EmailOTP, User


@admin.register(User)
class BFFUserAdmin(UserAdmin):
	ordering = ('email',)
	list_display = ('email', 'full_name', 'role', 'is_staff', 'is_active', 'date_joined')
	search_fields = ('email', 'full_name', 'company_name', 'country')
	list_filter = ('role', 'is_staff', 'is_active', 'is_superuser')
	fieldsets = (
		(None, {'fields': ('email', 'password')}),
		('Personal information', {'fields': ('full_name', 'company_name', 'country', 'avatar_url')}),
		('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
		('Important dates', {'fields': ('last_login', 'date_joined')}),
	)
	add_fieldsets = (
		(None, {'classes': ('wide',), 'fields': ('email', 'full_name', 'password1', 'password2')}),
	)


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
	list_display = (
		'email',
		'code_redacted',
		'is_verified',
		'attempts',
		'created_at',
		'expires_at',
		'verified_at',
	)
	search_fields = ('email',)
	list_filter = ('is_verified',)
	readonly_fields = (
		'id',
		'email',
		'code_redacted',
		'is_verified',
		'attempts',
		'created_at',
		'expires_at',
		'verified_at',
	)
	exclude = ('code_hash',)

	@admin.display(description='Code')
	def code_redacted(self, obj):
		return '••••••'
