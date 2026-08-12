from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager  
from django.db.models.signals import post_save
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.utils import timezone
from django.utils.timezone import now
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = models.CharField(max_length=150, blank=True)  # Make username optional
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Remove username from required fields
    
    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        """Auto-generate username if not provided"""
        if not self.username:
            self.username = self.email.split('@')[0]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

# Lecturer model
class Lecturer(models.Model):
    """
    Model representing a Lecturer (One-To-One with User)
    """
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='lecturer'
    )
    department = models.CharField(max_length=100)
    qualification = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='lecturer_profiles/', blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['user__username']  # Alphabetical order

    def __str__(self):
        return f"{self.user.username} ({self.department})"


# Course model
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    video_url = models.URLField()
    lecturer = models.ForeignKey('Lecturer', on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


        
class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    video_url = models.URLField()
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

# Profile model for additional user details
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    bio = models.CharField(max_length=1000)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name

# AttendanceRecord model - using the User class defined above
class AttendanceRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendance_records')
    login_time = models.DateTimeField(default=timezone.now)
    logout_time = models.DateTimeField(null=True, blank=True)
    session_duration = models.DurationField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.CharField(max_length=255, null=True, blank=True)
    previous_login_time = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.logout_time and self.login_time:
            self.session_duration = self.logout_time - self.login_time
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - Login: {self.login_time}"

# Post model
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)

    def __str__(self):
        return self.title
    
# Leave model for user leave requests
class Leave(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.CharField(max_length=255)
    
    status_choices = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    ]
    status = models.CharField(max_length=20, choices=status_choices, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.end_date < self.start_date:
            raise ValidationError("End date cannot be before start date.")

# Dictionary model
class Dictionary(models.Model):
    word = models.CharField(max_length=255, unique=True, db_index=True)
    sign_image = models.ImageField(upload_to='dictionary_images/', blank=True, null=True)
    # sign_video = models.FileField(upload_to='dictionary_videos/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    difficulty_rating = models.PositiveIntegerField(
        default=0,
        choices=[(i, i) for i in range(1, 6)],
        blank=True,
        null=True
    )

    def __str__(self):
        return self.word



# Comment model
class Comment(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    lesson = models.ForeignKey('Lesson', on_delete=models.CASCADE)  # ✅ Required!
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.lesson.title}"

class UserLessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.email} - {self.lesson.title}"


# Signal to create the profile after the user is saved
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        AttendanceRecord.objects.create(user=instance)

@receiver(post_save, sender=Lecturer)
def grant_staff_status(sender, instance, created, **kwargs):
    if created:
        instance.user.is_staff = True
        instance.user.save()


#attendence for the course
class CourseAttendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)  

    class Meta:
        ordering = ['-timestamp']