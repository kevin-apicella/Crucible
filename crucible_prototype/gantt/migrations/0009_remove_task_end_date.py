# Generated by Django 5.0.6 on 2024-07-31 02:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("gantt", "0008_alter_task_end_date_alter_task_start_date"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="task",
            name="end_date",
        ),
    ]
