# views.py

from datetime import timezone
from tokenize import Token
from django.contrib.auth import authenticate
from django.db import connection
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.timezone import now

from rest_framework import generics, status, permissions, viewsets, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from django_filters.rest_framework import DjangoFilterBackend

# Models
from .models import (
    User, AttendanceRecord, Leave, Post, Profile, UserLessonProgress,
    CourseAttendance, Dictionary, Course, Lesson, Comment, 
)

# Serializers
from .serializers import (
    MyTOPS, RegistrationSerializer, ChangePasswordSerializer, UserLessonProgressSerializer,
    UserSerializer, AttendanceRecordSerializer, LeaveSerializer, PostSerializer, CommentSerializer, DictionarySerializer, CourseSerializer,
    LessonSerializer, CourseAttendanceSerializer
)




def index(request):
    return render(request, 'index.html')

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTOPS

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Get user from validated data (custom serializer assigns self.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        # Log attendance record
        last_attendance = AttendanceRecord.objects.filter(user=user).order_by('-login_time').first()

        AttendanceRecord.objects.create(
            user=user,
            previous_login_time=last_attendance.login_time if last_attendance else None,
            login_time=now(),
            ip_address=request.META.get('REMOTE_ADDR', ''),
            device_info=request.META.get('HTTP_USER_AGENT', '')
        )

        return response
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny)
    serializer_class = RegistrationSerializer
    permission_classes = (permissions.AllowAny,)  # Ensure AllowAny permission for registration

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protectedView(request):
    output = f"{request.user}, Authentication Successful!"
    return Response({'response':output}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request):
    user = request.user
    dashboard_data = {
        "username": user.username,
    }
    return Response(dashboard_data)


@api_view(['GET'])
def view_all_routes(request):
    data = [
        'api/token/refresh/',
        'api/register/',
        'api/token/',
        'api/dashboard/',
        'api/change-password',
        'api/edit-profile',
        'api/attendance-records/',
        'api/user/<int:pk>/attendance/'
        'api/admin',
        'posts/',
        'api/upload-profile-icon/',
        'api/apply-leave',
        'api/leave',
        'api/leave/<int:pk>/action/'
        
    ]
    return Response(data)
