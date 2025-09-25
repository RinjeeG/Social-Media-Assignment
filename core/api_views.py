from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer

class PostListView(ListAPIView):
    permission_classes = [IsAuthenticated] 
    queryset = Post.objects.all().select_related('user')
    serializer_class = PostSerializer
