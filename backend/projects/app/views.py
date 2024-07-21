import uuid
from app.services import ProjectServices
from app.serializer.project_serializers import ProjectSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class ProjectView(APIView):
    permission_classes = []
    
    def get(self, _):
        
        projects = ProjectServices.get_all_projects()
        serializer = ProjectSerializer(projects, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            ProjectServices.create_project(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        project_id = request.data.get('id')
        
        if not project_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uuid.UUID(project_id)
        except ValueError:
            return Response({"detail": "Invalid UUID."}, status=status.HTTP_400_BAD_REQUEST)


        serializer = ProjectSerializer(data=request.data, partial=True)

        if serializer.is_valid():
            update_project = ProjectServices.update_project(serializer.data, project_id)

            if update_project:
                return Response(serializer.data, status=status.HTTP_200_OK)
    
            return Response({'error': 'project not found'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        project_id = request.data.get('id')

        if not project_id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        response = ProjectServices.delete_project(project_id)

        if response:
            return Response({'sucess': 'project is deleted'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'project not found'}, status=status.HTTP_404_NOT_FOUND)
        