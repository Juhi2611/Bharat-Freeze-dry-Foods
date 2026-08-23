from rest_framework import permissions


STAFF_ROLES = ('super_admin', 'export_manager', 'content_editor')
CRM_ROLES = ('super_admin',)
CONTENT_ROLES = ('super_admin', 'export_manager', 'content_editor')


class IsAdminRole(permissions.BasePermission):
	"""
	Any staff role (legacy name). Prefer IsContentStaff / IsCrmStaff for new code.

	Includes content_editor — do NOT use on orders/customers/payments.
	"""

	def has_permission(self, request, view):
		return bool(
			request.user
			and request.user.is_authenticated
			and request.user.role in STAFF_ROLES
		)


class IsContentStaff(permissions.BasePermission):
	"""CMS, catalog writes, media — staff including content_editor."""

	def has_permission(self, request, view):
		return bool(
			request.user
			and request.user.is_authenticated
			and request.user.role in CONTENT_ROLES
		)


class IsCrmStaff(permissions.BasePermission):
	"""
	Orders, customers, enquiry admin — super_admin only (CRM follow-up).
	"""

	def has_permission(self, request, view):
		return bool(
			request.user
			and request.user.is_authenticated
			and request.user.role in CRM_ROLES
		)


class IsSuperAdmin(permissions.BasePermission):
	"""Super admin only (user management, etc.)."""

	def has_permission(self, request, view):
		return bool(
			request.user
			and request.user.is_authenticated
			and request.user.role == 'super_admin'
		)
