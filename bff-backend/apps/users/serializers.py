from rest_framework import serializers

from .models import User
from .otp import consume_verified_otp, email_is_verified, normalize_email


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'full_name',
            'company_name',
            'country',
            'role',
            'avatar_url',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'email', 'role', 'created_at', 'updated_at']


class MeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'company_name', 'country', 'avatar_url']

    def validate_full_name(self, value):
        cleaned = (value or '').strip()
        if not cleaned:
            raise serializers.ValidationError('Full name is required.')
        return cleaned


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'full_name', 'company_name', 'country']

    def validate_email(self, value):
        email = normalize_email(value)
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('User with this email already exists.')
        if not email_is_verified(email):
            raise serializers.ValidationError(
                'Please verify your email with the OTP before creating an account.'
            )
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            role=User.Role.CUSTOMER,
            **validated_data,
        )
        user.set_password(password)
        user.save()
        consume_verified_otp(user.email)
        return user


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return normalize_email(value)


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)

    def validate_email(self, value):
        return normalize_email(value)

    def validate_otp(self, value):
        if not str(value).isdigit():
            raise serializers.ValidationError('OTP must be a 6-digit number.')
        return str(value).strip()
