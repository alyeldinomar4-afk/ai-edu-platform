# API INTEGRATION PLAN - NEXORA AI EDU PLATFORM
# ══════════════════════════════════════════════════════════════
# 📁 Main Integration File: src/services/api.js (Line 25+)
# 📁 Auth Integration File: src/services/authService.js (Line 33+)
# 📁 Mock Data File:        src/data/mockData.js (DELETE after full integration)
# ══════════════════════════════════════════════════════════════
# ⚙️ BASE_URL: set in src/services/api.js Line 7
# 🔑 Token: stored in localStorage key 'ai_edu_token'
# 👤 User: stored in localStorage key 'ai_edu_user'
# ══════════════════════════════════════════════════════════════


## Authentication

```javascript
// ─────────────────────────────────────────────
// POST login
// ─────────────────────────────────────────────
POST /api/auth/login

// 📁 File: src/services/authService.js → Line 35
// 🔄 Replace: Mock login with hardcoded users (admin@edu.com, user@test.com, instructor@test.com)
// 📝 Note: Currently checks localStorage 'ai_edu_users_db' array

Request:
{
  email: string,       // "user@example.com"
  password: string     // "password123"
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
// 🔄 Replace: localStorage user creation
// ⚠️ Password is stored as plain text in mock! Backend MUST hash it

Request:
{
  name: string,        // "Ahmed Mansour"
  email: string,       // "ahmed@example.com"
  password: string,    // "password123"
  role: "learner" | "instructor"
}

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
// 🔄 Replace: localStorage.getItem('ai_edu_user')
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
// 🔄 Replace: localStorage.removeItem calls
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

// 📁 Files that use this:
//   - src/pages/HomePage.jsx → Line 1 (import { courses } from mockData)
//   - src/pages/courses/CoursesPage.jsx → Line 4 (import { courses } from mockData)
//   - src/services/api.js → Line 30 (api.courses.getAll)
// 🔄 Replace: Direct import of 'courses' array from mockData.js

Response:
{
  courses: [
    {
      id: number,
      title: string,
      instructor: string,   // instructor display name
      instructorId: number,  // for linking to instructor profile
      rating: number,        // 0-5
      reviews: number,       // total review count
      price: number,         // e.g. 49.99
      discount: number,      // percentage, e.g. 20
      image: string,         // full URL to course thumbnail
      category: string,      // "Data Science", "Development", etc.
      level: string,         // "Beginner", "Intermediate", "Advanced"
      duration: string,      // "12h 30m"
      lessons: number        // total lesson count
    }
  ],
  total: number,             // total courses (for pagination)
  page: number,
  limit: number
}
```

```javascript
// ─────────────────────────────────────────────
// GET single course details
// ─────────────────────────────────────────────
GET /api/courses/:id

// 📁 Files:
//   - src/pages/courses/CourseDetailsPage.jsx → Line 12 (courses.find(c => c.id === parseInt(id)))
//   - src/services/api.js → Line 47 (api.courses.getById)
// 🔄 Replace: courses.find() from mockData

Response:
{
  id: number,
  title: string,
  description: string,      // full HTML or markdown description
  instructor: string,
  instructorId: number,
  price: number,
  discount: number,
  image: string,
  category: string,
  level: string,
  duration: string,
  lessons: number,
  rating: number,
  reviews: number,
  highlights: string[],      // ["Build ML models", "Learn Python", ...]
  curriculum: [
    {
      sectionTitle: string,  // "Section 1: Introduction"
      lectures: [
        {
          id: number,
          title: string,
          duration: string,  // "10:25"
          isFree: boolean    // preview lectures
        }
      ]
    }
  ],
  reviewsList: [
    {
      id: number,
      name: string,
      avatar: string,
      rating: number,
      comment: string,
      date: string           // "2 days ago" or ISO date
    }
  ]
}
```

```javascript
// ─────────────────────────────────────────────
// GET all categories
// ─────────────────────────────────────────────
GET /api/categories

// 📁 Files:
//   - src/pages/HomePage.jsx → Line 1 (import { categories } from mockData)
//   - src/pages/courses/CoursesPage.jsx → Line 4 (import { categories } from mockData)
//   - src/services/api.js → Line 55 (api.courses.getCategories)
// 🔄 Replace: Direct import of 'categories' array

Response:
[
  {
    id: number,
    name: string,        // "Data Science"
    count: number,       // number of courses in category
    icon: string,        // icon name (used in frontend: "Brain", "Code", etc.)
    color: string,       // CSS class or hex
    bgColor: string      // CSS class or hex
  }
]
```

```javascript
// ─────────────────────────────────────────────
// GET testimonials (landing page)
// ─────────────────────────────────────────────
GET /api/testimonials

// 📁 File: src/pages/HomePage.jsx → Line 1 (import { testimonials } from mockData)
// 🔄 Replace: Direct import of 'testimonials' array

Response:
[
  {
    id: number,
    name: string,
    role: string,            // "Data Analyst at Google"
    image: string,           // avatar URL
    content: string,         // review text
    rating: number
  }
]
```

```javascript
// ─────────────────────────────────────────────
// GET all instructors (public listing)
// ─────────────────────────────────────────────
GET /api/instructors

// 📁 Files:
//   - src/pages/HomePage.jsx → Line 1 (import { instructors } from mockData - top 3)
//   - src/pages/instructor/InstructorsPage.jsx → Line 4 (import { instructors } from mockData)
// 🔄 Replace: Direct import of 'instructors' array

Response:
[
  {
    id: number,
    name: string,
    role: string,            // "Senior Data Scientist"
    avatar: string,
    bio: string,
    coursesCount: number,
    studentsCount: string,   // "12K+"
    rating: number
  }
]
```

---

## Learner

```javascript
// ─────────────────────────────────────────────
// GET learner dashboard stats
// ─────────────────────────────────────────────
GET /api/learner/stats

// 📁 File: src/services/api.js → Line 66 (api.learner.getStats)
// 📁 Used in: src/pages/learner/LearnerDashboardPage.jsx → Line 18
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

// 📁 File: src/services/api.js → Line 76 (api.learner.getProgress)
// 📁 Used in: src/pages/learner/LearnerDashboardPage.jsx → Line 19
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    courseId: number,
    title: string,
    progress: number,        // 0-100 percentage
    lastLesson: string,      // "Lecture 5: Neural Networks"
    image: string
  }
]
```

```javascript
// ─────────────────────────────────────────────
// GET learner recommendations
// ─────────────────────────────────────────────
GET /api/learner/recommendations

// 📁 File: src/services/api.js → Line 91 (api.learner.getRecommendations)
// 📁 Used in: src/pages/learner/LearnerDashboardPage.jsx → Line 20
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

// 📁 File: src/services/api.js → Line 107 (api.instructor.getStats)
// 📁 Used in: src/pages/instructor/InstructorDashboardPage.jsx → Line 28
// 🔑 Header: Authorization: Bearer <token>
// ⚠️ Note: totalRevenue is currently string "$12,450" — Backend should return number

Response:
{
  totalStudents: number,
  totalRevenue: number,      // ⚠️ Changed from string to number
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

// 📁 File: src/services/api.js → Line 121 (api.instructor.getCourses)
// 📁 Used in: src/pages/instructor/InstructorDashboardPage.jsx → Line 29
// 🔑 Header: Authorization: Bearer <token>

Response:
[
  {
    id: number,
    title: string,
    students: number,
    status: "Published" | "Draft",
    revenue: number,         // ⚠️ Changed from string "$1,200" to number
    image: string
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST create new course
// ─────────────────────────────────────────────
POST /api/instructor/courses

// 📁 File: src/pages/instructor/InstructorDashboardPage.jsx → Line 54 (handleSave)
// 🔄 Replace: await new Promise(resolve => setTimeout(resolve, 800)) + local state push
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  title: string,
  status: "Draft" | "Published",
  price: number
}

Response:
{
  id: number,
  title: string,
  status: "Draft",
  students: 0,
  revenue: 0
}
```

```javascript
// ─────────────────────────────────────────────
// PUT update existing course
// ─────────────────────────────────────────────
PUT /api/instructor/courses/:id

// 📁 File: src/pages/instructor/InstructorDashboardPage.jsx → Line 66 (editingCourse branch)
// 🔄 Replace: setCourses(prev => prev.map(...)) local state update
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  title: string,
  status: "Draft" | "Published",
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

// 📁 File: src/pages/instructor/InstructorDashboardPage.jsx → Line 84 (handleDelete)
// 🔄 Replace: setCourses(prev => prev.filter(...))
// 🔑 Header: Authorization: Bearer <token>

Response:
{ success: true }
```

```javascript
// ─────────────────────────────────────────────
// GET instructor lectures/videos
// ─────────────────────────────────────────────
GET /api/instructor/lectures

// 📁 File: src/pages/instructor/InstructorLecturesPage.jsx → Line 24
//          import { lectures } from '../../data/mockData'
// 🔄 Replace: const [videos, setVideos] = useState(lectures) at Line 56

Response:
[
  {
    id: number,
    title: string,
    course: string,          // course name
    courseId: number,
    views: string,           // "1.2K"
    duration: string,        // "12:45"
    status: "published" | "pending" | "draft",
    date: string,            // "2024-01-15"
    thumbnail: string        // URL
  }
]
```

```javascript
// ─────────────────────────────────────────────
// POST upload new lecture/video
// ─────────────────────────────────────────────
POST /api/instructor/lectures

// 📁 File: src/pages/instructor/InstructorLecturesPage.jsx → Line 87 (handleAddVideo)
// 🔄 Replace: await new Promise(resolve => setTimeout(resolve, 800)) + local state
// 🔑 Header: Authorization: Bearer <token>
// 📦 Content-Type: multipart/form-data (for file uploads)

Request (FormData):
{
  title: string,
  course: string,
  duration: string,
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

// 📁 File: src/pages/instructor/InstructorLecturesPage.jsx → Line 108 (handleUpdateVideo)
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  title: string,
  course: string,
  duration: string,
  status: string
}

Response:
{ ...updated lecture object }
```

```javascript
// ─────────────────────────────────────────────
// DELETE lecture
// ─────────────────────────────────────────────
DELETE /api/instructor/lectures/:id

// 📁 File: src/pages/instructor/InstructorLecturesPage.jsx → Line 72 (handleDeleteVideo)
// 🔑 Header: Authorization: Bearer <token>

Response:
{ success: true }
```

```javascript
// ─────────────────────────────────────────────
// PATCH toggle lecture publish status
// ─────────────────────────────────────────────
PATCH /api/instructor/lectures/:id/toggle

// 📁 File: src/pages/instructor/InstructorLecturesPage.jsx → Line 77 (togglePublish)
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

// 📁 File: src/pages/instructor/InstructorReviewsPage.jsx → Line 10
// 🔄 Replace: const initialReviews = [...] hardcoded array
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

// 📁 File: src/pages/instructor/InstructorReviewsPage.jsx → Line 73 (handleSaveReply)
// 🔄 Replace: setReviews(prev => prev.map(...)) local state
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

// 📁 File: src/pages/instructor/InstructorQAPage.jsx → Line 10
// 🔄 Replace: const initialQuestions = [...] hardcoded array
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

// 📁 File: src/pages/instructor/InstructorQAPage.jsx → Line 60 (handleReply)
// 🔄 Replace: local state update + status change to 'resolved'
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

// 📁 File: src/pages/instructor/InstructorAnnouncementsPage.jsx → Line 16
// 🔄 Replace: const initialAnnouncements = [...] hardcoded array
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

// 📁 File: src/pages/instructor/InstructorAnnouncementsPage.jsx → Line 46 (handleSend)
// 🔄 Replace: setTimeout + local state push
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

// 📁 File: src/pages/admin/AdminDashboardPage.jsx → Line 44-47
// 🔄 Replace: Hardcoded values "12,345", "142", "1,204", "$45,678"
// 🔑 Header: Authorization: Bearer <token> (admin only)

Response:
{
  totalUsers: number,
  activeCourses: number,
  videosUploaded: number,
  totalRevenue: number,
  revenueChart: number[],    // [40, 60, 45, 70, 65, 85, 95] - 7 data points
  recentActivity: [
    {
      type: string,          // "new_user", "new_course", etc.
      message: string,
      date: string
    }
  ]
}
```

```javascript
// ─────────────────────────────────────────────
// GET all users (admin management)
// ─────────────────────────────────────────────
GET /api/admin/users?search=X&role=Y&status=Z&page=1&limit=10

// 📁 File: src/pages/admin/ManageUsersPage.jsx → Line 31
// 🔄 Replace: const [users, setUsers] = useState([...hardcoded array])
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

// 📁 File: src/pages/admin/ManageUsersPage.jsx → Line 51 (handleAddUser)
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

// 📁 File: src/pages/admin/ManageUsersPage.jsx → Line 64 (handleUpdateUser)
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

// 📁 File: src/pages/admin/ManageUsersPage.jsx → Line 71 (handleDeleteUser)
// 🔑 Header: Authorization: Bearer <token> (admin only)

Response:
{ success: true }
```

```javascript
// ─────────────────────────────────────────────
// PATCH toggle user status (suspend/activate)
// ─────────────────────────────────────────────
PATCH /api/admin/users/:id/status

// 📁 File: src/pages/admin/ManageUsersPage.jsx → Line 77 (toggleStatus)
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

// 📁 File: src/pages/admin/ManageCoursesPage.jsx → Line 3
//          import { courses } from '../../data/mockData'
// 🔄 Replace: const [courseList, setCourseList] = useState(courses)
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
    duration: string
  }
]
```

```javascript
// ─────────────────────────────────────────────
// PUT update course (admin)
// ─────────────────────────────────────────────
PUT /api/admin/courses/:id

// 📁 File: src/pages/admin/ManageCoursesPage.jsx → Line 40 (handleSave edit branch)
// 🔑 Header: Authorization: Bearer <token> (admin only)

Request:
{
  title: string,
  instructor: string,
  category: string,
  price: number,
  discount: number
}

Response:
{ ...updated course object }
```

```javascript
// ─────────────────────────────────────────────
// DELETE course (admin)
// ─────────────────────────────────────────────
DELETE /api/admin/courses/:id

// 📁 File: src/pages/admin/ManageCoursesPage.jsx → Line 57 (handleDelete)
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

// 📁 Files:
//   - src/pages/AIDemoPage.jsx (demo chat)
//   - src/pages/course/VideoPlayerPage.jsx (contextual chat during video)
//   - src/services/api.js → Line 155 (api.ai.chat)
// 🔄 Replace: Hardcoded AI response
// 🔑 Header: Authorization: Bearer <token>

Request:
{
  message: string,
  context: {
    courseId: number | null,
    lectureId: number | null,
    videoTimestamp: string | null   // "05:32"
  }
}

Response:
{
  response: string,          // AI-generated answer (markdown supported)
  sources: [
    {
      title: string,         // "Lecture 3: Data Preprocessing"
      timestamp: string      // "02:15"
    }
  ]
}
```

---

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
   Set in: src/services/api.js → Line 7
   Current value: '/api' (change to full URL if separate server)

5. FILE UPLOADS:
   Lectures page supports video + resource file uploads
   Use multipart/form-data for POST /api/instructor/lectures

6. DATA TYPE FIXES:
   - Instructor revenue: change from string "$12,450" → number 12450
   - Lecture views: change from string "1.2K" → number 1200
   - Admin stats: change from hardcoded strings → real numbers

7. PAGINATION:
   ManageUsersPage has pagination UI ready (prev/next buttons)
   Send: { page, limit, total } in paginated responses

8. MOCK FILES TO DELETE AFTER FULL INTEGRATION:
   - src/data/mockData.js (entire file)
   - Remove mock delays in src/services/api.js
   - Remove localStorage user DB in src/services/authService.js
```
