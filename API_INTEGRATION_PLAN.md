# API INTEGRATION PLAN - NEXORA AI EDU PLATFORM
# ══════════════════════════════════════════════════════════════
# 📁 Central Service:      src/services/api.js
# 📁 Auth Service:         src/services/authService.js
# 📁 Migration Status:     ✅ Frontend calls centralized (Mocks remain in api.js)
# ══════════════════════════════════════════════════════════════
# ⚙️ BASE_URL: Configurable in src/services/api.js
# 🔑 Token: stored in localStorage key 'ai_edu_token'
# 👤 User: stored in localStorage key 'ai_edu_user'
# ══════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════
# 📌 IMPORTANT NOTES FOR BACKEND TEAM
# ══════════════════════════════════════════════════════════════

```
1. AUTH HEADER FORMAT:
   Authorization: Bearer <jwt_token>
   Token is stored in: localStorage.getItem('ai_edu_token')

2. ERROR RESPONSE FORMAT (use consistently):
   { message: string, statusCode: number }

3. CORS:
   Frontend runs on http://localhost:5173 (Vite dev server)
   Make sure CORS allows this origin

4. BASE_URL:
   Currently all frontend calls go through src/services/api.js
   Edit the api object's request logic to connect to a real backend.

5. FILE UPLOADS:
   Lectures page supports video + resource file uploads
   Use multipart/form-data for POST /api/instructor/lectures

6. RAW DATA & FORMATTERS (IMPORTANT):
   The frontend uses 'src/utils/formatters.js' for all UI presentation.
   The API MUST return raw numeric values only:
   - Duration → number (seconds)
   - Views/Counts → number (raw)
   - Prices/Revenue → number (float/int)
   UI Formatting (like "12:45" or "1.2K Views") is handled BY THE FRONTEND.

7. DATA TYPE FIXES (COMPLETED ON FRONTEND):
   - Instructor revenue: changed from string "$12,450" → number 12450
   - Lecture views: changed from string "1.2K" → number 1200
   - Video duration: changed from string "12:45" → number 765 (total seconds)
   - Category icons: Photography renamed from Business, icon changed to Camera

8. PAGINATION:
   ManageUsersPage has pagination UI ready (prev/next buttons)
   Send: { page, limit, total } in paginated responses

9. MOCK FILES TO DELETE AFTER FULL INTEGRATION:
   - src/data/mockData.js (entire file)
   - Remove stateful variables (coursesSub, lecturesSub) in src/services/api.js
   - Remove mock delays in src/services/api.js
   - Remove localStorage user DB in src/services/authService.js

10. DATA PARITY (IMPORTANT):
    The Admin "Manage Videos" and Instructor "Lectures" pages now share the same
    stateful source. Any change made by an instructor MUST be immediately
    visible to the admin without a page reload (simulated via api.js state).

11. SIMULATED NETWORK LATENCY (FAKE LOADING):
    - The current api.js uses a 'delay' helper (500ms to 1200ms).
    - This is intentionally added to test Loading Spinners and Skeleton states.
    - AI responses have a longer delay (1.2s) to simulate "thinking" time.
    - When connecting to a real API, these delays should be handled by the 
      actual network response time.
```

### 🎥 Video Integration & AI Synchronization

1. **Mock Video URL**: 
   - Currently, all `videoUrl` fields in `mockData.js` point to a sample W3C test file.
   - **Replacement**: The backend should provide real URLs (S3, Cloudinary, etc.) in the `videoUrl` field of the `/api/courses/:id` or `/api/lectures` response.

2. **The Connection Key (`lectureId`)**:
   - The AI Assistant is NOT linked to the video file itself, but to the `lectureId`.
   - As long as the backend knows what is happening in `lectureId: 101` at `currentTime: 45s`, the AI will stay synchronized regardless of where the video file is hosted.

