"""Production settings guards — fail closed when insecure defaults are present."""

from django.core.exceptions import ImproperlyConfigured

# Historical insecure default shipped in earlier settings revisions.
INSECURE_DEFAULT_SECRET_KEY = (
    'django-insecure-bff-super-secret-key-change-in-production-2026'
)


def validate_production_settings(*, debug: bool, secret_key: str, allowed_hosts: list[str]) -> None:
    """
    Refuse to boot when DEBUG is False and critical security settings are still insecure.

    Call this after SECRET_KEY / ALLOWED_HOSTS are resolved from the environment.
    """
    if debug:
        return

    problems: list[str] = []

    if not secret_key or secret_key == INSECURE_DEFAULT_SECRET_KEY:
        problems.append(
            'SECRET_KEY is missing or still set to the insecure development default. '
            'Set a unique SECRET_KEY in the environment '
            '(e.g. python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())").'
        )

    hosts = [h.strip() for h in allowed_hosts if h and str(h).strip()]
    if not hosts:
        problems.append(
            'ALLOWED_HOSTS is empty. Set ALLOWED_HOSTS to your production hostname(s), '
            'e.g. ALLOWED_HOSTS=api.example.com,www.example.com'
        )
    elif '*' in hosts:
        problems.append(
            'ALLOWED_HOSTS must not contain "*". Set explicit hostnames for production.'
        )

    if problems:
        raise ImproperlyConfigured(
            'Refusing to start with DEBUG=False and insecure settings:\n- '
            + '\n- '.join(problems)
        )
