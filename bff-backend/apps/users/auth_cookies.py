"""httpOnly refresh-token cookie helpers (F5 interim hybrid auth)."""

from __future__ import annotations

from datetime import timedelta

from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware, get_token
from rest_framework import exceptions
from rest_framework.request import Request
from rest_framework.response import Response

REFRESH_COOKIE_NAME = 'bff_refresh_token'
# Only attach the refresh cookie to auth endpoints (least privilege).
REFRESH_COOKIE_PATH = '/api/v1/auth/'


def refresh_cookie_max_age() -> int:
	lifetime = settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME', timedelta(days=7))
	if isinstance(lifetime, timedelta):
		return int(lifetime.total_seconds())
	return int(lifetime)


def refresh_cookie_secure() -> bool:
	return bool(getattr(settings, 'REFRESH_COOKIE_SECURE', not settings.DEBUG))


def refresh_cookie_samesite() -> str:
	return getattr(settings, 'REFRESH_COOKIE_SAMESITE', 'Lax')


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
	response.set_cookie(
		key=REFRESH_COOKIE_NAME,
		value=str(refresh_token),
		max_age=refresh_cookie_max_age(),
		httponly=True,
		secure=refresh_cookie_secure(),
		samesite=refresh_cookie_samesite(),
		path=REFRESH_COOKIE_PATH,
	)


def clear_refresh_cookie(response: Response) -> None:
	response.delete_cookie(
		key=REFRESH_COOKIE_NAME,
		path=REFRESH_COOKIE_PATH,
		samesite=refresh_cookie_samesite(),
	)


def get_refresh_token_from_cookie(request: Request) -> str | None:
	return request.COOKIES.get(REFRESH_COOKIE_NAME) or None


def ensure_csrf_cookie(request: Request) -> str:
	"""Ensure Django's csrftoken cookie is present; return the token value."""
	return get_token(request)


def enforce_csrf(request: Request) -> None:
	"""
	CSRF check for cookie-authenticated mutating endpoints.

	DRF only auto-enforces CSRF under SessionAuthentication. Refresh/logout
	authenticate via an httpOnly cookie, so we enforce CSRF explicitly.
	"""

	def _dummy_get_response(_request):
		return None

	check = CsrfViewMiddleware(_dummy_get_response)
	check.process_request(request)
	reason = check.process_view(request, None, (), {})
	if reason:
		raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')
