from rest_framework import serializers
from .models import Category, Product, Recipe, InteractiveExperience

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

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
            'pack_image', 'ingredient_image', 'accent_color', 'price_inr',
            'is_organic', 'white_label_available', 'export_ready', 'blurb', 'status'
        ]

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    recipe = RecipeSerializer(read_only=True)
    interactive_experience = InteractiveExperienceSerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
