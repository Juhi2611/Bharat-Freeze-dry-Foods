"""Server-side INR/USD rate lookup with caching (live FX follow-up)."""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request

from django.core.cache import cache

logger = logging.getLogger(__name__)

FX_CACHE_KEY = 'bff:fx:inr_usd'
FX_LAST_GOOD_KEY = 'bff:fx:inr_usd:last_good'
FX_CACHE_TTL_SECONDS = 4 * 60 * 60  # 4 hours
FX_FALLBACK_INR_PER_USD = 85.0
# open.er-api.com — free, no API key (same family as exchangerate-api.com open access).
FX_PROVIDER_URL = 'https://open.er-api.com/v6/latest/USD'


def get_inr_usd_rate(*, force_refresh: bool = False) -> dict:
	"""
	Return ``{ inr_per_usd, source, cached, fallback? }``.

	``inr_per_usd`` is how many INR equal one USD (e.g. 83.5).
	Convert INR → USD: amount_inr / inr_per_usd.
	"""
	if not force_refresh:
		cached = cache.get(FX_CACHE_KEY)
		if cached is not None:
			return {**cached, 'cached': True}

	try:
		with urllib.request.urlopen(FX_PROVIDER_URL, timeout=8) as response:
			payload = json.loads(response.read().decode('utf-8'))
		inr_per_usd = float(payload['rates']['INR'])
		if inr_per_usd <= 0:
			raise ValueError('Invalid INR rate from provider')
		result = {
			'base_currency': 'INR',
			'quote_currency': 'USD',
			'inr_per_usd': inr_per_usd,
			'source': 'open.er-api.com',
			'cached': False,
		}
		cache.set(FX_CACHE_KEY, result, FX_CACHE_TTL_SECONDS)
		cache.set(FX_LAST_GOOD_KEY, result, None)
		return result
	except (urllib.error.URLError, urllib.error.HTTPError, OSError, KeyError, ValueError, TypeError, json.JSONDecodeError) as exc:
		logger.warning('FX provider fetch failed: %s', exc)
		last_good = cache.get(FX_LAST_GOOD_KEY)
		if last_good is not None:
			return {**last_good, 'cached': True, 'fallback': 'last_good'}
		return {
			'base_currency': 'INR',
			'quote_currency': 'USD',
			'inr_per_usd': FX_FALLBACK_INR_PER_USD,
			'source': 'static_fallback',
			'cached': False,
			'fallback': 'static',
		}
