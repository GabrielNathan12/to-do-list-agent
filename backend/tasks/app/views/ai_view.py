import uuid
from app.utils import generate_response
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class AIView(APIView):
    permission_classes = []

    def post(self, request):
        title_task = request.data.get('title')
        description_task = request.data.get('description')

        if not title_task or not description_task:
            return Response({'error': 'Title and description for task is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        task = {
            'title': title_task,
            'description': description_task
        }

        response = generate_response(task)
    
        return Response(response, status=status.HTTP_200_OK)