# Generated by Django 5.0.6 on 2024-08-10 03:20

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gantt", "0021_assignment_journey_dependency_journey_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name="journey",
            name="owners",
            field=models.ManyToManyField(
                related_name="journeys", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
