"""B13: business-code allocation uniqueness under concurrency / collision."""

import unittest
from concurrent.futures import ThreadPoolExecutor, as_completed

from django.db import connection, transaction
from django.test import TestCase, TransactionTestCase

from apps.crm.models import Order
from apps.enquiries.models import Enquiry
from config.business_codes import allocate_prefixed_code


class BusinessCodeAllocationTests(TestCase):
	def test_allocate_skips_existing_codes(self):
		Order.objects.create(
			order_code='ORD-8901',
			items_summary='seed',
			total_amount='1.00',
			currency='INR',
		)
		code = allocate_prefixed_code(
			model=Order,
			field='order_code',
			prefix='ORD',
			offset=8900,
		)
		self.assertEqual(code, 'ORD-8902')

	def test_serial_creates_are_unique(self):
		codes = [
			Order.objects.create(
				items_summary=f'item-{i}',
				total_amount='10.00',
				currency='INR',
			).order_code
			for i in range(10)
		]
		self.assertEqual(len(set(codes)), 10)


@unittest.skipIf(
	connection.vendor == 'sqlite',
	'SQLite serializes writers poorly; IntegrityError retries cover races in production DBs.',
)
class ConcurrentBusinessCodeTests(TransactionTestCase):
	def test_concurrent_order_codes_are_unique(self):
		def create_one(i):
			connection.close()
			order = Order.objects.create(
				items_summary=f'item-{i}',
				total_amount='10.00',
				currency='INR',
			)
			return order.order_code

		codes = []
		with ThreadPoolExecutor(max_workers=8) as pool:
			futures = [pool.submit(create_one, i) for i in range(16)]
			for fut in as_completed(futures):
				codes.append(fut.result())

		self.assertEqual(len(codes), 16)
		self.assertEqual(len(set(codes)), 16)

	def test_concurrent_enquiry_codes_are_unique(self):
		def create_one(i):
			connection.close()
			enq = Enquiry.objects.create(
				company_name=f'Co {i}',
				contact_person='P',
				email=f'e{i}@example.com',
				phone='1',
				country='IN',
				interested_products=['x'],
				quantity_requirement='1',
			)
			return enq.enquiry_code

		codes = []
		with ThreadPoolExecutor(max_workers=8) as pool:
			futures = [pool.submit(create_one, i) for i in range(16)]
			for fut in as_completed(futures):
				codes.append(fut.result())

		self.assertEqual(len(codes), 16)
		self.assertEqual(len(set(codes)), 16)
