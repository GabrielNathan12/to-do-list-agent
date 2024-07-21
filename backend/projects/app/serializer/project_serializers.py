import uuid
from app.models import Projects
from rest_framework import serializers

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Projects
        fields = '__all__'

    def validate_title(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('O título não pode ter mais de 10 caracteres.')
        return value
    
    def validate_name_column(self, value):
        if len(value) > 30:
            raise serializers.ValidationError('O nome da coluna não pode ter mais de 10 caracteres.')
        return value
    
    def validate_id(self, value):
        try:
            uuid.UUID(value)
        except ValueError:
            raise serializers.ValidationError('ID must be a valid UUID.')
        return value
    