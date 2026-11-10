from django.dispatch import receiver
from django.contrib.auth import user_logged_in
from .models import AttendanceRecord
from django.utils.timezone import now

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