3. **AI Metadata Sync**:
   - To make the AI "aware" of the video content, the backend team should ideally have a transcript or timestamp-based markers for each `lectureId`.
   - When the frontend sends `currentTime`, the Backend AI logic should look up what is being discussed at that second to provide a contextual answer.


## Authentication

```javascript
// ─────────────────────────────────────────────
// POST login
// ─────────────────────────────────────────────
POST /api/auth/login

// 📁 File: src/services/authService.js → Line 35
// ✅ Status: Integrated (Decoupled from direct mockData imports) | تم الربط وفصل البيانات الوهمية عن الواجهة
// 🔄 Next Step: Replace mock logic with fetch/axios calls | الخطوة التالية: استبدل الكود الوهمي بطلب حقيقي من السيرفر
// 📝 Note: Currently checks localStorage 'ai_edu_users_db' array

Request:
{
  email: string,       // "user@test.com"
  password: string     // "123456"
}

Response:
{
  user: {
    id: string,
    name: string,
    email: string,
    role: "learner" | "instructor" | "admin",
    avatar: string     // URL to profile image
  },
  token: string        // JWT token
}

// Error Response (401):
{ message: "Invalid email or password" }
```

```javascript
// ─────────────────────────────────────────────
// POST register
// ─────────────────────────────────────────────
POST /api/auth/register

// 📁 File: src/services/authService.js → Line 102
// ✅ Status: Integrated (Mock persistence)
// 🔄 Next Step: Replace saveUser() with POST /api/auth/register
// ⚠️ Password is stored as plain text in mock! Backend MUST hash it

Request:
{
  name: string,        // "Ahmed Mansour"
  email: string,       // "ahmed@example.com"
  password: string,    // "password123"
  role: "learner" | "instructor"    // ⚠️ "admin" NOT allowed via registration
}

// 📝 Note: Role 'admin' is NOT allowed via public registration. 
// Admin accounts must be created via admin-only endpoints (e.g., /api/admin/users).
// Backend MUST reject role: "admin" in this request.

Response:
{
  user: {
    id: string,
    name: string,
    email: string,
    role: string,
    avatar: string,
    createdAt: string   // ISO date
  },
  token: string
}

// Error Response (409):
{ message: "Email already exists" }
```

```javascript
// ─────────────────────────────────────────────
// GET current logged-in user
// ─────────────────────────────────────────────
GET /api/auth/me

// 📁 File: src/services/authService.js → Line 138
// ✅ Status: Integrated | تم الربط برمجياً داخل الكود
// 🔄 Next Step: Replace with GET /api/auth/me | الخطوة التالية: استبدل بطلب حقيقي من السيرفر
// 🔑 Header: Authorization: Bearer <token>

Response:
{
  id: string,
  name: string,
  email: string,
  role: "learner" | "instructor" | "admin",
  avatar: string
}
```

```javascript
// ─────────────────────────────────────────────
// POST logout (invalidate token)
// ─────────────────────────────────────────────
POST /api/auth/logout

// 📁 File: src/services/authService.js → Line 132
// ✅ Status: Integrated | تم الربط برمجياً
// 🔄 Next Step: Replace with real API calls | الخطوة التالية: استبدل بطلب حقيقي من السيرفر
// 🔑 Header: Authorization: Bearer <token>

Response:
{ success: true }
```

---

## Courses

```javascript
// ─────────────────────────────────────────────
// GET all courses (with optional filters)
// ─────────────────────────────────────────────
GET /api/courses?category=X&search=Y&level=Z&page=1&limit=12

// 📁 Integration Point: src/services/api.js → Line 50 (api.courses.getAll)
// ✅ Status: Integrated (Decoupled from direct mockData imports) | تم الربط وفصل البيانات الوهمية عن الواجهة
// 🔄 Next Step: Replace mock data with fetch calls | الخطوة التالية: استبدل البيانات الوهمية بطلب حقيقي من السيرفر

Response:
[
  {
    id: number,
    title: string,
    instructor: string,   // instructor display name
    instructorId: number,  // for linking to instructor profile
    instructorAvatar: string, // profile image of the instructor
    rating: number,        // 0-5
    reviews: number,       // total review count
    price: number,         // e.g. 19.99
    discount: number,      // percentage, e.g. 20
    image: string,         // full URL to course thumbnail
    category: string,      // "Data Science", "Development", etc.
    level: string,         // "Beginner", "Intermediate", "Advanced"
    duration: number,      // Total seconds (e.g., 45000 for 12.5h)
    lessons: number        // total lesson count
  }
]

// 📝 Note: Currently returns a raw array. 
// Backend target should include { courses: [], total, page, limit } for pagination.
```

