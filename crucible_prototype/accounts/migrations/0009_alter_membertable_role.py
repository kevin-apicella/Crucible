# Generated by Django 5.0.6 on 2024-07-20 01:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_alter_customuser_first_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='membertable',
            name='role',
            field=models.CharField(choices=[('Intended Parent', 'Intended Parent'), ('Egg Donor', 'Egg Donor'), ('Surrogate', 'Surrogate'), ('Other', 'Other'), ('Undefined', 'Undefined')], default='Undefined', max_length=50),
        ),
    ]
