# Generated by Django 5.2 on 2025-05-18 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_assignments_total_marks_assignments_users_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignments',
            name='descriptionUrl',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='assignments',
            name='dueDate',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='assignments',
            name='instructions',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
