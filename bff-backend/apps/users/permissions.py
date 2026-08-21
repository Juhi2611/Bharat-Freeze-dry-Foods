from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Permission check for Admin roles (super_admin, export_manager, content_editor).
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['super_admin', 'export_manager', 'content_editor']
        )

class IsSuperAdmin(permissions.BasePermission):
    """
    Stricter permission check for super_admin users only.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'super_admin'
        )
