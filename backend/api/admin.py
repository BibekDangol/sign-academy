from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission

from api.models import Profile, AttendanceRecord
from .models import Course, CourseAttendance, Lesson, Lecturer, Comment, UserLessonProgress, Dictionary

User = get_user_model()

# Unregister default Django models (safe check)
if admin.site.is_registered(User):
    admin.site.unregister(User)

if admin.site.is_registered(Group):
    admin.site.unregister(Group)

# Custom User Admin
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff'),
        }),
    )
    list_display = ('email', 'is_staff', 'is_superuser')
    search_fields = ('email',)
    ordering = ('email',)

# Lecturer Admin
@admin.register(Lecturer)
class LecturerAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'department', 'qualification', 'get_is_active', 'get_is_staff')
    search_fields = ('user__email', 'department')
    list_filter = ('department', 'user__is_active', 'user__is_staff')
    actions = ['activate_lecturers', 'deactivate_lecturers', 'assign_permissions']

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'

    def get_is_active(self, obj):
        return obj.user.is_active
    get_is_active.boolean = True
    get_is_active.short_description = 'Active'

    def get_is_staff(self, obj):
        return obj.user.is_staff
    get_is_staff.boolean = True
    get_is_staff.short_description = 'Staff'

    def activate_lecturers(self, request, queryset):
        updated = queryset.update(user__is_active=True)
        self.message_user(request, f'{updated} lecturer(s) activated')
    activate_lecturers.short_description = "Activate selected lecturers"

    def deactivate_lecturers(self, request, queryset):
        updated = queryset.update(user__is_active=False)
        self.message_user(request, f'{updated} lecturer(s) deactivated')
    deactivate_lecturers.short_description = "Deactivate selected lecturers"

    def assign_permissions(self, request, queryset):
        permissions = Permission.objects.filter(codename__in=[
            'view_course', 'add_course', 'change_course',
            'view_lesson', 'add_lesson', 'change_lesson',
            'view_test', 'add_test', 'change_test',
            'view_question', 'add_question', 'change_question',
            'view_comment', 'add_comment', 'change_comment',
            'view_attendancerecord', 'add_attendancerecord', 'change_attendancerecord',
        ])
        for lecturer in queryset:
            lecturer.user.user_permissions.add(*permissions)
        self.message_user(request, "Permissions successfully assigned.")
    assign_permissions.short_description = "Assign additional permissions"

    fieldsets = (
        (None, {'fields': ('user', 'department', 'qualification', 'bio', 'profile_picture')}),
    )

    def save_model(self, request, obj, form, change):
        if obj.user:
            obj.user.is_staff = True
            obj.user.save()
            permissions = Permission.objects.filter(codename__in=[
                'view_course', 'add_course', 'change_course',
                'view_lesson', 'add_lesson', 'change_lesson',
                'view_test', 'add_test', 'change_test',
                'view_question', 'add_question', 'change_question',
                'view_comment', 'add_comment', 'change_comment',
                'view_attendancerecord', 'add_attendancerecord', 'change_attendancerecord',
            ])
            obj.user.user_permissions.set(permissions)
        super().save_model(request, obj, form, change)

# Profile Admin
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'verified']
    list_editable = ['verified']
    search_fields = ['full_name', 'user__email']
    list_filter = ['verified']

# AttendanceRecord Admin
@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'login_time', 'logout_time', 'duration_display', 'ip_address', 'device_info']
    search_fields = ['user__email', 'ip_address', 'device_info']
    list_filter = ['login_time', 'logout_time']

    def duration_display(self, obj):
        if obj.logout_time:
            delta = obj.logout_time - obj.login_time
            hours, remainder = divmod(delta.total_seconds(), 3600)
            minutes, _ = divmod(remainder, 60)
            return f"{int(hours)}h {int(minutes)}m"
        return "Active"

    duration_display.short_description = "Session Duration"

# Course Admin
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'lecturer', 'created_at']
    search_fields = ['title', 'lecturer__user__email']
    list_filter = ['lecturer', 'created_at']

# Lesson Admin
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'created_at']
    search_fields = ['title', 'course__title']
    list_filter = ['course', 'created_at']



# Comment Admin
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'created_at']
    search_fields = ['user__email', 'course__title']
    list_filter = ['course', 'created_at']


# Dictionary Admin
@admin.register(Dictionary)
class DictionaryAdmin(admin.ModelAdmin):
    list_display = ['word', 'description', 'difficulty_rating']
    list_filter = ['difficulty_rating']
    list_editable = ['difficulty_rating']


# UserLessonProgress Admin
@admin.register(UserLessonProgress)
class UserLessonProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'completed']
    list_filter = ['completed', 'lesson']
    search_fields = ['user__email', 'lesson__title']

# CourseAttendance Admin
@admin.register(CourseAttendance)
class CourseAttendanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'timestamp']
    search_fields = ['user__email', 'course__title']
    list_filter = ['course', 'timestamp']
