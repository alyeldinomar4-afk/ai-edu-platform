# API INTEGRATION PLAN - AI EDU PLATFORM

## Authentication

```javascript
// POST login user
POST /api/auth/login

// File: AuthContext.jsx -> services/authService.js
// Replace: authService.login mock implementation

Request:
{
  email: "user@example.com",
  password: "password123"
}

Response:
{
  user: { id: 1, name: "Ahmed", email: "ahmed@example.com", role: "learner" },
  token: "jwt_token_here"
}
```

```javascript
// POST register user
POST /api/auth/register

// File: AuthContext.jsx -> services/authService.js
// Replace: authService.register mock implementation

Request:
{
  name: "Ahmed Mansour",
  email: "ahmed@example.com",
  password: "password123",
  role: "learner" | "instructor"
}

Response:
{
  user: { id: 1, name: "Ahmed Mansour", email: "ahmed@example.com", role: "learner" },
  token: "jwt_token_here"
}
```

```javascript
// GET current user profile
GET /api/auth/me

// File: AuthContext.jsx
// Header: Authorization: Bearer <token>

Response:
{
  id: 1,
  name: "Ahmed Mansour",
  email: "ahmed@example.com",
  role: "learner",
  avatar: "url_to_image"
}
```

---

## Courses

```javascript
// GET all courses with filters
GET /api/courses?category=X&search=Y&level=Z

// File: HomePage.jsx, CoursesPage.jsx
// Replace: import { courses } from '../../data/mockData'

Response:
[
  {
    id: number,
    title: string,
    instructor: string,
    rating: number,
    reviews: number,
    price: number,
    discount: number,
    image: string,
    category: string,
    level: string,
    duration: string,
    lessons: number
  }
]
```

```javascript
// GET single course details
GET /api/courses/:id

// File: CourseDetailsPage.jsx, VideoPlayerPage.jsx
// Replace: courses.find(c => c.id === parseInt(id))

Response:
{
  id: number,
  title: string,
  description: string,
  instructor: string,
  price: number,
  image: string,
  highlights: string[],
  curriculum: [
    {
      sectionTitle: string,
      lectures: [
        { id: number, title: string, duration: string, isFree: boolean }
      ]
    }
  ],
  reviews: [
    { name: string, rating: number, comment: string, date: string }
  ]
}
```

```javascript
// GET all categories
GET /api/categories

// File: HomePage.jsx, CoursesPage.jsx
// Replace: import { categories } from '../../data/mockData'

Response:
[
  { id: number, name: string, count: number, icon: string, color: string, bgColor: string }
]
```

---

## Learner

```javascript
// GET learner dashboard stats
GET /api/learner/stats

// File: LearnerDashboardPage.jsx
// Replace: api.learner.getStats() mock in services/api.js

Response:
{
  hoursWatched: number,
  certificates: number,
  coursesInProgress: number
}
```

```javascript
// GET learner enrolled courses progress
GET /api/learner/progress

// File: LearnerDashboardPage.jsx
// Replace: api.learner.getProgress() mock in services/api.js

Response:
[
  {
    courseId: number,
    title: string,
    progress: number,
    lastLesson: string,
    image: string
  }
]
```

```javascript
// POST purchase a course
POST /api/checkout/:courseId

// File: CheckoutPage.jsx
// Replace: localStorage.setItem('purchasedCourses', ...) logic

Request:
{
  paymentMethod: "stripe" | "paypal",
  paymentToken: "tok_xxxx"
}

Response:
{
  success: true,
  transactionId: "trx_xxxx"
}
```

---

## Instructor

```javascript
// GET instructor dashboard stats
GET /api/instructor/stats

// File: InstructorDashboardPage.jsx
// Replace: api.instructor.getStats() mock in services/api.js

Response:
{
  totalStudents: number,
  totalRevenue: string,
  avgRating: number,
  totalReviews: number,
  activeCourses: number,
  pendingReview: number
}
```

```javascript
// POST create new course
POST /api/instructor/courses

// File: InstructorDashboardPage.jsx
// Replace: handleSave logic (local state update)

Request:
{
  title: string,
  category: string,
  price: number,
  description: string
}

Response:
{
  id: number,
  title: string,
  status: "Draft"
}
```

```javascript
// GET instructor's lectures for a specific course
GET /api/instructor/courses/:courseId/lectures

// File: InstructorLecturesPage.jsx
// Replace: import { lectures } from '../../data/mockData'

Response:
[
  {
    id: number,
    title: string,
    views: number,
    duration: string,
    status: "published" | "pending",
    date: string,
    thumbnail: string
  }
]
```

---

## Admin

```javascript
// GET admin dashboard overview stats
GET /api/admin/stats

// File: AdminDashboardPage.jsx
// Replace: api.admin.getStats() mock in services/api.js

Response:
{
  totalUsers: number,
  activeCourses: number,
  totalRevenue: number,
  activeUsers: number
}
```

```javascript
// GET all users management
GET /api/admin/users

// File: ManageUsersPage.jsx
// Replace: initial users state array

Response:
[
  {
    id: number,
    name: string,
    email: string,
    role: "learner" | "instructor" | "admin",
    status: "active" | "suspended",
    joined: "YYYY-MM-DD",
    avatar: string
  }
]
```

```javascript
// DELETE user
DELETE /api/admin/users/:id

// File: ManageUsersPage.jsx
// Replace: handleDeleteUser logic

Response:
{
  success: true
}
```

---

## AI

```javascript
// POST AI chat message
POST /api/ai/chat

// File: AIDemoPage.jsx, VideoPlayerPage.jsx
// Replace: api.ai.chat() mock in services/api.js

Request:
{
  message: string,
  context: {
    courseId: number,
    videoTimestamp: "MM:SS"
  }
}

Response:
{
  response: string,
  sources: [ { title: string, timestamp: string } ]
}
```

---

// 📌 Bonus Notes:
// - All POST/PUT/DELETE requests MUST include Authorization Header.
// - Repetitive data fetching in HomePage and CoursesPage should be unified via hooks.
// - Course images are currently Unsplash URLs; backend should provide stable URLs.
// - State not connected properly: Instructor Dashboard "Revenue" is currently string "$0" in mock, should be float.
