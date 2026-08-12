# Sign Academy — Detailed Project Report

## 1. Project Overview

**Sign Academy** is a Final Year Project (FYP) that builds an e-learning platform for learning **American Sign Language (ASL)**. It combines the features of a traditional Learning Management System (LMS) — courses, lessons, progress tracking, attendance, and leave management — with **real-time hand-gesture recognition** driven by computer vision and machine learning in the browser.

Users can learn sign language from video lessons, look up words in a sign dictionary, and practice by performing hand signs in front of their webcam, where the app detects and identifies the gesture in real time.

## 2. Tech Stack

### Backend (`backend/`)
| Component | Technology |
|-----------|------------|
| Web framework | Django 5 |
| REST API | Django REST Framework (DRF) |
| Authentication | JWT via `djangorestframework-simplejwt` + DRF Token/Session auth |
| Database | MySQL (database name: `LMS`) |
| Filtering | `django-filter` |
| CORS | `django-cors-headers` |
| Media/images | Pillow |
| Email | Django SMTP backend using Gmail |

### Frontend (`frontend/`)
| Area | Technology |
|------|------------|
| Core | React 18, React Router v6 |
| UI library | Material-UI (MUI), Bootstrap, react-toastify, SweetAlert2 |
| Animation | Framer Motion, react-spring, animejs, AOS |
| Computer vision | TensorFlow.js, @mediapipe/hands, @tensorflow-models/handpose, fingerpose |
| Webcam | react-webcam |
| Data fetching | Axios, @tanstack/react-query |
| Charts/tables | MUI X Data Grid, material-react-table, jspdf (+ autotable) |
| Other | Firebase, react-chatbot-kit, react-player, react-slick, react-calendar |

### Project Layout
```
Sign-Academy/
├── backend/            # Django project
│   ├── api/            # Main app: models, views, serializers, urls
│   ├── backend/        # Project settings, urls, asgi/wsgi
│   ├── media/          # Uploaded media files
│   ├── manage.py
│   └── requirements.txt
├── frontend/           # React app (Create React App)
│   └── src/
│       ├── App.js            # Route definitions
│       ├── context/          # AuthContext (JWT auth state)
│       ├── gestures/         # fingerpose gesture definitions
│       ├── pages/            # All page components
│       ├── utils/            # Helpers (ProtectedRoute, drawHand)
│       └── WebcamCapture.jsx
├── myenv/ / venv/      # Python virtual environments
└── image.png
```

## 3. Feature Breakdown

### 3.1 Authentication & User Management
- Custom `User` model (in `api/models.py`) with **email as the login identifier** (username is optional and auto-generated from the email prefix).
- JWT-based login (`/api/token/`) and refresh (`/api/token/refresh/`), with a 60-minute access-token lifetime.
- Registration (`/api/register/`), change password (`/api/change-password/`), and profile editing (`/api/edit-profile/`).
- Automatic creation of a `Profile` and an `AttendanceRecord` on user creation (Django signals).
- Frontend `AuthContext` stores tokens in `localStorage`, decodes them with `jwt-decode`, auto-expires sessions, and protects routes via a `ProtectedRoute` wrapper.

