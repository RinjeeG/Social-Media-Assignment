from rest_framework.permissions import BasePermission
from rest_framework.request import Request

class IsAuthenticatedOrLogout(BasePermission):
    def has_permission(self, request: Request, view):
        # Check the view function name for logout
        if view.__class__.__name__ == 'api_logout':
            auth_header = request.headers.get('Authorization')
            return bool(auth_header and auth_header.startswith('Bearer '))
        # Require full authentication for other views
        return request.user and request.user.is_authenticated