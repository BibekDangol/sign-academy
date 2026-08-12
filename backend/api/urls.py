from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    ContactEmailView, CourseAttendanceView, DictionaryView, DictionaryDetailView,
    CourseView, CourseDetailView, LessonView, LessonDetailView, MyTokenObtainPairView,
    CommentViewSet, UserLessonProgressViewSet,
    AttendanceRecordListView, UserAttendanceView, LogoutView,
    LecturerLoginView
)

router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'lesson-progress', UserLessonProgressViewSet, basename='lesson-progress')

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token-obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('register/', views.RegisterView.as_view(), name="register-user"),
    path('change-password/', views.ChangePasswordView.as_view(), name="change-password"),
    path('edit-profile/', views.EditProfileView.as_view(), name="edit-profile"),
    path('test/', views.protectedView, name="test"),
    path('dashboard/', views.dashboard, name="dashboard"),
    path('attendance/', AttendanceRecordListView.as_view(), name='attendance-list'),
    path('attendance/user/<int:user_id>/', UserAttendanceView.as_view(), name='user-attendance'),
    path('attendance/<int:pk>/logout/', LogoutView.as_view(), name='record-logout'),
    path('admin/', views.UserListView.as_view(), name="user-list"),
    path('api/posts/', views.PostView.as_view(), name='posts_list'),
    path('apply-leave/', views.LeaveApplicationView.as_view(), name="apply-leave"),
    path('leave/', views.LeaveListView.as_view(), name="leave-list"),
    path('leave/<int:pk>/action/', views.LeaveActionView.as_view(), name="leave-action"),
    path('api/lecturerlogin/', LecturerLoginView.as_view(), name='lecturerlogin'),
    path('dictionary/', DictionaryView.as_view(), name='dictionary-list'),
    path('dictionary/<int:pk>/', DictionaryDetailView.as_view(), name='dictionary-detail'),
    path('courses/', CourseView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('lessons/', LessonView.as_view(), name='lesson-list'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('course-attendance/', CourseAttendanceView.as_view(), name='course-attendance'),
    path('contact/', ContactEmailView.as_view(), name='contact'),
    
    # ✅ Corrected DRF router mount
    path('', include(router.urls)),

    path('', views.view_all_routes, name="all-routes"),
]
