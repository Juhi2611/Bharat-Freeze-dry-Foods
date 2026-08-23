from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0003_orderitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='razorpay_payment_id',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
