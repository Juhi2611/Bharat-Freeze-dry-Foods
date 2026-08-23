from django.core.management.base import BaseCommand

from apps.crm.abandoned_orders import release_abandoned_orders


class Command(BaseCommand):
    help = (
        'Restore catalog stock for unpaid/abandoned checkout orders past the '
        'configured TTL and mark those orders as cancelled.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--minutes',
            type=int,
            default=None,
            help=(
                'Override ABANDONED_ORDER_TIMEOUT_MINUTES. Orders created at least '
                'this many minutes ago are eligible.'
            ),
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='List candidate order IDs without restoring stock or cancelling.',
        )

    def handle(self, *args, **options):
        minutes = options['minutes']
        if options['dry_run']:
            from apps.crm.abandoned_orders import (
                abandoned_order_timeout_minutes,
                iter_abandoned_order_ids,
            )

            timeout = abandoned_order_timeout_minutes(minutes)
            ids = list(iter_abandoned_order_ids(older_than_minutes=minutes))
            self.stdout.write(
                self.style.WARNING(
                    f'Dry run: {len(ids)} candidate order(s) older than {timeout} minute(s).'
                )
            )
            for order_id in ids:
                self.stdout.write(str(order_id))
            return

        result = release_abandoned_orders(older_than_minutes=minutes)
        self.stdout.write(
            self.style.SUCCESS(
                'Abandoned order cleanup complete: '
                f"timeout={result['timeout_minutes']}m "
                f"candidates={result['candidates']} "
                f"released={result['released']} "
                f"skipped={result['skipped']}"
            )
        )
