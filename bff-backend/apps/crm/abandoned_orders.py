"""Release stock held by abandoned unpaid checkouts."""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Iterable

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.catalog.models import Product

from .models import Order

logger = logging.getLogger(__name__)

# Statuses that still hold reserved stock and have not completed payment.
RELEASABLE_PAYMENT_STATUSES = frozenset(
    {
        Order.PaymentStatus.AWAITING_QUOTE,
        Order.PaymentStatus.QUOTED,
        Order.PaymentStatus.PENDING,
    }
)


def abandoned_order_timeout_minutes(override: int | None = None) -> int:
    if override is not None:
        return max(0, int(override))
    return max(0, int(getattr(settings, 'ABANDONED_ORDER_TIMEOUT_MINUTES', 45)))


@transaction.atomic
def release_single_abandoned_order(order_id) -> bool:
    """
    Restore reserved stock for one abandoned order under row locks.

    Returns True if stock was restored and the order was marked cancelled.
    Returns False if the order was skipped (paid concurrently, wrong status, etc.).
    """
    order = (
        Order.objects.select_for_update()
        .filter(pk=order_id)
        .first()
    )
    if order is None:
        return False

    # Recheck under lock — payment may have completed after the candidate scan.
    if order.payment_status not in RELEASABLE_PAYMENT_STATUSES:
        logger.info(
            'Skipping order %s for stock release; payment_status=%s',
            order.order_code,
            order.payment_status,
        )
        return False

    if order.fulfillment_status != Order.FulfillmentStatus.PENDING:
        logger.info(
            'Skipping order %s for stock release; fulfillment_status=%s',
            order.order_code,
            order.fulfillment_status,
        )
        return False

    items = list(order.items.select_related('product'))
    product_ids = [item.product_id for item in items if item.product_id]
    products = {
        product.pk: product
        for product in Product.objects.select_for_update().filter(pk__in=product_ids)
    }

    for item in items:
        if not item.product_id:
            continue
        product = products.get(item.product_id)
        if product is None:
            continue
        product.stock_quantity += item.quantity
        product.save(update_fields=['stock_quantity', 'updated_at'])

    order.payment_status = Order.PaymentStatus.CANCELLED
    order.save(update_fields=['payment_status'])
    logger.info(
        'Released abandoned order %s and restored stock for %s line(s)',
        order.order_code,
        len(items),
    )
    return True


def iter_abandoned_order_ids(*, older_than_minutes: int | None = None) -> Iterable:
    minutes = abandoned_order_timeout_minutes(older_than_minutes)
    cutoff = timezone.now() - timedelta(minutes=minutes)
    return (
        Order.objects.filter(
            payment_status__in=RELEASABLE_PAYMENT_STATUSES,
            fulfillment_status=Order.FulfillmentStatus.PENDING,
            created_at__lte=cutoff,
        )
        .order_by('created_at')
        .values_list('id', flat=True)
        .iterator()
    )


def release_abandoned_orders(*, older_than_minutes: int | None = None) -> dict:
    """
    Find unpaid orders past the TTL and restore their reserved stock.

    Each order is processed in its own atomic block with select_for_update so a
    concurrent payment verify/webhook that marks the order Paid cannot lose stock.
    """
    released = 0
    skipped = 0
    candidates = 0

    for order_id in iter_abandoned_order_ids(older_than_minutes=older_than_minutes):
        candidates += 1
        if release_single_abandoned_order(order_id):
            released += 1
        else:
            skipped += 1

    return {
        'candidates': candidates,
        'released': released,
        'skipped': skipped,
        'timeout_minutes': abandoned_order_timeout_minutes(older_than_minutes),
    }
