import uuid
from app.models import Tasks
from rest_framework import serializers

class TasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = '__all__'

    def validate_title(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('O título não pode ter mais de 10 caracteres.')
        return value
    
    def validate_id(self, value):
        try:
            uuid.UUID(value)
        except ValueError:
            raise serializers.ValidationError('ID must be a valid UUID.')
        return value