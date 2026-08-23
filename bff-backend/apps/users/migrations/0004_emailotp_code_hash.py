import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_email_otp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='emailotp',
            name='code',
        ),
        migrations.AddField(
            model_name='emailotp',
            name='code_hash',
            field=models.CharField(
                default='',
                help_text='SHA-256 hex digest of peppered OTP; raw codes are never stored.',
                max_length=64,
            ),
            preserve_default=False,
        ),
    ]