```javascript
// ─────────────────────────────────────────────
// GET single course details
// ─────────────────────────────────────────────
GET /api/courses/:id

// 📁 Integration Point: src/services/api.js → Line 64 (api.courses.getById)
// ✅ Status: Integrated

Response:
{
  id: number,
  title: string,
  description: string,
  instructor: string,
  instructorId: number,
  instructorAvatar: string,
  price: number,
  discount: number,
  image: string,
  category: string,
  level: string,
  duration: number,          // Total seconds
  lessons: number,
  rating: number,
  reviews: number,
  highlights: string[]       // ["Build ML models", "Learn Python", ...]
}

// 📝 Note: Curriculum (lectures) should be fetched separately via /api/courses/:id/lectures
// or combined by the backend into this response. My current mock fetches them separately.
```

```javascript
// ─────────────────────────────────────────────
// GET all categories
// ─────────────────────────────────────────────
GET /api/categories

// 📁 Integration Point: src/services/api.js → Line 71 (api.courses.getCategories)
// ✅ Status: Integrated (Decoupled)

Response:
[
  {
    id: 1,
    name: "Development",
    count: 120,
    icon: "Code2",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    id: 5,
    name: "Photography",
    count: 56,
    icon: "Camera",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10"
  }
]
```

```javascript
// ─────────────────────────────────────────────
// GET testimonials (landing page)
// ─────────────────────────────────────────────
GET /api/testimonials

// 📁 Integration Point: src/services/api.js → Line 454 (api.testimonials.getAll)
// ✅ Status: Integrated

Response:
[
  {
    id: number,
    name: string,
    role: string,            // "Software Engineer"
    image: string,           // student image URL
    content: string,         // review text
    rating: number           // 1-5 stars
  }
]
```

```javascript
// ─────────────────────────────────────────────
// GET all instructors (public listing)
// ─────────────────────────────────────────────
GET /api/instructors

// 📁 Integration Point: src/services/api.js → Line 84 (api.instructors.getAll)
// ✅ Status: Integrated

Response:
[
  {
    id: number,
    name: string,
    role: string,            // "AI Researcher & Educator"
    avatar: string,
    bio: string,
    coursesCount: number,
    studentsCount: number,   // 2500 - 4000
    rating: number,
    category: string
  }
]

// 📝 Note: Frontend is responsible for formatting numbers (e.g., 12000 → 12K+)
```

---

## Learner

```javascript
// ─────────────────────────────────────────────
// GET learner dashboard stats
// ─────────────────────────────────────────────
GET /api/learner/stats

// 📁 Integration Point: src/services/api.js → Line 116 (api.learner.getStats)
// ✅ Status: Integrated (via api.learner methods)
// 🔑 Header: Authorization: Bearer <token>

Response:
{
  hoursWatched: number,      // total watch hours
  certificates: number,     // earned certificates count
  coursesInProgress: number
}
```

```javascript
// ─────────────────────────────────────────────
// GET learner enrolled courses + progress
// ─────────────────────────────────────────────
GET /api/learner/progress

// 📁 Integration Point: src/services/api.js → Line 96 (api.learner.getProgress)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    courseId: number,
    title: string,
    progress: number,        // 0-100 percentage
    lastLesson: string,      // "Understanding Neural Networks and Deep Learning"
    image: string
  }
]
```

