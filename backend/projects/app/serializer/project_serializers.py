from app.models import Projects, Columns
from rest_framework import serializers

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Columns
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True)

    class Meta:
        model = Projects
        fields = ['id', 'title', 'user_email', 'columns']

    def create(self, validated_data):
        columns_data = validated_data.pop('columns')
        project = Projects.objects.create(**validated_data)
        for column_data in columns_data:
            Columns.objects.create(project=project, **column_data)
        return project

    def update(self, instance, validated_data):
        columns_data = validated_data.pop('columns')
        instance.title = validated_data.get('title', instance.title)
        instance.user_email = validated_data.get('user_email', instance.user_email)
        instance.save()

        keep_columns = []
        for column_data in columns_data:
            if 'id' in column_data.keys():
                if Columns.objects.filter(id=column_data['id']).exists():
                    c = Columns.objects.get(id=column_data['id'])
                    c.name = column_data.get('name', c.name)
                    c.save()
                    keep_columns.append(c.id)
                else:
                    continue
            else:
                c = Columns.objects.create(project=instance, **column_data)
                keep_columns.append(c.id)

        for column in instance.columns.all():
            if column.id not in keep_columns:
                column.delete()

        return instance
