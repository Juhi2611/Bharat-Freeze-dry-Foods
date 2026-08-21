from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Product, Recipe, InteractiveExperience
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    RecipeSerializer, InteractiveExperienceSerializer
)
from apps.users.permissions import IsAdminRole

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['availability']
    ordering_fields = ['display_order', 'name']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'recipe', 'interactive_experience').all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category__name', 'category__slug', 'status', 'is_organic', 'export_ready', 'white_label_available']
    search_fields = ['name', 'blurb', 'full_description', 'sku']
    ordering_fields = ['price_inr', 'created_at', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.select_related('product').all()
    serializer_class = RecipeSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

class InteractiveExperienceViewSet(viewsets.ModelViewSet):
    queryset = InteractiveExperience.objects.select_related('product').all()
    serializer_class = InteractiveExperienceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]
