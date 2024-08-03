import uuid
from django.db import models

class Projects(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=20, blank=False, null=False)
    column = models.PositiveIntegerField(default=0)
    name_column = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title