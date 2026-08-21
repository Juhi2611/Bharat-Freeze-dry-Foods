from rest_framework import serializers
from .models import Customer, Order

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['customer_code', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    customer_company = serializers.ReadOnlyField(source='customer.company_name')

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_code', 'created_at']
