from app.models import Projects

class ProjectServices:
    @staticmethod
    def create_project(data):
        project = Projects.objects.create(**data)
        return project
    
    @staticmethod
    def get_all_projects():
        return Projects.objects.all()
    
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

        except Projects.DoesNotExist:
            return False

        project.delete()
        
        return True