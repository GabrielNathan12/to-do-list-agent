from app.models import Projects, Columns

class ProjectServices:
    @staticmethod
    def create_project(data):
        columns_data = data.pop('columns')
        project = Projects.objects.create(**data)
        for column_data in columns_data:
            Columns.objects.create(project=project, **column_data)
        return project
    
    @staticmethod
    def get_all_projects():
        return Projects.objects.all()
    
    @staticmethod
    def get_project_by_id(project_id):
        return Projects.objects.get(pk=project_id)
    
    @staticmethod
    def update_project(data, project_id):
        try:
            project = Projects.objects.get(pk=project_id)
        except Projects.DoesNotExist:
            return None

        for attr, value in data.items():
            setattr(project, attr, value)

        project.save()
        
        return project
    
    @staticmethod
    def delete_project(id):
        try:
            project = Projects.objects.get(pk=id)
            project.delete()
        except Projects.DoesNotExist:
            return False

        return True