```javascript
// ─────────────────────────────────────────────
// GET learner recommendations
// ─────────────────────────────────────────────
GET /api/learner/recommendations

// 📁 Integration Point: src/services/api.js → Line 125 (api.learner.getRecommendations)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    id: number,
    title: string,
    instructor: string,
    image: string,
    price: number,
    rating: number
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST purchase a course (checkout)
// ─────────────────────────────────────────────
POST /api/checkout/:courseId

// 📁 File: src/pages/checkout/CheckoutPage.jsx
// 🔄 Replace: localStorage.setItem('purchasedCourses', ...) logic
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  paymentMethod: "stripe" | "paypal",
  paymentToken: string
}

Response:
{
  success: true,
  transactionId: string
}
```

```javascript
// ─────────────────────────────────────────────
// GET check if user purchased a course
// ─────────────────────────────────────────────
GET /api/learner/purchases/:courseId

// 📁 File: src/pages/courses/CourseDetailsPage.jsx → Line ~30
// 🔄 Replace: localStorage.getItem('purchasedCourses') check
// 🔑 Header: Authorization: Bearer <token>

Response:
{
  purchased: boolean,
  purchaseDate: string | null
}
```

---

## Instructor

```javascript
// ─────────────────────────────────────────────
// GET instructor dashboard stats
// ─────────────────────────────────────────────
GET /api/instructor/stats

// 📁 Integration Point: src/services/api.js → Line 143 (api.instructor.getStats)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>
// ⚠️ Note: Backend MUST return numeric values for currency, NOT strings like "$12,450"

Response:
{
  totalStudents: number,
  totalRevenue: number,      // e.g. 24500
  avgRating: number,         // e.g. 4.8
  totalReviews: number,
  activeCourses: number,
  pendingReview: number      // courses pending admin review
}
```

```javascript
// ─────────────────────────────────────────────
// GET instructor's courses list
// ─────────────────────────────────────────────
GET /api/instructor/courses

// 📁 Integration Point: src/services/api.js → Line 156 (api.instructor.courses.getAll)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    id: number,
    title: string,
    students: number,
    status: "published" | "draft",
    revenue: number,         // e.g. 1200.50
    image: string
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST create new course
// ─────────────────────────────────────────────
POST /api/instructor/courses

// 📁 Used in: src/pages/instructor/InstructorDashboardPage.jsx (handleSave)
// ✅ Status: Integrated (via api.instructor.courses.create)
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  title: string,
  status: "draft" | "published",
  price: number
}

Response:
{
  id: number,
  title: string,
  status: "draft",
  students: 0,
  revenue: 0
}
```

```javascript
// ─────────────────────────────────────────────
// PUT update existing course
// ─────────────────────────────────────────────
PUT /api/instructor/courses/:id

// 📁 Used in: src/pages/instructor/InstructorDashboardPage.jsx (editingCourse branch)
// ✅ Status: Integrated (via api.instructor.courses.update)
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  title: string,
  status: "draft" | "published",
  price: number
}

Response:
{
  id: number,
  title: string,
  status: string,
  students: number,
  revenue: number
}
```

```javascript
// ─────────────────────────────────────────────
// DELETE instructor course
// ─────────────────────────────────────────────
DELETE /api/instructor/courses/:id

// 📁 Used in: src/pages/instructor/InstructorDashboardPage.jsx (handleDelete)
// ✅ Status: Integrated (via api.instructor.courses.delete)
// 🔑 Header: Authorization: Bearer <token>

Response:
{ success: true }
```

