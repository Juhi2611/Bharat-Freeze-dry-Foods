"""Category CRUD API tests."""

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.catalog.models import Category, Product
from apps.users.models import User


class CategoryAPITests(APITestCase):
    def setUp(self):
        self.content_editor = User.objects.create_user(
            email='editor@example.com',
            password='Pass123!',
            full_name='Content Editor',
            role=User.Role.CONTENT_EDITOR,
            is_staff=True,
        )
        self.category = Category.objects.create(
            name='Freeze-Dried Fruits',
            slug='freeze-dried-fruits',
            description='Tropical fruits line',
            cover_image='https://cdn.example.com/fruits.jpg',
            availability=Category.Availability.AVAILABLE,
            display_order=1,
        )
        self.empty_category = Category.objects.create(
            name='Empty Line',
            slug='empty-line',
            description='No SKUs yet',
            availability=Category.Availability.AVAILABLE,
            display_order=2,
        )
        self.product = Product.objects.create(
            sku='SKU-CAT-001',
            name='Mango Slices',
            slug='mango-slices',
            category=self.category,
            pack_image='https://cdn.example.com/pack.jpg',
            ingredient_image='https://cdn.example.com/ing.jpg',
            price_inr=499,
            blurb='Sweet mango',
            stock_quantity=10,
        )

    def _auth(self, user):
        token = RefreshToken.for_user(user).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_public_list_includes_live_product_count(self):
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if isinstance(response.data, dict) else response.data
        by_slug = {item['slug']: item for item in results}
        self.assertEqual(by_slug['freeze-dried-fruits']['product_count'], 1)
        self.assertEqual(by_slug['empty-line']['product_count'], 0)

    def test_create_category_via_api(self):
        self._auth(self.content_editor)
        response = self.client.post('/api/v1/categories/', {
            'name': 'Pet Treats',
            'description': 'Human-grade pet ingredients',
            'cover_image': 'https://cdn.example.com/pet.jpg',
            'availability': 'available',
            'display_order': 3,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Pet Treats')
        self.assertEqual(response.data['slug'], 'pet-treats')
        self.assertEqual(response.data['product_count'], 0)

        list_response = self.client.get('/api/v1/categories/')
        results = list_response.data['results'] if isinstance(list_response.data, dict) else list_response.data
        self.assertTrue(any(item['slug'] == 'pet-treats' for item in results))

    def test_update_category(self):
        self._auth(self.content_editor)
        response = self.client.patch(
            f'/api/v1/categories/{self.category.id}/',
            {
                'name': 'Premium Fruits',
                'description': 'Updated description',
                'cover_image': 'https://cdn.example.com/new-cover.jpg',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.category.refresh_from_db()
        self.assertEqual(self.category.name, 'Premium Fruits')
        self.assertEqual(self.category.description, 'Updated description')
        self.assertEqual(self.category.cover_image, 'https://cdn.example.com/new-cover.jpg')
        # Slug stays stable after creation.
        self.assertEqual(self.category.slug, 'freeze-dried-fruits')

    def test_delete_empty_category_succeeds(self):
        self._auth(self.content_editor)
        response = self.client.delete(f'/api/v1/categories/{self.empty_category.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.filter(id=self.empty_category.id).exists())

    def test_delete_category_with_products_is_blocked(self):
        self._auth(self.content_editor)
        response = self.client.delete(f'/api/v1/categories/{self.category.id}/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('1 product(s)', response.data['detail'])
        self.assertTrue(Category.objects.filter(id=self.category.id).exists())
        self.assertEqual(self.product.category_id, self.category.id)

    def test_product_count_updates_on_recategorization(self):
        self._auth(self.content_editor)
        self.product.category = self.empty_category
        self.product.save(update_fields=['category'])

        response = self.client.get('/api/v1/categories/')
        results = response.data['results'] if isinstance(response.data, dict) else response.data
        by_slug = {item['slug']: item for item in results}
        self.assertEqual(by_slug['freeze-dried-fruits']['product_count'], 0)
        self.assertEqual(by_slug['empty-line']['product_count'], 1)

    def test_unauthenticated_cannot_mutate_categories(self):
        response = self.client.post('/api/v1/categories/', {'name': 'Blocked'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
