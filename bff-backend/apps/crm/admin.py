from django.contrib import admin
from .models import Customer, Order, OrderItem

class OrderItemInline(admin.TabularInline):
	model = OrderItem
	extra = 0
	readonly_fields = ('total_price',)
	fields = ('product', 'product_name_snapshot', 'unit_price_snapshot', 'quantity', 'total_price')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
	list_display = ('customer_code', 'full_name', 'company_name', 'email', 'user', 'country', 'tier', 'is_active', 'created_at')
	search_fields = ('customer_code', 'full_name', 'company_name', 'email', 'user__email', 'country')
	list_filter = ('tier', 'is_active', 'country')
	readonly_fields = ('customer_code', 'created_at')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ('order_code', 'customer', 'total_amount', 'currency', 'payment_status', 'fulfillment_status', 'order_date')
	search_fields = ('order_code', 'customer__full_name', 'customer__company_name', 'razorpay_order_id')
	list_filter = ('payment_status', 'fulfillment_status', 'payment_rail', 'is_domestic', 'currency')
	list_select_related = ('customer',)
	readonly_fields = ('order_code', 'order_date', 'created_at')
	inlines = (OrderItemInline,)

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
	list_display = ('order', 'product_name_snapshot', 'quantity', 'unit_price_snapshot', 'total_price')
	search_fields = ('order__order_code', 'product_name_snapshot', 'product__name')
	list_filter = ('product',)
	readonly_fields = ('total_price',)