```javascript
// ─────────────────────────────────────────────
// GET instructor lectures/videos
// ─────────────────────────────────────────────
GET /api/instructor/lectures

// 📁 Used in: src/pages/instructor/InstructorLecturesPage.jsx
// ✅ Status: Integrated (via api.instructor.lectures.getAll)
// 📝 Note: selectedCourseId can be numeric ID or "all" to fetch all instructor videos.

Response:
[
  {
    id: number,
    title: string,
    course: string,          // course name
    courseId: number,
    views: number,           // raw number
    duration: number,        // Total seconds (MM:SS is formatted by UI)
    status: "published" | "pending" | "draft",
    date: "YYYY-MM-DD",
    thumbnail: string        // URL
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST upload new lecture/video
// ─────────────────────────────────────────────
POST /api/instructor/lectures

// 📁 Used in: src/pages/instructor/InstructorLecturesPage.jsx (handleAddVideo)
// ✅ Status: Integrated (via api.instructor.lectures.create)
// 🔑 Header: Authorization: Bearer <token>
// 📦 Content-Type: multipart/form-data (for file uploads)

Request (FormData):
{
  title: string,
  course: string,            // course name for display
  courseId: number,          // ⚠️ Required: linking to a course
  duration: number,           // Total numeric seconds (REQUIRED)
  status: "published" | "draft" | "pending",
  videoFile: File,           // the actual video file
  resources: File[],         // PDF, docs, etc.
  quiz: JSON string [       // optional quiz data
    { question: string, options: string[], correctAnswer: number }
  ]
}

Response:
{
  id: number,
  title: string,
  course: string,
  status: string,
  thumbnail: string
}
```

```javascript
// ─────────────────────────────────────────────
// PUT update lecture
// ─────────────────────────────────────────────
PUT /api/instructor/lectures/:id

// 📁 Used in: src/pages/instructor/InstructorLecturesPage.jsx (handleUpdateVideo)
// ✅ Status: Integrated (via api.instructor.lectures.update)
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  title: string,
  course: string,
  duration: number | string, // Total seconds or "MM:SS"
  status: string
}

Response:
{
  id: number,
  title: string,
  course: string,
  duration: number
}
```

```javascript
// ─────────────────────────────────────────────
// DELETE lecture
// ─────────────────────────────────────────────
DELETE /api/instructor/lectures/:id

// 📁 Used in: src/pages/instructor/InstructorLecturesPage.jsx (handleDeleteVideo)
// ✅ Status: Integrated (via api.instructor.lectures.delete)
// 🔑 Header: Authorization: Bearer <token>

Response:
{ success: true }
```

```javascript
// ─────────────────────────────────────────────
// PATCH toggle lecture publish status
// ─────────────────────────────────────────────
PATCH /api/instructor/lectures/:id/toggle

// 📁 Used in: src/pages/instructor/InstructorLecturesPage.jsx (togglePublish)
// ✅ Status: Integrated (via api.instructor.lectures.toggleStatus)
// 🔑 Header: Authorization: Bearer <token>

Response:
{
  id: number,
  status: "published" | "draft"   // toggled status
}
```

```javascript
// ─────────────────────────────────────────────
// GET instructor reviews (from students)
// ─────────────────────────────────────────────
GET /api/instructor/reviews

// 📁 Integration Point: src/services/api.js → Line 226 (api.instructor.reviews.getAll)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    id: number,
    studentName: string,
    avatar: string,
    course: string,
    rating: number,          // 1-5
    review: string,
    date: string,            // "3 hours ago" or ISO date
    reply: string | null     // instructor's reply (null if not replied)
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST reply to a review
// ─────────────────────────────────────────────
POST /api/instructor/reviews/:id/reply

// 📁 Integration Point: src/services/api.js → Line 230 (api.instructor.reviews.reply)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  reply: string
}

Response:
{
  id: number,
  reply: string
}
```

```javascript
// ─────────────────────────────────────────────
// GET instructor Q&A questions
// ─────────────────────────────────────────────
GET /api/instructor/questions

// 📁 Integration Point: src/services/api.js → Line 237 (api.instructor.questions.getAll)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    id: number,
    studentName: string,
    avatar: string,
    course: string,
    question: string,
    date: string,
    status: "pending" | "resolved",
    reply: string | null
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST reply to a Q&A question
// ─────────────────────────────────────────────
POST /api/instructor/questions/:id/reply

// 📁 Integration Point: src/services/api.js → Line 241 (api.instructor.questions.reply)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  reply: string
}

Response:
{
  id: number,
  status: "resolved",
  reply: string
}
```

