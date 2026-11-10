# Backend configuration

Install dependencies from `requirements.txt`. Copy `.env.example` to `.env`
inside `backend/`, then fill in the database connection and a unique Django
signing key. The `.env` file is ignored by Git. Process environment variables
override values in that file, including when running from another directory.

Generate a signing key locally:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

Keep that output private and place it in `DJANGO_SECRET_KEY`. A missing or blank
key stops startup. Changing the key invalidates existing signed sessions and JWTs;
users must log in again.

`DJANGO_DEBUG` defaults to `False`. Set it to `True` only for local development.
For deployment, set `DJANGO_ALLOWED_HOSTS` to the server's hostnames and
`CORS_ALLOWED_ORIGINS` to the frontend's full origins. Both accept comma-separated
values. Do not upload your local `.env` to source control or share its contents.

The example uses console email so development does not require SMTP credentials.
To send real mail, select `django.core.mail.backends.smtp.EmailBackend` and set
the SMTP account and password in the environment.

## Existing credential rotation

The local Django signing key has been regenerated. Existing database and SMTP
credentials were moved to the ignored `.env` to preserve local connections;
they have **not** been rotated at their providers.

1. Revoke the exposed Gmail app password in the Google account's security settings.
2. Generate a replacement if SMTP is needed and update `EMAIL_HOST_PASSWORD` locally.
3. Create a dedicated MySQL application account with access to the `LMS` database,
   and update `DB_USER` and `DB_PASSWORD`. Rotate the exposed database password
   after checking whether other local applications depend on that account.
4. Restart Django and run `python manage.py check`. Verify email separately when
   SMTP credentials have been replaced.

Removing secrets from current files does not remove copies from Git history.
Credential revocation is still necessary for previously exposed values.

## Session logout

Run `python manage.py migrate` after installing the backend. The JWT blacklist
application requires its own tables (already migrated in this local workspace).
`POST /api/logout/` takes `{ "refresh": "<refresh token>" }`. The refresh token
itself authorizes ending that session, even if its access token has expired.
Successful and repeated logout requests return HTTP 204.

New logins embed the attendance record and refresh-session identifier in both
tokens. Logout blacklists that refresh token, rejects its associated access
tokens, and closes only the matching attendance record. Other logins remain
active. Registration does not create attendance.

Log in again after this update to obtain session-linked tokens. Older tokens
can still have their refresh revoked, but have no signed attendance link or
access-session identifier; the server does not guess which record to close.
Password-change protection also requires a password fingerprint in JWTs. Tokens
issued before that protection was enabled are rejected; log in again after updating.

If logout cannot reach the server, the browser clears its local session and
reports that server logout could not be confirmed. Server revocation and attendance
closure require a successful request. Expired refresh tokens are rejected.

Expired blacklist records can be removed with `python manage.py flushexpiredtokens`.

## Account settings

Profile editing supports username, email, full name, and bio. The response
includes re-signed access claims for the same session and expiry, so the browser
updates its shared user state immediately. Refresh also loads current profile
details from the database; old refresh claims cannot undo an edit.

Password changes require the exact old password and a different valid new one.
Password spaces are preserved in registration, login, and password changes.
A successful change revokes every outstanding refresh token for that account,
invalidates prior access tokens using the password fingerprint, and closes all
open attendance sessions. The browser signs out immediately and requests login
with the new password. Other accounts are unaffected. Incorrect old passwords
and invalid new passwords leave existing sessions active.
