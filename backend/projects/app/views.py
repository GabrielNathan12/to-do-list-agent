from app.models import Projects
from app.services import ProjectServices
from app.serializer import ProjectSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class ProjectView(APIView):
    permission_classes = []
    
    def get(self, request, *args, **kwargs):
        project_id = kwargs.get('id')
        
        if project_id:
            try:
                project = ProjectServices.get_project_by_id(project_id)
                serializer = ProjectSerializer(project)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Projects.DoesNotExist:
                return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        
        projects = ProjectServices.get_all_projects()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        project_id = request.data.get('id')
        
        if not project_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = ProjectServices.get_project_by_id(project_id)
        except Projects.DoesNotExist:
            return Response({'error': 'project not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        project_id = request.data.get('id')

        if not project_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        response = ProjectServices.delete_project(project_id)

        if response:
            return Response({'success': 'project is deleted'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'project not found'}, status=status.HTTP_404_NOT_FOUND)
