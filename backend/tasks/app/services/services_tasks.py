from app.models import Tasks

class TasksServices:
    @staticmethod
    def create_task(data):
        task = Tasks.objects.create(**data)
        return task
    
    @staticmethod
    def get_all_tasks():
        return Tasks.objects.all()
    
    @staticmethod
    def update_task(data, task_id):
        try:
            task = Tasks.objects.get(pk=task_id)
        except Tasks.DoesNotExist:
            return None
        
        for attr, value in data.items():
            setattr(task, attr, value)

        task.save()

        return task

    @staticmethod
    def delete_task(task_id):
        try:
            task = Tasks.objects.get(pk=task_id)
        except Tasks.DoesNotExist:
            return None
        
        task.delete()

        return True