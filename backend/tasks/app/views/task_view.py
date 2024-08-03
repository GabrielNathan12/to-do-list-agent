import uuid
from app.services import TasksServices
from app.serializers import TasksSerializer
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class TaskView(APIView):
    permission_classes = []

    def get(self, _):
        tasks = TasksServices.get_all_tasks()
        serializer = TasksSerializer(tasks, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = TasksSerializer(data=request.data)

        if serializer.is_valid():
            TasksServices.create_task(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        task_id = request.data.get('id')

        if not task_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uuid.UUID(task_id)
        except ValueError:
            return Response({"detail": "Invalid UUID."}, status=status.HTTP_400_BAD_REQUEST)


        serializer = TasksSerializer(data=request.data)
        
        if serializer.is_valid():
            update_task = TasksServices.update_task(data=request.data, task_id=task_id)

            if update_task:
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response({'error': 'tasks not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        task_id = request.data.get('id')

        if not task_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        response = TasksServices.delete_task(task_id)

        if response:
            return Response({'sucess': 'task is deleted'}, status=status.HTTP_200_OK)

        return Response({'error': 'task not found'}, status=status.HTTP_404_NOT_FOUND)