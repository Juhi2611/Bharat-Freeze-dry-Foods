from django.core.exceptions import ImproperlyConfigured
from django.test import SimpleTestCase

from config.security import INSECURE_DEFAULT_SECRET_KEY, validate_production_settings


class ProductionSettingsGuardTests(SimpleTestCase):
	"""B2: production boot must refuse insecure SECRET_KEY / ALLOWED_HOSTS."""

	def test_debug_true_allows_insecure_defaults(self):
		validate_production_settings(
			debug=True,
			secret_key=INSECURE_DEFAULT_SECRET_KEY,
			allowed_hosts=['*'],
		)

	def test_debug_false_rejects_insecure_secret_key(self):
		with self.assertRaises(ImproperlyConfigured) as ctx:
			validate_production_settings(
				debug=False,
				secret_key=INSECURE_DEFAULT_SECRET_KEY,
				allowed_hosts=['api.example.com'],
			)
		self.assertIn('SECRET_KEY', str(ctx.exception))

	def test_debug_false_rejects_empty_allowed_hosts(self):
		with self.assertRaises(ImproperlyConfigured) as ctx:
			validate_production_settings(
				debug=False,
				secret_key='production-grade-secret-key-value-32chars',
				allowed_hosts=[],
			)
		self.assertIn('ALLOWED_HOSTS', str(ctx.exception))

	def test_debug_false_rejects_wildcard_allowed_hosts(self):
		with self.assertRaises(ImproperlyConfigured) as ctx:
			validate_production_settings(
				debug=False,
				secret_key='production-grade-secret-key-value-32chars',
				allowed_hosts=['*'],
			)
		self.assertIn('ALLOWED_HOSTS', str(ctx.exception))

	def test_debug_false_accepts_secure_explicit_config(self):
		validate_production_settings(
			debug=False,
			secret_key='production-grade-secret-key-value-32chars',
			allowed_hosts=['api.example.com', 'www.example.com'],
		)
