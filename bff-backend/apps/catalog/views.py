from django.db.models import Count
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Product, Recipe, InteractiveExperience
from .fx_rates import get_inr_usd_rate
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    RecipeSerializer, InteractiveExperienceSerializer
)
from apps.users.permissions import IsContentStaff

class FxRateView(APIView):
	"""Public cached INR→USD indicative rate for storefront cart/checkout."""

	permission_classes = [permissions.AllowAny]
	authentication_classes = []

	def get(self, request):
		return Response(get_inr_usd_rate())

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['availability']
    ordering_fields = ['display_order', 'name']

    def get_queryset(self):
        return Category.objects.annotate(
            product_count=Count('products', distinct=True),
        ).order_by('display_order', 'name')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

    def perform_destroy(self, instance):
        assigned = instance.products.count()
        if assigned:
            raise ValidationError({
                'detail': (
                    f'Cannot delete category: {assigned} product(s) are assigned. '
                    'Reassign or delete them first.'
                ),
            })
        instance.delete()

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'recipe', 'interactive_experience').all()
    lookup_field = 'slug'
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
        return [IsContentStaff()]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action in ['list', 'retrieve']:
            queryset = queryset.filter(status=Product.Status.PUBLISHED)
        return queryset

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.select_related('product').all()
    serializer_class = RecipeSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]

class InteractiveExperienceViewSet(viewsets.ModelViewSet):
    queryset = InteractiveExperience.objects.select_related('product').all()
    serializer_class = InteractiveExperienceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsContentStaff()]
