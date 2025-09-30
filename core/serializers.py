from rest_framework import serializers
from .models import Post, Profile, Comment
from django.contrib.auth.models import User

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption', 'created_at', 'no_of_likes']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'profile_img', 'bio', 'location']
        
class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)  # Explicitly mark as read-only

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'username', 'text', 'created_at']
        extra_kwargs = {
            'username': {'read_only': True},  # Reinforce read-only
        }

    def get_username(self, obj):
        return User.objects.get(id=obj.user_id).username

    def create(self, validated_data):
        # Ensure only model fields are used for creation, excluding username
        validated_data.pop('username', None)  # Remove username if present
        return super().create(validated_data)