class PostView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')
        if user_id is None:
            return Response({'error': 'user_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        posts = Post.objects.filter(user_id=user_id)
        serializer = PostSerializer(posts, many=True)
        # Iterate through each post and update the image field to contain the URL of the image
        for post in serializer.data:
            post['image'] = request.build_absolute_uri(post['image'])
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        posts_serializer = PostSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            # After saving, update the image field to contain the URL of the image
            posts_serializer.data['image'] = request.build_absolute_uri(posts_serializer.data['image'])
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data.get('old_password')
            new_password = serializer.validated_data.get('new_password')

            if not user.check_password(old_password):
                return Response({'detail': 'Invalid old password.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        else:
            # ✅ Add this line to see errors in console
            print("Serializer errors:", serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditProfileView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AttendanceRecordListView(generics.ListAPIView):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'login_time': ['date', 'gte', 'lte'],
        'logout_time': ['date', 'gte', 'lte'],
        'user__id': ['exact'],
    }
    search_fields = ['user__username', 'user__email', 'ip_address']
    ordering_fields = ['login_time', 'logout_time', 'user__username']
    ordering = ['-login_time']

    def get_queryset(self):
        user = self.request.user
        queryset = AttendanceRecord.objects.select_related('user').all()
        if not user.is_staff:
            queryset = queryset.filter(user=user)
        return queryset



class UserAttendanceView(generics.ListAPIView):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = int(self.kwargs['user_id'])  # 🔄 Ensure it's an int
        if self.request.user.is_staff or self.request.user.id == user_id:
            return AttendanceRecord.objects.filter(user_id=user_id)\
                                           .select_related('user')\
                                           .order_by('-login_time')
        raise PermissionDenied("You don't have permission to view these records")

class LogoutView(generics.UpdateAPIView):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(
            logout_time=timezone.now(),
            device_info=self.request.META.get('HTTP_USER_AGENT', ''),
            ip_address=self.request.META.get('REMOTE_ADDR')
        )

class UserLessonProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserLessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return UserLessonProgress.objects.select_related('lesson', 'user')
        return UserLessonProgress.objects.filter(user=user).select_related('lesson')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Prevent duplicate progress records per user and lesson.
        If a record already exists for the user and lesson, return it.
        """
        user = request.user
        lesson_id = request.data.get("lesson")

        # Look for existing progress
        existing = UserLessonProgress.objects.filter(user=user, lesson_id=lesson_id).first()
        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # No existing record – create one
        return super().create(request, *args, **kwargs)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff


class LeaveApplicationView(generics.CreateAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LeaveListView(generics.ListAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Leave.objects.all()
        else:
            return Leave.objects.filter(user=self.request.user)


class LeaveActionView(generics.UpdateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, *args, **kwargs):
        leave = self.get_object()
        status = request.data.get('status')
        if status not in ['APPROVED', 'REJECTED']:
            return Response({'detail': 'Invalid status provided'}, status=status.HTTP_400_BAD_REQUEST)
        leave.status = status
        leave.save()
        return Response({'detail': f'Leave status updated to {status}'})



class DictionaryView(generics.ListCreateAPIView):
    queryset = Dictionary.objects.all()
    serializer_class = DictionarySerializer
    permission_classes = [permissions.AllowAny]  # Anyone can view dictionary, but admin can add new signs

class DictionaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Dictionary.objects.all()
    serializer_class = DictionarySerializer
    permission_classes = [permissions.IsAdminUser]  # Only admin can edit/delete signs



# Course View
class CourseView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]  # Change to IsAuthenticated for protected access

# Course Detail View (Retrieve, Update, Delete)
class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

# Lesson View (List & Create)
class LessonView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]

# Lesson Detail View (Retrieve, Update, Delete)
class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]





class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        lesson_id = self.request.query_params.get('lesson')
        print("Querying comments for lesson:", lesson_id)
        if course_id:
            return Comment.objects.filter(course_id=course_id).order_by('-created_at')
        elif lesson_id:
            return Comment.objects.filter(lesson_id=lesson_id).order_by('-created_at')
        return Comment.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        course_id = self.request.data.get('course')
        if not course_id:
            raise PermissionDenied("Course ID is required.")
        serializer.save(user=self.request.user, course_id=course_id)
        


from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


from rest_framework import generics, permissions
from .models import Lecturer
from .serializers import LecturerSerializer

class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    permission_classes = [permissions.IsAdminUser]  # Only admins can add lecturers

    def create(self, request, *args, **kwargs):
        user = request.data.get('user')
        if Lecturer.objects.filter(user_id=user).exists():
            return Response({"error": "This user is already a lecturer"}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)
    
class LecturerListCreateView(generics.ListCreateAPIView):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    
class LecturerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer



class LecturerLoginView(APIView):
    permission_classes = []

    def post(self, request):
        # Get credentials from the request
        Email = request.data.get("Email")
        password = request.data.get("password")

        if not Email or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user
        user = authenticate(request, Email=Email, password=password)

        if user is not None:
            if not user.is_active:
                return Response({"error": "Your account is inactive."}, status=status.HTTP_400_BAD_REQUEST)

            if hasattr(user, "lecturer"):
                # User is a lecturer, so return the lecturer data and a token
                token, created = Token.objects.get_or_create(user=user)
                lecturer = user.lecturer  # Lecturer related to this user
                serializer = LecturerSerializer(lecturer)
                return Response({
                    'token': token.key,
                    'lecturer': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "This user is not a lecturer."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class CourseAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ Return course attendance only for the current logged-in user
        records = CourseAttendance.objects.filter(user=request.user).select_related('course')
        serializer = CourseAttendanceSerializer(records, many=True)
        return Response(serializer.data)

    def post(self, request):
        course_id = request.data.get('course')

        if not course_id:
            return Response({'error': 'Course ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        from .models import Course
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if already marked in current login session logic goes here (if applicable)

        attendance = CourseAttendance.objects.create(
            user=request.user,
            course=course
        )
        serializer = CourseAttendanceSerializer(attendance)
        return Response({
            'message': 'Attendance recorded.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail

class ContactEmailView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')

        if not all([name, email, message]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        subject = f'Contact from {name}'
        full_message = f"From: {name} <{email}>\n\n{message}"

        send_mail(
            subject,
            full_message,
            email,
            ['katwalutsab36@gmail.com'],  # your Gmail (receiver)
            fail_silently=False,
        )

        return Response({'success': 'Message sent!'}, status=status.HTTP_200_OK)
