from rest_framework.permissions import BasePermission, SAFE_METHODS


def role_for(user):
    if not user or not user.is_authenticated or not user.is_active:
        return None
    if user.is_superuser:
        return 'admin'
    if hasattr(user, 'lecturer'):
        return 'lecturer'
    return 'student'


def is_admin(user):
    return role_for(user) == 'admin'


def owns_course(user, course):
    return role_for(user) == 'lecturer' and course.lecturer_id == user.lecturer.pk


class IsAdministrator(BasePermission):
    def has_permission(self, request, view):
        return is_admin(request.user)


class AdminWritePublicRead(IsAdministrator):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or super().has_permission(request, view)


class CourseWritePublicRead(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or role_for(request.user) in ('admin', 'lecturer')

    def has_object_permission(self, request, view, obj):
        course = obj.course if hasattr(obj, 'course') else obj
        return request.method in SAFE_METHODS or is_admin(request.user) or owns_course(request.user, course)


class OwnerOrAdministrator(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in SAFE_METHODS or is_admin(request.user) or obj.user_id == request.user.pk
