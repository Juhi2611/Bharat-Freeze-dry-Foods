from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, RecipeViewSet, InteractiveExperienceViewSet, FxRateView

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('recipes', RecipeViewSet, basename='recipe')
router.register('interactive-experiences', InteractiveExperienceViewSet, basename='interactive-experience')

urlpatterns = [
    path('fx-rate/', FxRateView.as_view(), name='fx-rate'),
    path('', include(router.urls)),
]
