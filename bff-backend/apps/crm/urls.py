from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, OrderCheckoutView, OrderViewSet

router = DefaultRouter()
router.register('customers', CustomerViewSet, basename='customer')
router.register('orders', OrderViewSet, basename='order')

urlpatterns = [
    path('orders/checkout/', OrderCheckoutView.as_view(), name='order-checkout'),
    path('', include(router.urls)),
]
