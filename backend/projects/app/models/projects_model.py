import uuid
from django.db import models

class Projects(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, blank=False, null=False)
    column = models.PositiveIntegerField(blank=False, null=False, default=0)
    name_column = models.CharField(max_length=255, blank=False, null=False)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return self.title