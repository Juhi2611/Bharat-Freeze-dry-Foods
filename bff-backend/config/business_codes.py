"""Collision-resistant sequential business codes (B13)."""

from __future__ import annotations

from django.db import transaction


def allocate_prefixed_code(*, model, field: str, prefix: str, offset: int) -> str:
	"""
	Next ``PREFIX-N`` code, skipping any that already exist.

	Pair with IntegrityError retries in ``Model.save`` so concurrent inserts that
	race the unique constraint still land on unique codes.
	"""
	with transaction.atomic():
		# Serialize when the backend supports row locks (Postgres/MySQL).
		# On SQLite this is best-effort; IntegrityError retries cover residual races.
		list(model.objects.select_for_update().order_by('-pk')[:1])
		n = model.objects.count() + offset + 1
		while model.objects.filter(**{field: f'{prefix}-{n}'}).exists():
			n += 1
		return f'{prefix}-{n}'
