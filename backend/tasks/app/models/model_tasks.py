import uuid
from django.db import models


class Tasks(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, blank=False, null=False)
    column = models.PositiveBigIntegerField(blank=False, null=False, default=1)
    description = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    is_finihed = models.BooleanField(default=False)
    priority = models.CharField(max_length=20, default='no_priority')

    def __str__(self) -> str:
        return self.title