### 3.2 Attendance Tracking
- On every successful login, an `AttendanceRecord` is created automatically with:
  - `login_time`, `logout_time`, computed `session_duration`
  - `ip_address` and `device_info` (User-Agent)
  - `previous_login_time` (from the user's last login)
- Logout is recorded via `/api/attendance/<id>/logout/`.
- Non-staff users only see their own records; staff can view/search/filter all (`/api/attendance/`, `/api/attendance/user/<id>/`).

### 3.3 Course Attendance
- Separate `CourseAttendance` model records that a user attended a specific course (`/api/course-attendance/`), timestamped.

### 3.4 Courses, Lessons & Learning
- `Course` (title, description, video URL, optional lecturer) and `Lesson` (title, video URL, content) models.
- Public endpoints: `/api/courses/`, `/api/courses/<id>/`, `/api/lessons/`, `/api/lessons/<id>/`.
- Lesson videos play via `react-player`.
- `UserLessonProgress` tracks per-user completed lessons (unique per user+lesson, duplicate-safe creation).

### 3.5 Sign Dictionary
- `Dictionary` model: word, sign image, description, and a difficulty rating (1–5).
- Public read access; only admins can create/edit/delete (`/api/dictionary/`).

### 3.6 Real-Time Hand Gesture Recognition
This is the standout feature, implemented entirely in the browser:

- **`/handsign` page (`HandSign.jsx`)**
  - Loads MediaPipe Handpose via TensorFlow.js.
  - Captures webcam frames every 150 ms and estimates hand landmarks.
  - Uses the **fingerpose** library with 15 custom gesture definitions (in `src/gestures/`) to classify the best-matching gesture.
  - Draws hand skeleton/landmarks onto a canvas overlay via `utils/drawHand`.
  - Supported gestures: Call Me, Love You (x2 variants), OK, Pinched Finger/Hand, Point Up/Down/Left/Right, Raised Fist, Raised Hand, Rock On, Thumbs Down, Middle Finger.

- **ASL Fingerspelling (A–Z)**
  - `gesturestore.js` defines all 26 letter signs (A–Z) as fingerpose `GestureDescription` objects for letter-by-letter finger-spelling recognition.

- **Neural Network Classifier**
  - `sign_detection_model.js` builds a small TensorFlow.js sequential model (63 landmark inputs → 2 hidden layers → softmax over 10 signs: Hello, Yes, No, Thank You, Please, Love, Help, Stop, Goodbye, Peace).
  - `predictionsign.js` provides a nearest-neighbor fallback that matches detected landmarks against a reference dataset (`signs_data.json`).

### 3.7 Social & Communication
- **Comments**: users can comment on courses/lessons (`/api/comments/`), filtered by `course_id` or `lesson`.
- **Posts**: simple user posts with optional images (`/api/api/posts/`).
- **Contact form**: `/api/contact/` sends emails via Gmail SMTP to the project owner.

### 3.8 Leave Management
- Users can apply for leave (`/api/apply-leave/`) with start/end dates and reason.
- Staff/admins approve or reject (`/api/leave/<id>/action/`), statuses: `PENDING`, `APPROVED`, `REJECTED`.

### 3.9 Lecturers & Staff
- `Lecturer` model one-to-one with `User` (department, qualification, bio, profile picture). Creating a lecturer grants the linked user `is_staff` status.
- Dedicated lecturer login endpoint (`/api/api/lecturerlogin/`).

### 3.10 Additional Pages
- Marketing-style landing pages: `Home`, `Home2`, `About`, `About1`, `Contacts`.
- `Dashboard`, `Profile`, `Settings`, `AttendanceRecords`, `LeaveApplication`, `ProgressPage`.
- `HandSignStore` (gesture showcase), `Payment` page, `NotFound` (404).

## 4. System Architecture

### 4.1 High-Level Architectural Diagram

```
                    ┌────────────────────────────────────────────────┐
                    │                  Browser (Client)              │
                    │                                                │
                    │   ┌──────────────────────────────┐             │
                    │   │      React SPA (CRA)         │             │
                    │   │  ┌───────────┐ ┌──────────┐  │             │
                    │   │  │  React    │ │  Pages / │  │             │
                    │   │  │  Router   │ │  Views   │  │             │
                    │   │  └─────┬─────┘ └────┬─────┘  │             │
                    │   │        └─────┬───────┘        │             │
                    │   │              │                │             │
                    │   │   ┌──────────▼──────────┐     │             │
                    │   │   │   AuthContext       │     │             │
                    │   │   │ (JWT ⇄ localStorage)│     │             │
                    │   │   └──────────┬──────────┘     │             │
                    │   │              │                │             │
                    │   │   ┌──────────▼──────────┐     │   ┌────────┐│
                    │   │   │  Axios API Calls    │     │   │ Webcam  ││
                    │   │   └──────────┬──────────┘     │   │ (Media) ││
                    │   │              │                │   └────┬───┘│
                    │   └──────────────┼────────────────┼────────┼────┘
                    │                  │                │        │
                    │        ┌─────────▼──────────┐     │        │
                    │        │  Gesture Pipeline   │     │        │
                    │        │  (HandSign.jsx)     │     │        │
                    │        │  TF.js + Handpose   │◄────┘        │
                    │        │  + fingerpose       │              │
                    │        └────────────────────┘               │
                    └─────────────────────────────────────────────┘
                          │ (HTTP / JSON, CORS localhost:3000)
                          │ JWT Bearer tokens
                          ▼
              ┌───────────────────────────────┐
              │   Django REST Framework API   │   (backend :8000)
              │  ┌─────────────────────────┐  │
              │  │  api/views.py           │  │  ──── ViewSets &
              │  │  generics/APIView       │  │       function views
              │  └───────────┬─────────────┘  │
              │  ┌───────────▼─────────────┐  │
              │  │  api/serializers.py     │  │  ──── DRF serializers
              │  └───────────┬─────────────┘  │
              │  ┌───────────▼─────────────┐  │
              │  │  api/models.py          │  │  ──── ORM models
              │  └───────────┬─────────────┘  │
              │   SimpleJWT   │   Signals     │
              │   auth  ◄─────┴────►  auto    │
              │              │       Profile/ │
              │              │       Absence  │
              │              ▼                │
              │   ┌────────────────────────┐  │
              │   │   MySQL database (LMS) │  │
              │   └────────────────────────┘  │
              └───────────────────────────────┘
                        │
                        ▼
                   Gmail SMTP  (contact form, email)
                         &  Media storage (media/)
```

### 4.2 Layered Architecture

The project follows a classic **client–server layered architecture** with a clear separation of concerns:

| Layer | Components | Responsibility |
|-------|-----------|----------------|
| **Presentation** | React pages, components, styles | Rendering UI, capturing webcam input, user interaction |
| **Client state & routing** | React Router, `AuthContext`, `ProtectedRoute` | Managing JWT auth state, route protection |
| **Client-side ML** | TF.js, Handpose, fingerpose, gesture defs | Real-time gesture recognition (no server round-trip) |
| **Communication** | Axios, DRF API endpoints | JSON over HTTP, JWT-authenticated REST calls (CORS enabled) |
| **Application / API** | `api/views.py`, `serializers.py`, `urls.py` | Business logic, request validation, permission checks, data serialization |
| **Domain / Model** | `api/models.py` (ORM) | Data entities: users, courses, lessons, attendance, dictionary, leave, etc. |
| **Data / Persistence** | MySQL database | Long-term storage of all records |
| **Infrastructure** | Django settings, Media storage, Gmail SMTP | Config, uploaded media, outbound email |

### 4.3 Request Flow (example: user login then loads lessons)

```
1. User submits email/password in Login.jsx
        │ (POST /api/token/ — JSON)
        ▼
2. Django → MyTokenObtainPairView (SimpleJWT)
   • validates credentials
   • issues access + refresh tokens
   • creates an AttendanceRecord (signals on login)
        │ (response: { access, refresh })
        ▼
3. AuthContext stores tokens in localStorage, decodes user
        │
4. Navigate to protected pages (e.g., /dashboard, /courses)
   • Axios includes "Authorization: Bearer <access>"
        │ (GET /api/courses/, GET /api/lessons/)
        ▼
5. DRF → permission classes check token → serializer returns course/lesson JSON
        │
        ▼
6. React renders catalog; user opens a lesson → progress + attendance updates
```

### 4.4 Gesture Recognition Pipeline (client-side only)

```
Webcam frames
      │  every ~150 ms
      ▼
MediaPipe Handpose (TF.js) ─► 21 hand landmarks (x, y, z) per hand
      │
      ├──────────────────────────────┐
      ▼                              ▼
fingerpose GestureEstimator    TF.js neural net (sign_detection_model.js)
      │  15 predefined gestures          63 landmark features ─► 10 signs
      │  (src/gestures/)                 (softmax classification)
      ▼                              ▼
Detected gesture/label      Nearest-neighbor fallback
      │                              (predictionsign.js + signs_data.json)
      └──────────────┬───────────────┘
                     ▼
           Best-match sign shown on UI + canvas landmarks overlay
```

### 4.5 Module Dependencies

```
frontend/src
├── App.js ──────────────► routes all pages, wraps AuthenticationProvider
│   ├── context/AuthContext ─► login, register, logout, token lifecycle
│   ├── utils/ProtectedRoute ─► guards protected pages
│   ├── utils/drawHand ─────────┐
│   ├── gestures/ (fingerpose)  ├──► used by pages/HandSign.jsx
│   └── pages/
│       ├── HandSign.jsx ───────┘
│       ├── gesturestore.js ──► A–Z letters (fingerpose)
│       ├── sign_detection_model.js ──► TF.js model factory + predict
│       ├── predictionsign.js ──► nearest-neighbor matcher
│       └── ... (all CRUD pages) ──► Axios ──► Django API

backend
├── backend/urls.py ──► routes /admin, /, /api/ → api/urls.py
├── backend/settings.py ──► JWT, CORS, MySQL, email config
└── api/
    ├── urls.py ──► maps endpoints to views
    ├── views.py ──► APIViews, ViewSets, generic views
    ├── serializers.py ──► data (de)serialization
    ├── models.py ──► ORM models + signals
    └── admin.py ──► Django admin registration
```

### 4.6 Deployment Target Architecture (current dev mode)

```
[Browser :3000]  CORS  [Gunicorn/Django :8000]  ──  [MySQL :3306]
     │                        │
     │                        └── media/ (uploaded images)
     └  (static React build → can be served by Nginx or whitenoise)
```
Currently runs in **development mode** (`DEBUG=True`, React dev server on :3000, Django dev server on :8000). For production you would: set `DEBUG=False`, fill `ALLOWED_HOSTS`, serve the React build statically, and put Django behind Gunicorn/Nginx with a production WSGI server.

## 5. API Endpoint Summary

| Method | Endpoint | Purpose | Access |
|--------|----------|---------|--------|
| POST | `/api/token/` | JWT login (auto-records attendance) | Public |
| POST | `/api/token/refresh/` | Refresh JWT | Public |
| POST | `/api/register/` | User registration | Public |
| POST | `/api/change-password/` | Change password | Auth |
| PATCH/PUT | `/api/edit-profile/` | Edit profile | Auth |
| GET | `/api/attendance/` | Attendance list | Auth |
| GET | `/api/attendance/user/<id>/` | Attendance for a user | Auth/Staff |
| PATCH | `/api/attendance/<id>/logout/` | Record logout | Auth |
| GET/POST | `/api/api/posts/` | User posts | Public/Auth |
| POST | `/api/apply-leave/` | Apply for leave | Auth |
| GET | `/api/leave/` | List leave | Auth |
| PUT | `/api/leave/<id>/action/` | Approve/reject | Admin |
| GET/POST | `/api/dictionary/` | Sign dictionary | Public |
| PUT/DELETE | `/api/dictionary/<id>/` | Manage signs | Admin |
| GET/POST | `/api/courses/`, `/api/lessons/` | Course/lesson lists | Public |
| GET/PUT/DELETE | `/api/courses/<id>/`, `/api/lessons/<id>/` | Detail views | Public |
| GET/POST | `/api/comments/` | Lesson/course comments | Auth |
| GET/POST | `/api/lesson-progress/` | Track lesson progress | Auth |
| GET/POST | `/api/course-attendance/` | Course attendance | Auth |
| POST | `/api/contact/` | Contact form → email | Public |
| POST | `/api/api/lecturerlogin/` | Lecturer login | Public |

## 6. Database Models (core)
- `User` (custom, email-based)
- `Profile` (full_name, bio, verified)
- `Lecturer` (department, qualification, bio, profile_picture)
- `Course`, `Lesson`
- `UserLessonProgress` (user+lesson unique)
- `AttendanceRecord` (login/logout/session/IP/device)
- `CourseAttendance`
- `Post`
- `Comment`
- `Leave`
- `Dictionary`

## 7. Setup & Running

### Backend
```bash
cd backend
python -m venv venv          # or use existing myenv/venv
venv\Scripts\activate
pip install -r requirements.txt
# configure MySQL (db: LMS, user: root, password: root) in backend/settings.py
python manage.py migrate
python manage.py runserver   # runs on http://127.0.0.1:8000
```

### Frontend
```bash
cd frontend
npm install
npm start                    # runs on http://localhost:3000
```
The frontend expects the backend at `http://127.0.0.1:8000` and CORS is configured for `http://localhost:3000`.

## 8. Known Issues & Recommendations

1. **Hardcoded secrets** — Gmail app password and Django secret key are committed in `backend/backend/settings.py`. Move them to environment variables or `python-decouple` (already in requirements).
2. **Broken lecturer login** — `views.py` uses DRF's `Token.objects` without importing it, so `/api/api/lecturerlogin/` would raise an error.
3. **Dev-only configuration** — `DEBUG = True`, empty `ALLOWED_HOSTS`; not production-safe.
4. **Duplicate/unused code** — Two overlapping detection stacks, several legacy/duplicate pages (`Home`/`Home2`, `About`/`About1`, `Navbar`/`Navbar1`, `Footer`/`footer1`), and dead routes (e.g., `/handsignstore`) suggest iterative development that could be cleaned up.
5. **Gesture robustness** — fingerpose detection is sensitive to camera angle/lighting; the M/N/S/T and R/U gestures are hard to disambiguate with simple curl/direction heuristics.
6. **Security** — JWT tokens stored in `localStorage` are vulnerable to XSS; consider HTTP-only cookies.

## 9. Conclusion

Sign Academy is a full-stack e-learning platform that successfully merges a standard LMS with browser-based AI hand-gesture recognition, making sign-language learning interactive and self-directed. The Django/DRF + MySQL backend provides a clean REST API for auth, courses, attendance, and social features, while the React frontend delivers real-time webcam gesture detection using TensorFlow.js, MediaPipe, and fingerpose. With some cleanup (secrets, dead code, and bug fixes), it is a solid FYP showcase.
