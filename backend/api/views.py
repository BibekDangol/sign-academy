# views.py

from django.db import connection, transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.timezone import now

from rest_framework import generics, status, permissions, viewsets, filters, serializers
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError

from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAdministrator, AdminWritePublicRead, CourseWritePublicRead, OwnerOrAdministrator, is_admin

# Models
from .models import (
    User, AttendanceRecord, Leave, Post, Profile, UserLessonProgress,
    CourseAttendance, Dictionary, Course, Lesson, Comment, Lecturer,
)

# Serializers
from .serializers import (
    MyTOPS, RegistrationSerializer, ChangePasswordSerializer, UserLessonProgressSerializer,
    UserSerializer, AttendanceRecordSerializer, LeaveSerializer, PostSerializer, CommentSerializer, DictionarySerializer, CourseSerializer,
    LessonSerializer, CourseAttendanceSerializer, LeaveStatusSerializer, LecturerSerializer, EditProfileSerializer
)




def index(request):
    return render(request, 'index.html')

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTOPS

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
@permission_classes([AllowAny])
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id', request.user.pk)
        if not str(user_id).isdigit():
            raise serializers.ValidationError({'user_id': 'Enter a valid user ID.'})
        if not is_admin(request.user) and int(user_id) != request.user.pk:
            raise PermissionDenied('You can view only your own profile uploads.')
        posts = Post.objects.filter(user_id=user_id)
        return Response(PostSerializer(posts, many=True, context={'request': request}).data)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
        user = User.objects.select_for_update().get(pk=request.user.pk)
        request.user = user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'old_password': ['Invalid old password.']}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save(update_fields=['password'])
        for token in OutstandingToken.objects.filter(user=user):
            BlacklistedToken.objects.get_or_create(token=token)
        closed_at = now()
        for record in AttendanceRecord.objects.select_for_update().filter(user=user, logout_time__isnull=True):
            record.logout_time = closed_at
            record.save(update_fields=['logout_time', 'session_duration'])
        return Response({'detail': 'Password changed. Please log in again on all devices.'})


class EditProfileView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = EditProfileSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            data = dict(serializer.data)
            # Re-sign current access claims without extending its lifetime or changing its session.
            if request.auth is not None:
                access = AccessToken(str(request.auth), verify=False)
                for field in ['username', 'email', 'full_name', 'bio', 'role']:
                    access[field] = data[field]
                data['access'] = str(access)
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    permission_classes = [IsAdministrator]
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
        if not is_admin(user):
            queryset = queryset.filter(user=user)
        return queryset



class UserAttendanceView(generics.ListAPIView):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = int(self.kwargs['user_id'])  # 🔄 Ensure it's an int
        if is_admin(self.request.user) or self.request.user.id == user_id:
            return AttendanceRecord.objects.filter(user_id=user_id)\
                                           .select_related('user')\
                                           .order_by('-login_time')
        raise PermissionDenied("You don't have permission to view these records")

class LogoutRequestSerializer(serializers.Serializer):
    refresh = serializers.CharField(trim_whitespace=False, write_only=True)


def revoke_session(request, expected_attendance=None, expected_user=None):
    payload = LogoutRequestSerializer(data=request.data)
    payload.is_valid(raise_exception=True)
    raw = payload.validated_data['refresh']
    try:
        # Verify signature and expiry even when already blacklisted, making retries safe.
        claims = UntypedToken(raw)
        if claims.get('token_type') != 'refresh':
            raise TokenError('Expected a refresh token')
    except TokenError:
        raise serializers.ValidationError({'refresh': 'Invalid or expired refresh token.'})
    user_id = claims.get('user_id')
    attendance_id = claims.get('attendance_id')
    if expected_user is not None and str(user_id) != str(expected_user):
        raise PermissionDenied('This session belongs to another user.')
    if expected_attendance is not None and attendance_id != expected_attendance:
        raise PermissionDenied('This token does not belong to that attendance session.')
    with transaction.atomic():
        record = None
        if attendance_id is not None:
            record = AttendanceRecord.objects.select_for_update().filter(pk=attendance_id, user_id=user_id).first()
            if record is None:
                raise PermissionDenied('Invalid attendance session.')
        # UntypedToken has already verified this token. Skip blacklist checks for repeat logout.
        RefreshToken(raw, verify=False).blacklist()
        if record is not None and record.logout_time is None:
            record.logout_time = now()
            record.save(update_fields=['logout_time', 'session_duration'])
    return Response(status=status.HTTP_204_NO_CONTENT)


class SessionLogoutView(APIView):
    # Possession of a signed, unexpired refresh token authorizes revoking that session.
    # Do not require a live access token or trigger refresh just to log out.
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        return revoke_session(request)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        return revoke_session(request, expected_attendance=pk, expected_user=request.user.pk)

    put = patch


class UserLessonProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserLessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
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
        incoming = self.get_serializer(data=request.data)
        incoming.is_valid(raise_exception=True)
        lesson_id = incoming.validated_data['lesson'].pk

        # Look for existing progress
        existing = UserLessonProgress.objects.filter(user=user, lesson_id=lesson_id).first()
        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        # No existing record – create one
        return super().create(request, *args, **kwargs)

class LeaveApplicationView(generics.CreateAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LeaveListView(generics.ListAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if is_admin(self.request.user):
            return Leave.objects.all()
        else:
            return Leave.objects.filter(user=self.request.user)


class LeaveActionView(generics.UpdateAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveStatusSerializer
    permission_classes = [IsAdministrator]

class DictionaryView(generics.ListCreateAPIView):
    queryset = Dictionary.objects.all()
    serializer_class = DictionarySerializer
    permission_classes = [AdminWritePublicRead]

class DictionaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Dictionary.objects.all()
    serializer_class = DictionarySerializer
    permission_classes = [AdminWritePublicRead]



# Course View
class CourseView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CourseWritePublicRead]

    def perform_create(self, serializer):
        if is_admin(self.request.user):
            serializer.save()
        else:
            serializer.save(lecturer=self.request.user.lecturer)


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CourseWritePublicRead]

# Lesson View (List & Create)
class LessonView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [CourseWritePublicRead]

# Lesson Detail View (Retrieve, Update, Delete)
class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [CourseWritePublicRead]





class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, OwnerOrAdministrator]


    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        lesson_id = self.request.query_params.get('lesson')
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
        


class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    permission_classes = [IsAdministrator]


class LecturerLoginView(MyTokenObtainPairView):
    """Compatibility URL using the same email/password JWT login for every role."""


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
    permission_classes = [AllowAny]
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