```javascript
// ─────────────────────────────────────────────
// GET instructor announcements history
// ─────────────────────────────────────────────
GET /api/instructor/announcements

// 📁 Integration Point: src/services/api.js → Line 248 (api.instructor.announcements.getAll)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    id: number,
    course: string,          // course name or "All Courses"
    subject: string,
    message: string,
    date: string,
    sentTo: number           // number of students reached
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST send new announcement
// ─────────────────────────────────────────────
POST /api/instructor/announcements

// 📁 Integration Point: src/services/api.js → Line 253 (api.instructor.announcements.create)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  courseId: string | "all",  // target course or all
  subject: string,
  message: string
}

Response:
{
  id: number,
  course: string,
  subject: string,
  message: string,
  date: string,
  sentTo: number
}
```

---

## Admin

```javascript
// ─────────────────────────────────────────────
// GET admin dashboard stats
// ─────────────────────────────────────────────
GET /api/admin/stats

// 📁 Integration Point: src/services/api.js → Line 263 (api.admin.stats.getOverview)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Response:
{
  totalStudents: number,      // e.g. 1540
  activeCourses: number,     
  totalRevenue: number,      // e.g. 85000
  totalInstructors: number,
  videosUploaded: number,
  userGrowth: number,        // percentage
  recentActivity: [
    {
      id: number,
      user: string,          // "Ahmed Ali"
      action: string,        // "Purchased: Machine Learning"
      time: string           // "5m ago"
    }
  ]
}
```

```javascript
// ─────────────────────────────────────────────
// GET all users (admin management)
// ─────────────────────────────────────────────
GET /api/admin/users?search=X&role=Y&status=Z&page=1&limit=10

// 📁 Integration Point: src/services/api.js → Line 286 (api.admin.users.getAll)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Response:
{
  users: [
    {
      id: number,
      name: string,
      email: string,
      role: "learner" | "instructor" | "admin",
      status: "active" | "suspended",
      joined: "YYYY-MM-DD",
      avatar: string
    }
  ],
  total: number,
  page: number,
  limit: number
}
```

```javascript
// ─────────────────────────────────────────────
// POST add new user (admin)
// ─────────────────────────────────────────────
POST /api/admin/users

// 📁 Integration Point: src/services/api.js → Line 297 (api.admin.users.create)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Request:
{
  name: string,
  email: string,
  role: "learner" | "instructor" | "admin",
  status: "active" | "suspended"
}

Response:
{
  id: number,
  name: string,
  email: string,
  role: string,
  status: string,
  joined: string,
  avatar: string
}
```

```javascript
// ─────────────────────────────────────────────
// PUT update user (admin)
// ─────────────────────────────────────────────
PUT /api/admin/users/:id

// 📁 Integration Point: src/services/api.js → Line 301 (api.admin.users.update)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Request:
{
  name: string,
  email: string,
  role: string,
  status: string
}

Response:
{ ...updated user object }
```

```javascript
// ─────────────────────────────────────────────
// DELETE user (admin)
// ─────────────────────────────────────────────
DELETE /api/admin/users/:id

// 📁 Integration Point: src/services/api.js → Line 305 (api.admin.users.delete)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Response:
{ success: true }
```

```javascript
// ─────────────────────────────────────────────
// PATCH toggle user status (suspend/activate)
// ─────────────────────────────────────────────
PATCH /api/admin/users/:id/status

// 📁 Integration Point: src/services/api.js → Line 309 (api.admin.users.toggleStatus)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Request:
{
  status: "active" | "suspended"
}

Response:
{
  id: number,
  status: "active" | "suspended"
}
```

