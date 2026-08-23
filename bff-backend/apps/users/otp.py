from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import timedelta
from typing import Optional

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import EmailOTP, User
from .otp_email import render_otp_email_html, render_otp_email_text

OTP_LENGTH = 6
OTP_TTL_MINUTES = 10
OTP_MAX_ATTEMPTS = 5
OTP_RESEND_COOLDOWN_SECONDS = 60
VERIFIED_WINDOW_MINUTES = 30

# Generic copy returned for every send-otp success path (anti-enumeration).
OTP_SEND_SUCCESS_DETAIL = (
	'If this email can receive a verification code, one has been sent. '
	'Please check your inbox.'
)


def normalize_email(email: str) -> str:
	return User.objects.normalize_email(email.strip().lower())


def generate_otp_code() -> str:
	return f"{secrets.randbelow(10 ** OTP_LENGTH):0{OTP_LENGTH}d}"


def hash_otp_code(code: str) -> str:
	"""SHA-256(pepper:code). Pepper defaults to Django SECRET_KEY."""
	pepper = getattr(settings, 'OTP_PEPPER', None) or settings.SECRET_KEY
	material = f'{pepper}:{str(code).strip()}'.encode('utf-8')
	return hashlib.sha256(material).hexdigest()


def check_otp_code(raw_code: str, stored_hash: str) -> bool:
	if not stored_hash:
		return False
	return hmac.compare_digest(hash_otp_code(raw_code), stored_hash)


def latest_otp(email: str) -> Optional[EmailOTP]:
	return EmailOTP.objects.filter(email=normalize_email(email)).order_by('-created_at').first()


def create_and_send_otp(email: str) -> Optional[EmailOTP]:
	"""
	Create and email an OTP for registration.

	Returns the EmailOTP row when a code was actually issued.
	Returns None when the email already has an account — callers must still
	return the same generic success response (anti-enumeration).
	"""
	email = normalize_email(email)

	# Do not reveal whether this email is already registered.
	if User.objects.filter(email__iexact=email).exists():
		return None

	existing = latest_otp(email)
	if existing and not existing.is_expired:
		elapsed = (timezone.now() - existing.created_at).total_seconds()
		if elapsed < OTP_RESEND_COOLDOWN_SECONDS:
			wait = int(OTP_RESEND_COOLDOWN_SECONDS - elapsed)
			raise ValueError(f'Please wait {wait}s before requesting another OTP.')

	code = generate_otp_code()
	otp = EmailOTP.objects.create(
		email=email,
		code_hash=hash_otp_code(code),
		expires_at=timezone.now() + timedelta(minutes=OTP_TTL_MINUTES),
	)

	try:
		send_mail(
			subject='Your BFF verification code',
			message=render_otp_email_text(code=code, ttl_minutes=OTP_TTL_MINUTES),
			from_email=settings.DEFAULT_FROM_EMAIL,
			recipient_list=[email],
			html_message=render_otp_email_html(code=code, ttl_minutes=OTP_TTL_MINUTES),
			fail_silently=False,
		)
	except Exception:
		# Do not leave a usable OTP when delivery failed.
		otp.delete()
		raise

	# Local/dev visibility when SMTP is misconfigured — still only after successful send.
	if settings.DEBUG:
		print(f'[OTP] sent to {email}: {code}')

	return otp


def verify_otp(email: str, code: str) -> EmailOTP:
	email = normalize_email(email)
	otp = latest_otp(email)

	if not otp:
		raise ValueError('No OTP found for this email. Please request a new code.')
	if otp.is_verified:
		raise ValueError('This email is already verified. You can continue registration.')
	if otp.is_expired:
		raise ValueError('OTP has expired. Please request a new code.')
	if otp.attempts >= OTP_MAX_ATTEMPTS:
		raise ValueError('Too many invalid attempts. Please request a new code.')

	otp.attempts += 1
	if not check_otp_code(code, otp.code_hash):
		otp.save(update_fields=['attempts'])
		remaining = OTP_MAX_ATTEMPTS - otp.attempts
		if remaining <= 0:
			raise ValueError('Too many invalid attempts. Please request a new code.')
		raise ValueError(f'Invalid OTP. {remaining} attempt(s) remaining.')

	otp.is_verified = True
	otp.verified_at = timezone.now()
	otp.save(update_fields=['attempts', 'is_verified', 'verified_at'])
	return otp


def email_is_verified(email: str) -> bool:
	email = normalize_email(email)
	cutoff = timezone.now() - timedelta(minutes=VERIFIED_WINDOW_MINUTES)
	return EmailOTP.objects.filter(
		email=email,
		is_verified=True,
		verified_at__gte=cutoff,
	).exists()


def consume_verified_otp(email: str) -> None:
	"""Invalidate verified OTPs after successful registration."""
	email = normalize_email(email)
	EmailOTP.objects.filter(email=email, is_verified=True).delete()
