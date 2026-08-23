import logging

from django.db import transaction

from apps.users.models import User

from .models import Customer

logger = logging.getLogger(__name__)


def _create_customer_for_user(user: User) -> Customer:
    return Customer.objects.create(
        user=user,
        full_name=user.full_name,
        company_name=user.company_name or '',
        email=user.email,
        phone='',
        country=user.country or '',
    )


@transaction.atomic
def ensure_customer_for_user(user: User) -> Customer:
    """
    Link a user to an existing unlinked CRM customer, or create a blank profile.

    Fail closed on email conflicts: if a matching Customer is already linked to a
    different user, never return that record — create a separate Customer for the
    caller so they cannot see or attach orders to the other user's CRM profile.
    """
    linked_customer = Customer.objects.filter(user=user).first()
    if linked_customer:
        return linked_customer

    matching_customers = Customer.objects.select_for_update().filter(email__iexact=user.email)

    unlinked = matching_customers.filter(user__isnull=True).first()
    if unlinked:
        unlinked.user = user
        unlinked.save(update_fields=['user'])
        return unlinked

    conflicted = matching_customers.exclude(user=user).first()
    if conflicted:
        logger.warning(
            "CRM customer email conflict; creating separate customer for user %s "
            "instead of reusing customer %s owned by user %s",
            user.pk,
            conflicted.pk,
            conflicted.user_id,
        )
        return _create_customer_for_user(user)

    return _create_customer_for_user(user)