```javascript
// ─────────────────────────────────────────────
// GET all courses (admin management)
// ─────────────────────────────────────────────
GET /api/admin/courses

// 📁 Integration Point: src/services/api.js → Line 316 (api.admin.courses.getAll)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Response:
[
  {
    id: number,
    title: string,
    instructor: string,
    category: string,
    price: number,
    discount: number,
    image: string,
    rating: number,
    reviews: number,
    level: string,
    lessons: number,
    duration: number
  }
]
```

```javascript
// ─────────────────────────────────────────────
// PUT update course (admin)
// ─────────────────────────────────────────────
PUT /api/admin/courses/:id

// 📁 Integration Point: src/services/api.js → Line 320 (api.admin.courses.update)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  title: string,
  price: number,
  discount: number,
  category: string,
  level: string,
  image: string,
  status: "published" | "draft",
  instructor: string,
  instructorId: number,
  description: string,
  lessons: number,
  duration: number,
  rating: number,
  reviews: number
}

Response:
{
  success: true,
  data: {
    id: number,
    title: string,
    // ... all updated fields
  }
}
```

```javascript
// ─────────────────────────────────────────────
// DELETE course (admin)
// ─────────────────────────────────────────────
DELETE /api/admin/courses/:id

// 📁 Integration Point: src/services/api.js → Line 325 (api.admin.courses.delete)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token> (admin only)

Response:
{ success: true }
```

---

## AI

```javascript
// ─────────────────────────────────────────────
// POST AI tutor chat message
// ─────────────────────────────────────────────
POST /api/ai/chat

// 📁 Integration Point: src/services/api.js → Line 380 (api.ai.chat)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  message: string,
  context: {
    courseId: number | null,
    lectureId: number | null,
    videoTimestamp: number | null   // numeric seconds (e.g., 540 for 09:00)
  }
}

Response:
{
  message: string           // AI-generated answer (markdown supported)
}

// 📝 Note: Future updates may include 'sources' (array of lectures/timestamps)
// to cite specific parts of the course.

// ❓ Question for Backend:
// Will the response be:
//   a) Standard JSON
//   b) Streaming (Server-Sent Events)?
// 📝 Explanation: This decision affects frontend implementation (real-time typing vs full response rendering).
```

---

## AI Video Assistant (CRITICAL)

This section defines how the AI connects to real-time video playback. The frontend currently simulates a "watch-along" experience that must be powered by the backend.

### Current Frontend Logic:
- **Pause Detection**: Frontend detects when a user pauses the video.
- **Auto AI Suggestion**: If the video is paused for > 3 seconds, the frontend triggers an "auto_prompt" to the AI.
- **Context Awareness**: The frontend tracks `currentTime` and `lectureId` to provide context for AI responses.
- **Timeline Markers**: UI markers are added whenever the AI suggests something or the user asks a question.

### POST /api/ai/video-assistant
**Purpose**: Handles both automatic AI suggestions on pause and manual user questions.

// 📁 Integration Point: src/services/api.js → Line 410 (api.ai.videoAssistant)
// ✅ Status: Integrated
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  lectureId: number,          // ID of the video being watched
  currentTime: number,        // current timestamp in seconds (e.g., 125.5)
  action: "chat" | "auto_prompt" | "explain-section" | "summarize" | "explain-scene" | "create-quiz" | "show-code",
  query?: string              // the actual text or question from the user
}

Response:
{
  message: string,            // The AI's response text (supports Markdown)
  suggested: boolean,         // true if this was an auto-prompt suggestion
  relatedSegment?: {          // Optional: point the user to a specific video segment
    start: number,
    end: number
  }
}

### 🧠 Backend Implementation Note:
1. **action = "auto_prompt"**:
   - Triggered when the user pauses.
   - Backend should return a helpful suggestion like: *"I noticed you paused here. Would you like me to explain the last 30 seconds of this section?"*
   
2. **action = "user_question"**:
   - Triggered when the user types a question.
   - Backend responds using the `currentTime` and `lectureId` as context.

3. **Markers & Future Support**:
   - Currently, markers are managed by the frontend UI.
   - Transcript support is NOT required for the initial phase.

