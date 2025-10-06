from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Post, Comment, Profile
from .serializers import PostSerializer, CommentSerializer, ProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .views import like_post
from django.http import HttpResponseRedirect
from .permissions import IsAuthenticatedOrLogout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout as django_logout
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)

class PostListView(ListAPIView):
    permission_classes = [IsAuthenticated] 
    queryset = Post.objects.all().select_related('user').order_by('-created_at')  # Added ordering
    serializer_class = PostSerializer

    def list(self, request, *args, **kwargs):
        logger.info(f"Fetching posts for user: {request.user.username}")  # Added log
        return super().list(request, *args, **kwargs)

@api_view(['POST'])
@permission_classes([])
def signup(request):
    logger.info(f"Received signup request data: {request.data}")
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        logger.error("Missing username or password")
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        logger.error(f"Username {username} already taken")
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        logger.info(f"Created user {username} with refresh token")
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
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


@api_view(['POST'])
@permission_classes([IsAuthenticatedOrLogout])
def api_logout(request):
    try:
        # No need to blacklist access token; frontend clears it
        django_logout(request)  # Clear session-based auth (optional)
        return Response({"success": "Logged out"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def comment_list_create(request, post_id):
    try:
        logger.info(f"Processing request for post_id: {post_id}")
        if not Post.objects.filter(id=post_id).exists():
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            comments = Comment.objects.filter(post_id=post_id)
            if not comments.exists():
                return Response({"message": "No comments yet"}, status=status.HTTP_200_OK)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            logger.info(f"Received POST data: {request.data}")
            data = request.data.copy()
            data['post'] = post_id
            data['user'] = request.user.id
            serializer = CommentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Comment saved for post_id: {post_id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Exception in comment_list_create: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_post(request):
    try:
        logger.info(f"Received POST data for new post: {request.data}")
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Post saved for user: {request.user.username}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Exception in api_create_post: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_detail(request):
    try:
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def profile_update(request):
    try:
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Profile updated for user: {request.user.username}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)