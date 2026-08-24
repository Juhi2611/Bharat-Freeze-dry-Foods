from rest_framework import serializers
from .models import Category, Product, Recipe, InteractiveExperience
from config.utils import normalize_media_url

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()

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

    def get_cover_image(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.cover_image, request)

class RecipeSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = '__all__'

    def get_video_url(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.video_url, request)

class InteractiveExperienceSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = InteractiveExperience
        fields = '__all__'

    def get_video_url(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.video_url, request)

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    pack_image = serializers.SerializerMethodField()
    pack_image_transparent = serializers.SerializerMethodField()
    ingredient_image = serializers.SerializerMethodField()
    ingredient_image_transparent = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'slug', 'category', 'category_name', 'category_slug',
            'pack_image', 'pack_image_transparent', 'ingredient_image', 'ingredient_image_transparent',
            'bg_removal_status', 'accent_color', 'price_inr',
            'is_organic', 'white_label_available', 'export_ready', 'blurb', 'status',
            'stock_quantity',
        ]

    def get_pack_image(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.pack_image, request)

    def get_pack_image_transparent(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.pack_image_transparent, request)

    def get_ingredient_image(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.ingredient_image, request)

    def get_ingredient_image_transparent(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.ingredient_image_transparent, request)

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    recipe = RecipeSerializer(read_only=True)
    interactive_experience = InteractiveExperienceSerializer(read_only=True)
    pack_image = serializers.SerializerMethodField()
    pack_image_transparent = serializers.SerializerMethodField()
    ingredient_image = serializers.SerializerMethodField()
    ingredient_image_transparent = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_pack_image(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.pack_image, request)

    def get_pack_image_transparent(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.pack_image_transparent, request)

    def get_ingredient_image(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.ingredient_image, request)

    def get_ingredient_image_transparent(self, obj):
        request = self.context.get('request')
        return normalize_media_url(obj.ingredient_image_transparent, request)
