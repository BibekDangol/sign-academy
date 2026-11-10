from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.utils import get_md5_hash_password
from rest_framework.exceptions import AuthenticationFailed
from .permissions import role_for, is_admin, owns_course
from rest_framework.exceptions import PermissionDenied
from .models import (
    User, Post, AttendanceRecord, Leave, Course, Lesson, 
    Comment, UserLessonProgress, Dictionary, CourseAttendance
)
from .models import Lecturer
from rest_framework import viewsets




# User Serializer
class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    def get_role(self, obj):
        return role_for(obj)

    login_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    last_login = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'date_joined', 'last_login', 'login_time']

# Custom Token Obtain Pair Serializer
class MyTOPS(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password'].trim_whitespace = False

    @transaction.atomic
    def validate(self, attrs):
        # Serialize login with password changes for the same account.
        User.objects.select_for_update().filter(email=attrs.get('email')).first()
        data = super().validate(attrs)
        request = self.context['request']
        previous = AttendanceRecord.objects.filter(user=self.user).order_by('-login_time').first()
        attendance = AttendanceRecord.objects.create(
            user=self.user,
            previous_login_time=previous.login_time if previous else None,
            ip_address=request.META.get('REMOTE_ADDR') or None,
            device_info=request.META.get('HTTP_USER_AGENT', '')[:255],
        )
        refresh = RefreshToken(data['refresh'])
        refresh['attendance_id'] = attendance.pk
        refresh['session_jti'] = refresh['jti']
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['role'] = role_for(user)
        return token


class RoleTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        access = AccessToken(data['access'])
        user = User.objects.filter(pk=access['user_id'], is_active=True).first()
        if user is None:
            raise AuthenticationFailed('Account is inactive or unavailable.')
        if access.get(api_settings.REVOKE_TOKEN_CLAIM) != get_md5_hash_password(user.password):
            raise AuthenticationFailed('The password has changed. Please log in again.')
        access['role'] = role_for(user)
        access['username'] = user.username
        access['email'] = user.email
        access['full_name'] = user.profile.full_name
        access['bio'] = user.profile.bio
        data['access'] = str(access)
        return data


# Registration Serializer
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, trim_whitespace=False)
    password2 = serializers.CharField(write_only=True, required=True, trim_whitespace=False)
    full_name = serializers.CharField(write_only=True, required=True, max_length=100)
    username = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'username', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password2': 'Passwords do not match.'})
        candidate = User(email=attrs['email'], username=attrs['username'])
        try:
            validate_password(attrs['password'], candidate)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)})
        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        if "full_name" in validated_data:
            user.profile.full_name = validated_data['full_name']
            user.profile.save()

        return user

class AttendanceRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', default='Unknown')
    duration = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = ['id', 'username', 'login_time', 'logout_time', 'duration', 'ip_address', 'device_info']

    def get_duration(self, obj):
        if obj.logout_time:
            duration = obj.logout_time - obj.login_time
            return str(duration)
        return "Active"
    
class AttendanceRecordViewSet(viewsets.ReadOnlyModelViewSet):  # Ensure it's not empty
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

# Post Serializer
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['user']

# Change Password Serializer

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, trim_whitespace=False)
    new_password = serializers.CharField(required=True, trim_whitespace=False)

    def validate_new_password(self, value):
        validate_password(value, self.context['request'].user)
        if self.context['request'].user.check_password(value):
            raise serializers.ValidationError('Choose a different password from your current password.')
        return value


class EditProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=False, max_length=150)
    full_name = serializers.CharField(source='profile.full_name', required=False, max_length=100)
    bio = serializers.CharField(source='profile.bio', required=False, allow_blank=True, max_length=1000)
    role = serializers.SerializerMethodField()

    def get_role(self, obj):
        return role_for(obj)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'bio', 'role']
        read_only_fields = ['id', 'role']

    @transaction.atomic
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        instance = super().update(instance, validated_data)
        for name, value in profile_data.items():
            setattr(instance.profile, name, value)
        if profile_data:
            instance.profile.save(update_fields=list(profile_data))
        return instance


# Leave Serializer
class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']

    def validate(self, attrs):
        if attrs['end_date'] < attrs['start_date']:
            raise serializers.ValidationError({'end_date': 'End date cannot be before start date.'})
        return attrs


class LeaveStatusSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=['APPROVED', 'REJECTED'])

    def validate(self, attrs):
        if 'status' not in attrs:
            raise serializers.ValidationError({'status': 'An approval or rejection is required.'})
        return attrs

    class Meta:
        model = Leave
        fields = ['status']

# Dictionary Serializer
class DictionarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Dictionary
        fields = '__all__'





class UserInlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']  # or include 'email' etc. as needed

# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    user = UserInlineSerializer(read_only=True)  # ✅ show username

    def validate(self, attrs):
        course = attrs.get('course', getattr(self.instance, 'course', None))
        lesson = attrs.get('lesson', getattr(self.instance, 'lesson', None))
        if lesson and course and lesson.course_id != course.pk:
            raise serializers.ValidationError({'lesson': 'This lesson does not belong to the course.'})
        if self.instance and (course.pk != self.instance.course_id or lesson.pk != self.instance.lesson_id):
            raise serializers.ValidationError('A comment cannot be moved to another course or lesson.')
        return attrs

    class Meta:
        model = Comment
        fields = ['id', 'user', 'course', 'lesson', 'text', 'created_at']

class UserLessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    def validate_lesson(self, value):
        if self.instance and value.pk != self.instance.lesson_id:
            raise serializers.ValidationError('A progress record cannot be moved to another lesson.')
        return value

    class Meta:
        model = UserLessonProgress
        fields = ['id', 'lesson', 'lesson_title', 'completed', 'viewed_at']
        read_only_fields = ['id', 'lesson_title', 'viewed_at']
        


 # Lecturer Serializer
class LecturerSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.profile.full_name', read_only=True)

    class Meta:
        model = Lecturer
        fields = [
            'id',
            'user',
            'user_email',
            'user_full_name',
            'department',
            'qualification',
            'bio',
            'profile_picture',
            'created_at',
        ]
        read_only_fields = ['created_at']


# Lesson Serializer
class LessonSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        course = attrs.get('course', getattr(self.instance, 'course', None))
        user = self.context['request'].user
        if not is_admin(user) and not owns_course(user, course):
            raise PermissionDenied('You can manage lessons only in your assigned courses.')
        return attrs

    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'video_url', 'content', 'created_at']


# Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.user.username', read_only=True)

    def validate(self, attrs):
        user = self.context['request'].user
        if not is_admin(user) and 'lecturer' in attrs and attrs['lecturer'] != user.lecturer:
            raise PermissionDenied('You cannot assign courses to another lecturer.')
        return attrs

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'video_url',
            'lecturer',
            'lecturer_name',
            'created_at',
            'lessons',
        ]
        read_only_fields = ['created_at']

 #for course attendence
class CourseAttendanceSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = CourseAttendance
        fields = ['id', 'course', 'course_title', 'timestamp']
