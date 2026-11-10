from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken


class SessionJWTAuthentication(JWTAuthentication):
    """Reject access tokens belonging to a logged-out refresh session."""

    def get_validated_token(self, raw_token):
        token = super().get_validated_token(raw_token)
        session_jti = token.get('session_jti')
        if session_jti and BlacklistedToken.objects.filter(token__jti=session_jti).exists():
            raise InvalidToken('This session has been logged out.')
        return token
