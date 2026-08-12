from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.contrib.auth import user_logged_in
from .models import AttendanceRecord, Profile
from django.utils.timezone import now

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# Add this signal receiver to prevent creating duplicate profiles
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
    
@receiver(user_logged_in)
def log_user_attendance(sender, request, user, **kwargs):
    last_attendance = AttendanceRecord.objects.filter(user=user).order_by('-login_time').first()

    AttendanceRecord.objects.create(
        user=user,
        previous_login_time=last_attendance.login_time if last_attendance else None,
        login_time=now(),
        ip_address=request.META.get('REMOTE_ADDR', ''),
        device_info=request.META.get('HTTP_USER_AGENT', '')
    )
