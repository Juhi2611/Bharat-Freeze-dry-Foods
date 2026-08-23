import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0001_initial'),
        ('crm', '0002_customer_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name_snapshot', models.CharField(max_length=255)),
                ('unit_price_snapshot', models.DecimalField(decimal_places=2, max_digits=12)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('total_price', models.DecimalField(decimal_places=2, editable=False, max_digits=12)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='crm.order')),
                ('product', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='order_items', to='catalog.product')),
            ],
        ),
    ]