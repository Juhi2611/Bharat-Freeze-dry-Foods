from django.contrib import admin
from .models import Category, Product, Recipe, InteractiveExperience

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('name', 'slug', 'availability', 'display_order', 'created_at')
	search_fields = ('name', 'slug', 'description')
	list_filter = ('availability',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ('sku', 'name', 'category', 'price_inr', 'stock_quantity', 'status', 'export_ready')
	search_fields = ('sku', 'name', 'slug', 'blurb')
	list_filter = ('status', 'export_ready', 'is_organic', 'white_label_available', 'category')
	list_select_related = ('category',)

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
	list_display = ('title', 'product', 'difficulty', 'prep_time', 'created_at')
	search_fields = ('title', 'slug', 'description', 'product__name')
	list_filter = ('difficulty',)

@admin.register(InteractiveExperience)
class InteractiveExperienceAdmin(admin.ModelAdmin):
	list_display = ('title', 'product')
	search_fields = ('title', 'description', 'product__name')
