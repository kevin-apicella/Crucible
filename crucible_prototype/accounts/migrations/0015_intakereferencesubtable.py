# Generated by Django 5.0.6 on 2024-10-16 04:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_membertable_preset_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='IntakeReferenceSubTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('preset_id', models.CharField(max_length=10)),
                ('milestone_order', models.IntegerField()),
                ('milestone_name', models.CharField(max_length=50)),
                ('duration', models.IntegerField()),
            ],
        ),
    ]
