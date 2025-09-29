"""
URL configuration for Myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core import views, api_views
from django.conf import settings
from django.conf.urls.static import static
from core.api_views import PostListView, api_like_post
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.index, name='index'),
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin'),
    path('logout', views.logout, name='logout'),
    path('settings', views.settings, name='settings'),
    path('upload', views.upload, name='upload'),
    path('like-post', views.like_post, name='like-post'),
    path('profile/<str:pk>', views.profile, name='profile'),
    path('follow', views.follow, name='follow'),
    path('api/posts/', api_views.PostListView.as_view(), name='post-list'),
    path('api-token-auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api-token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/like/', api_views.api_like_post, name='api-like-post'),
    path('api/logout/', api_views.api_logout, name='api-logout')
]
urlpatterns = urlpatterns+static(settings.MEDIA_URL,
document_root=settings.MEDIA_ROOT)