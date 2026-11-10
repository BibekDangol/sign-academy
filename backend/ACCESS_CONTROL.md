# Roles and access

Roles are derived from existing records; no role field or data migration is needed.

- **Admin:** an active user with `is_superuser=True`.
- **Lecturer:** an active non-superuser with a Lecturer profile.
- **Student:** any other active authenticated user.

`is_staff` alone does not grant administrator privileges. Older lecturer setup
automatically set this flag. Django admin is therefore restricted to active
superusers so that lecturers cannot bypass course ownership through its model
screens. Existing account flags and records are not rewritten.

| Operation | Visitor | Student | Lecturer | Admin |
| --- | --- | --- | --- | --- |
| Read courses, lessons, dictionary | Yes | Yes | Yes | Yes |
| Create/edit/delete courses and lessons | No | No | Own assigned courses | All |
| Reassign course lecturer | No | No | No | Yes |
| Manage dictionary | No | No | No | Yes |
| Read/write comments | No | Own edits/deletes | Own edits/deletes | Moderate all |
| Profile uploads, lesson progress | No | Own | Own | Own; may inspect other uploads |
| Login attendance | No | Own | Own | All |
| Course attendance | No | Own | Own | Own |
| Submit/list leave | No | Own | Own | Submit own/list all |
| Approve/reject leave | No | No | No | Yes |
| List users/manage lecturer profiles | No | No | No | Yes |

Authenticated users can read lesson/course comments. Comments must reference a
lesson in the supplied course, and existing comments cannot be moved. Progress
records cannot be moved or taken over. The server assigns owners for profile
uploads, progress, attendance and leave; submitted owner IDs cannot impersonate
another account. Leave applicants cannot set approval status. The approval
endpoint accepts only an APPROVED or REJECTED status, not owner/date/reason edits.

All roles use the standard email/password JWT login. The old lecturer-login URL
is a compatibility alias for that same flow. Tokens carry a role for navigation;
refresh updates it from current database records. API permission checks always
use current database roles, not client-supplied roles or token role claims.

Use an existing superuser in Django admin to manage accounts and lecturer
profiles. `/api/lecturers/` also provides administrator-only profile management.
A Lecturer profile identifies ownership; removing it immediately removes API
teaching privileges even if `is_staff` remains set. Log in again (or refresh the
session) to update role-based navigation after account changes.

Frontend `/form` and `/all` are admin-only. `/courses`, lesson-with-course pages,
`/progress`, `/payment` and account pages require login. Public home, dictionary,
course information, standalone lesson videos and webcam practice remain available.
Signed-out visitors return to their original internal path after login, including
query and fragment. Signed-in visitors are redirected away from login/register.
Unauthorized signed-in users see an access-denied page. Frontend guards guide
navigation; backend checks enforce authorization.
