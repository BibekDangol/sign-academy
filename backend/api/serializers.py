from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import PermissionDenied
from .models import (
    User, Post, AttendanceRecord, Leave, Course, Lesson, 
    Comment, UserLessonProgress, Dictionary, CourseAttendance
)
from .models import Lecturer
from rest_framework import viewsets




# User Serializer
class UserSerializer(serializers.ModelSerializer):
    login_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    last_login = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'last_login', 'login_time']

# Custom Token Obtain Pair Serializer
class MyTOPS(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        self.user = self.user  # Attach user to use later in view
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        return token


# Registration Serializer
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    full_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'username', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': "Password Fields Didn't Match"})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

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

# Change Password Serializer

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value, self.context['request'].user)
        return value


# Leave Serializer
class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'

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

    class Meta:
        model = Comment
        fields = ['id', 'user', 'course', 'lesson', 'text', 'created_at']

class UserLessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

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
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'video_url', 'content', 'created_at']


# Course Serializer
class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.user.username', read_only=True)

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
