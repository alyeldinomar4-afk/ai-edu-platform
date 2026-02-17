# Backend Handoff Guide — AI Education Platform

## Project Overview
This is the **frontend** for the AI Education Platform, a graduation project. Built with **React 19**, **Vite 7**, and **Tailwind CSS v4**. The frontend is fully functional with mock data and is ready for backend integration.

---

## How to Run

```bash
cd ai-edu-platform
npm install
npm run dev        # → http://localhost:5173
npm run build      # → Production build in dist/
```

---

## Architecture Overview

```
src/
├── auth/                    # Authentication system
│   ├── AuthContext.jsx      # React Context (user state, login, register, logout)
│   ├── ProtectedRoute.jsx   # RBAC route guard (allowedRoles)
│   └── useAuth.js           # Hook re-export
├── services/
│   ├── authService.js       # Auth API service (login, register, session)
│   └── api.js               # Data API service (courses, learner, instructor, admin, ai)
├── data/
│   └── mockData.js          # Mock data (courses, categories, testimonials)
├── components/
│   ├── ui/                  # Reusable UI (Button, Breadcrumb, LoadingSkeleton)
│   ├── layout/              # Layouts (MainLayout, AdminLayout, AuthLayout, Navbar, Footer)
│   └── features/            # Feature components (CourseCard, etc.)
├── pages/
│   ├── HomePage.jsx         # Landing page
│   ├── AIDemoPage.jsx       # AI Chat demo
│   ├── auth/                # Login, Register, ForgotPassword
│   ├── courses/             # CoursesPage, CourseDetailsPage
│   ├── course/              # VideoPlayerPage
│   ├── learner/             # LearnerDashboardPage
│   ├── instructor/          # InstructorDashboardPage
│   └── admin/               # AdminDashboardPage, ManageCoursesPage
└── utils.js                 # Utility functions (cn for Tailwind class merging)
```

---

## Authentication System

### Current Implementation (Mock)
- **`src/services/authService.js`** — Simulates backend auth with localStorage
- **`src/auth/AuthContext.jsx`** — React Context providing `user`, `login()`, `register()`, `logout()`
- **`src/auth/ProtectedRoute.jsx`** — Route guard with `allowedRoles` prop

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Learner | user@test.com | 123456 |
| Admin | admin@test.com | admin123 |

### Backend Integration Steps
1. Replace `authService.js` mock functions with real API calls
2. Store JWT token from `login()` response in localStorage
3. Add token to `Authorization` header in `api.js`
4. Implement token refresh logic in `AuthContext`

### Required Auth Endpoints

```
POST /api/auth/login
  Body: { email, password }
  Response: { token, refreshToken, user: { id, name, email, role, avatar } }

POST /api/auth/register
  Body: { name, email, password, role }
  Response: { token, user: { id, name, email, role, avatar } }

POST /api/auth/logout
  Headers: Authorization: Bearer <token>

GET /api/auth/me
  Headers: Authorization: Bearer <token>
  Response: { user: { id, name, email, role, avatar } }
```

---

## Role-Based Access Control (RBAC)

### Roles: `learner`, `instructor`, `admin`

| Route Pattern | Allowed Roles | Layout |
|---|---|---|
| `/` `/courses` `/ai-demo` | Public | MainLayout (Navbar + Footer) |
| `/login` `/register` | Public | AuthLayout (centered card) |
| `/learner/dashboard` | learner | MainLayout |
| `/instructor/dashboard` | instructor | MainLayout |
| `/admin/*` | admin | AdminLayout (sidebar) |
| `/courses/:id/learn` | learner, instructor, admin | Fullscreen |

### How ProtectedRoute Works
```jsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminLayout />
</ProtectedRoute>
```
- If not authenticated → Redirect to `/login`
- If wrong role → Redirect to correct dashboard

---

## API Service Layer (`src/services/api.js`)

This is the **single integration point** for all data. Replace mock implementations with real API calls.

### Course Endpoints
```
GET  /api/courses              → Course[]
GET  /api/courses/:id          → Course (with curriculum, reviews)
GET  /api/categories           → Category[]
```

### Learner Endpoints
```
GET  /api/learner/stats        → { hoursWatched, certificates, coursesInProgress }
GET  /api/learner/progress     → { courseId, title, progress, lastLesson }[]
GET  /api/learner/recommendations → Course[] (AI-based)
```

### Instructor Endpoints
```
GET  /api/instructor/stats     → { totalStudents, totalRevenue, avgRating, activeCourses }
GET  /api/instructor/courses   → { id, title, students, status, revenue }[]
POST /api/instructor/courses   → Create new course
```

### Admin Endpoints
```
GET  /api/admin/stats          → { totalUsers, activeCourses, totalRevenue, activeUsers }
GET  /api/admin/users          → User[] (with pagination)
```

### AI Chat Endpoint
```
POST /api/ai/chat
  Body: { message, context?: { courseId, videoTimestamp } }
  Response: { response: string }
```
- Frontend: `src/pages/AIDemoPage.jsx` has a fully working chat UI
- Replace `getDemoResponse()` function with `api.ai.chat()` call

---

## Data Schemas (from `src/data/mockData.js`)

### Course
```json
{
  "id": 1,
  "title": "Machine Learning Fundamentals",
  "instructor": "Dr. Sarah Smith",
  "rating": 4.8,
  "reviews": 124,
  "price": 19.99,
  "image": "https://...",
  "category": "Data Science",
  "level": "Beginner",
  "lessons": 24,
  "duration": "12h 30m"
}
```

### User (from AuthContext)
```json
{
  "id": "student-1",
  "name": "Test Student",
  "email": "user@test.com",
  "role": "learner",
  "avatar": "https://i.pravatar.cc/150?u=student"
}
```

---

## Integration Checklist

- [ ] Set up backend with RESTful API for all endpoints above
- [ ] Replace `authService.js` mock → real auth with JWT
- [ ] Replace `api.js` mock functions → real fetch/axios calls
- [ ] Add `Authorization: Bearer <token>` header to all authenticated requests
- [ ] Implement token refresh middleware
- [ ] Set up video streaming endpoints for `VideoPlayerPage`
- [ ] Connect AI Chat endpoint to your ML/NLP backend
- [ ] Update `mockData.js` to match your database schemas
