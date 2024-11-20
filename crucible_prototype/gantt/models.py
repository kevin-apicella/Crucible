from django.db import models
from accounts.models import CustomUser


class Journey(models.Model):
    title = models.CharField(max_length=255)
    startDate = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    owners = models.ManyToManyField(CustomUser, related_name='journeys')
    tasks = models.ManyToManyField('Task', related_name='journeys')
    assignments = models.ManyToManyField('Assignment', related_name='journeys')
    dependencies = models.ManyToManyField('Dependency', related_name='journeys')
    def __str__(self):
        return self.title

class Task(models.Model):
    name = models.CharField(max_length=255)
    unique_id = models.CharField(max_length=255, unique=True)
    duration = models.IntegerField(default=0)
    expanded = models.BooleanField(default=True)
    percentDone = models.FloatField(default=0)
    startDate = models.CharField(max_length=100)
    endDate = models.CharField(max_length=100)
    constraintType = models.CharField(max_length=100)
    status = models.CharField(max_length=100, default='Todo')
    eventColor = models.CharField(max_length=100, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='from_tasks', null=True)
    def __str__(self):
        return self.name

    class Meta:
        ordering = ['unique_id']

class Resource(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='from_resources', null=True)
    def __str__(self):
        return f"{self.name} ({self.role})"

class Assignment(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='assignments')
    event = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments', to_field='unique_id')
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='from_assignments', null=True)
    def __str__(self):
        return f"{self.resource.name} assigned to {self.event.name}"


class Dependency(models.Model):
    from_event = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='dependencies_starting_here', to_field='unique_id')
    to_event = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='dependencies_ending_here', to_field='unique_id')
    lag = models.IntegerField(default=0)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name='from_dependencies', null=True)
    def __str__(self):
        return f"Dependency from {self.from_event.name} to {self.to_event.name}"
