import uuid
from django.db import models

class Projects(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=20, blank=False, null=False)
    user_email = models.EmailField(blank=False, null=False)

    def __str__(self):
        return self.title
    
class Columns(models.Model):
    project = models.ForeignKey(Projects, related_name='columns', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=False, blank=False)

    def __str__(self):
        return self.name
