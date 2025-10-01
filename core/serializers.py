from rest_framework import serializers
from .models import Post, Profile, Comment
from django.contrib.auth.models import User

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption', 'created_at', 'no_of_likes']
        extra_kwargs = {
            'user': {'read_only': True},  # Explicitly read-only
        }

    def create(self, validated_data):
        # Ensure user is set from request context
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def to_representation(self, instance):
        # Ensure user is included in output (if needed as ID or username)
        ret = super().to_representation(instance)
        ret['user'] = instance.user.id  # Or instance.user.username if preferred
        return ret

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