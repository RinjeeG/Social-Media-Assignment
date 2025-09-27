from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .views import like_post

class PostListView(ListAPIView):
    permission_classes = [IsAuthenticated] 
    queryset = Post.objects.all().select_related('user')
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        print("Request auth:", request.auth)  # Debug
        print("Request headers:", request.headers)  # Debug
        return super().get(request, *args, **kwargs)
    
@api_view(['GET'])
@permission_classes(IsAuthenticated)
def api_like_post(request, post_id):
    # Call the original like_post with the request
    response = like_post(request)
    if response.status_code == 302:# Redirect in original, but API returns JSON
        return Response({"success": "Like toggled"},
                        status=status.HTTP_200_OK)
        return Response({"error": "Failed to like"},
                        status=status.HTTP_400_BAD_REQUEST)