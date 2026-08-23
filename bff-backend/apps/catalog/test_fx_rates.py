"""Tests for live FX rate endpoint with mocked provider."""

from unittest.mock import patch

from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalog.fx_rates import FX_CACHE_KEY, FX_FALLBACK_INR_PER_USD, get_inr_usd_rate


class FxRateApiTests(APITestCase):
	def setUp(self):
		cache.clear()

	def test_fx_rate_endpoint_is_public(self):
		with patch('apps.catalog.fx_rates.urllib.request.urlopen') as mock_urlopen:
			mock_urlopen.return_value.__enter__.return_value.read.return_value = (
				b'{"rates": {"INR": 83.25}}'
			)
			response = self.client.get('/api/v1/fx-rate/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertAlmostEqual(response.data['inr_per_usd'], 83.25)
		self.assertEqual(response.data['quote_currency'], 'USD')

	def test_fx_rate_uses_cache_within_ttl(self):
		with patch('apps.catalog.fx_rates.urllib.request.urlopen') as mock_urlopen:
			mock_urlopen.return_value.__enter__.return_value.read.return_value = (
				b'{"rates": {"INR": 84.0}}'
			)
			first = self.client.get('/api/v1/fx-rate/')
			second = self.client.get('/api/v1/fx-rate/')
		self.assertEqual(first.data['inr_per_usd'], 84.0)
		self.assertEqual(second.data['inr_per_usd'], 84.0)
		self.assertTrue(second.data.get('cached'))
		mock_urlopen.assert_called_once()

	def test_fx_rate_falls_back_when_provider_fails(self):
		with patch('apps.catalog.fx_rates.urllib.request.urlopen', side_effect=OSError('network down')):
			response = self.client.get('/api/v1/fx-rate/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['inr_per_usd'], FX_FALLBACK_INR_PER_USD)
		self.assertEqual(response.data['fallback'], 'static')

	def test_fx_rate_uses_last_good_after_provider_failure(self):
		cache.set(FX_CACHE_KEY, {
			'inr_per_usd': 82.5,
			'source': 'open.er-api.com',
		}, 3600)
		cache.delete(FX_CACHE_KEY)
		cache.set('bff:fx:inr_usd:last_good', {
			'inr_per_usd': 82.5,
			'source': 'open.er-api.com',
		}, None)
		with patch('apps.catalog.fx_rates.urllib.request.urlopen', side_effect=OSError('down')):
			data = get_inr_usd_rate(force_refresh=True)
		self.assertAlmostEqual(data['inr_per_usd'], 82.5)
		self.assertEqual(data['fallback'], 'last_good')
