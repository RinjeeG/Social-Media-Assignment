from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .views import like_post
from django.http import HttpResponseRedirect
from .permissions import IsAuthenticatedOrLogout
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout as django_logout
import logging

class PostListView(ListAPIView):
    permission_classes = [IsAuthenticated] 
    queryset = Post.objects.all().select_related('user')
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        print("Request auth:", request.auth)  # Debug
        print("Request headers:", request.headers)  # Debug
        return super().get(request, *args, **kwargs)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_like_post(request):
    post_id = request.GET.get('post_id')
    if not post_id:
        return Response({"error": "Post ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Simulate the original request context
    request.GET = request.GET.copy()
    request.GET['post_id'] = post_id
    response = like_post(request)

    if isinstance(response, HttpResponseRedirect):
        # Fetch the updated post to return JSON
        post = Post.objects.get(id=post_id)
        return Response({"success": "Like toggled", "no_of_likes": post.no_of_likes}, status=status.HTTP_200_OK)
    return Response({"error": "Failed to like"}, status=status.HTTP_400_BAD_REQUEST)

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticatedOrLogout])
def api_logout(request):
    try:
        # No need to blacklist access token; frontend clears it
        django_logout(request)  # Clear session-based auth (optional)
        return Response({"success": "Logged out"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST)