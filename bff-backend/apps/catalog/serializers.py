from rest_framework import serializers
from .models import Category, Product, Recipe, InteractiveExperience

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'cover_image',
            'availability', 'display_order', 'created_at', 'product_count',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'product_count']

    def get_product_count(self, obj):
        annotated = getattr(obj, 'product_count', None)
        if annotated is not None:
            return annotated
        return obj.products.count()

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'

class InteractiveExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractiveExperience
        fields = '__all__'

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'slug', 'category', 'category_name', 'category_slug',
            'pack_image', 'pack_image_transparent', 'ingredient_image', 'ingredient_image_transparent',
            'bg_removal_status', 'accent_color', 'price_inr',
            'is_organic', 'white_label_available', 'export_ready', 'blurb', 'status',
            'stock_quantity',
        ]

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    recipe = RecipeSerializer(read_only=True)
    interactive_experience = InteractiveExperienceSerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
