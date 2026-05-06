# 🚀 NEXORA AI - EXTREME API MIGRATION GUIDE
# ══════════════════════════════════════════════════════════════
# THIS DOCUMENT IS A STEP-BY-STEP TECHNICAL MANUAL FOR BACKEND DEVELOPERS.
# IT CONTAINS THE EXACT CODE TO REMOVE AND THE EXACT CODE TO INSERT.
# ══════════════════════════════════════════════════════════════

## 🛠️ PHASE 1: Global Infrastructure (REQUIRED)

Before modifying services, Create a central Axios instance to manage URLs and Tokens.

**NEW FILE: 📁 `src/services/axiosInstance.js`**
```javascript
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'https://api.nexora.ai/v1', // ⚠️ URL السيرفر الحقيقي هنا
});

// إضافة التوكن تلقائياً لكل طلب
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('ai_edu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// معالجة الأخطاء العالمية (مثل انتهاء صلاحية التوكن)
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ai_edu_token');
      localStorage.removeItem('ai_edu_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
```

---

## 💎 2. Expected Data Models (JSON Schemas)

The backend MUST return data in the following shapes to avoid frontend crashes. All keys are Case-Sensitive.

### 👤 User Object
```json
{
  "id": "string (UUID or ID)",
  "name": "string",
  "email": "string",
  "role": "learner | instructor | admin",
  "avatar": "string (URL)",
  "createdAt": "string (ISO Date)"
}
```

### 📚 Course Object
```json
{
  "id": "number",
  "title": "string",
  "instructor": "string (Name)",
  "instructorId": "number",
  "instructorAvatar": "string (URL)",
  "rating": "number (0-5)",
  "reviews": "number (count)",
  "price": "number",
  "discount": "number (percentage)",
  "image": "string (Thumbnail URL)",
  "category": "string",
  "level": "Beginner | Intermediate | Advanced",
  "lessons": "number",
  "duration": "number (total seconds)",
  "description": "string",
  "highlights": ["string", "string"]
}
```

### 🎥 Lecture (Video) Object
```json
{
  "id": "number",
  "title": "string",
  "course": "string (Course Title)",
  "courseId": "number",
  "instructorId": "number",
  "instructor": "string (Instructor Name)",
  "views": "number",
  "duration": "number (seconds)",
  "status": "published | draft | pending",
  "date": "string (YYYY-MM-DD)",
  "videoUrl": "string (URL)",
  "thumbnail": "string (URL)",
  "quiz": [
    {
      "id": "number",
      "question": "string",
      "options": ["string", "string"],
      "correctAnswer": "number (index of options)"
    }
  ]
}
```

### 👨‍🏫 Instructor Object
```json
{
  "id": "number",
  "name": "string",
  "role": "string (e.g. 'AI Researcher & Educator')",
  "avatar": "string (URL)",
  "coursesCount": "number",
  "rating": "number (0-5)",
  "studentsCount": "number",
  "category": "string (e.g. 'Data Science')",
  "bio": "string",
  "website": "string (URL, optional)",
  "linkedin": "string (URL, optional)",
  "twitter": "string (URL, optional)"
}
```
> [!NOTE]
> Frontend uses `role` (not `specialty`), `coursesCount` (not `courses`), and `studentsCount` (not `students`).
> Social links (`website`, `linkedin`, `twitter`) are optional but displayed on instructor profile pages.

### 💬 Question Object (Instructor Q&A)
```json
{
  "id": "number",
  "user": "string (student name)",
  "avatar": "string (URL)",
  "course": "string (Course Title)",
  "question": "string",
  "date": "string",
  "reply": "string | empty string"
}
```
> [!NOTE]
> Frontend uses `user` (not `studentName`) and `avatar` (not `studentAvatar`). The page maps `user → studentName` internally.

### ⭐ Review Object (Instructor Reviews)
```json
{
  "id": "number",
  "user": "string (student name)",
  "avatar": "string (URL)",
  "course": "string (Course Title)",
  "rating": "number (1-5)",
  "comment": "string",
  "date": "string",
  "reply": "string | empty string"
}
```
> [!NOTE]
> Frontend uses `user` (not `studentName`) and `avatar` (not `studentAvatar`). The page maps `user → studentName` internally.

### 📢 Announcement Object

#### Learner Announcement (from `GET /learner/announcements`)
```json
{
  "id": "number",
  "title": "string",
  "body": "string",
  "date": "string (YYYY-MM-DD)",
  "type": "system | course",
  "courseId": "number | null"
}
```

#### Instructor Announcement (from `GET /instructor/announcements`)
```json
{
  "id": "number",
  "subject": "string",
  "message": "string",
  "course": "string (course name, resolved by backend from courseId)",
  "courseId": "number | string ('all')",
  "date": "string (ISO Date or relative)",
  "sentTo": "number (count of students who received it)"
}
```
> [!IMPORTANT]
> The frontend uses `subject` and `message` for instructor announcements, NOT `title` and `body`.
> The backend MUST return `sentTo` (student count) and `course` (resolved course name) in the response.

### 💳 Billing History Object
```json
{
  "id": "string (e.g. TRX-98421)",
  "courseTitle": "string",
  "amount": "number",
  "date": "string (ISO Date)",
  "status": "completed | pending | refunded",
  "paymentMethod": "string (e.g. Stripe, PayPal)"
}
```

### 🔖 Saved Video Object
```json
{
  "id": "number",
  "title": "string",
  "courseTitle": "string",
  "thumbnail": "string (URL)",
  "duration": "number (seconds)",
  "savedAt": "string (ISO Date)"
}
```

### 💬 Testimonial Object
```json
{
  "id": "number",
  "name": "string",
  "role": "string",
  "image": "string (URL)",
  "content": "string",
  "rating": "number (1-5)"
}
```
> [!CAUTION]
> Frontend uses `image` (NOT `avatar`) and `content` (NOT `comment`). Returning the wrong keys will cause blank testimonials.

---

## 🔐 3. Authentication Module

**File Path**: 📁 `src/services/authService.js`

### 3.1 Login Function
- **Target Line**: ~35 to 99
- **Goal**: Replace LocalStorage DB lookup with a POST request.

#### ❌ MOCK CODE TO REMOVE:
```javascript
35:     login: async (email, password) => {
36:         await delay(800); // Simulate network delay
37: 
38:         const users = getUsers();
39:         const user = users.find(u => u.email === email && u.password === password);
40: 
41:         if (!user) {
42:             // For checking purposes, allow a default admin if not exists
43:             if (email === 'admin@test.com' && password === 'admin123') {
                   // ... (Static admin/student/instructor checks)
                }
44:             throw new Error('Invalid email or password');
45:         }
91:         const token = `mock-jwt-token-${user.role}-${Date.now()}`;
94:         const { password: _, ...userWithoutPassword } = user;
95:         return { user: userWithoutPassword, token };
99:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
import apiInstance from './axiosInstance';

login: async (email, password) => {
    // إرسال الطلب للسيرفر
    const response = await apiInstance.post('/auth/login', { email, password });
    
    // استلام البيانات (المتوقع: { user: {...}, token: "jwt..." })
    const { user, token } = response.data;
    
    // تخزين الجلسة (تم التعامل معها في وظيفة setSession بالأسفل)
    return { user, token };
},
```

### 3.2 Register Function
- **Target Line**: ~102 to 129

#### ❌ MOCK CODE TO REMOVE:
```javascript
102:    register: async (name, email, password, role = 'learner') => {
103:        await delay(1000);
105:        const users = getUsers();
110:        const newUser = {
111:            id: Date.now().toString(),
112:            name, email, password, role,
116:            avatar: `https://i.pravatar.cc/150?u=${email}`,
117:            createdAt: new Date().toISOString()
118:        };
120:        saveUser(newUser);
122:        const token = `mock-jwt-token-${role}-${Date.now()}`;
123:        const { password: _, ...userWithoutPassword } = newUser;
125:        return { user: userWithoutPassword, token };
129:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
register: async (name, email, password, role = 'learner') => {
    // إرسال طلب إنشاء مستخدم جديد
    const response = await apiInstance.post('/auth/register', { 
        name, email, password, role 
    });
    
    const { user, token } = response.data;
    return { user, token };
},
```

### 3.3 Logout Function
- **Target Line**: ~132 to 135
- **Goal**: Add server-side token invalidation.

#### ❌ MOCK CODE TO REMOVE:
```javascript
132:    logout: () => {
133:        localStorage.removeItem(TOKEN_KEY);
134:        localStorage.removeItem(CURRENT_USER_KEY);
135:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
logout: async () => {
    try {
        await apiInstance.post('/auth/logout');
    } catch (e) {
        // Even if server call fails, clear local session
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
},
```

### 3.4 getCurrentUser Function
- **Target Line**: ~138 to 141
- **Goal**: Validate token with server instead of just reading localStorage.

#### ❌ MOCK CODE TO REMOVE:
```javascript
138:    getCurrentUser: () => {
139:        const userStr = localStorage.getItem(CURRENT_USER_KEY);
140:        return userStr ? JSON.parse(userStr) : null;
141:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getCurrentUser: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    try {
        const response = await apiInstance.get('/auth/me');
        return response.data; // { id, name, email, role, avatar }
    } catch (e) {
        // Token expired or invalid
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
    }
},
```

> [!WARNING]
> تحويل `getCurrentUser` إلى `async` قد يتطلب تعديلات في الكمبوننتات اللي بتستدعيه (مثل `AuthContext`). تأكد إن كل الاستدعاءات بتستخدم `await`.

### 3.5 setSession — No changes needed
- **Target Line**: ~144 to 147
- هذه الوظيفة تخزن البيانات في localStorage وهي صالحة كما هي.

---

## 👤 4. Profile Endpoints

**File Path**: 📁 `src/services/api.js` → `profile` object

### 4.1 Update Profile
- **Target Line**: ~40 to 44
- **API**: `PUT /profile`

#### ❌ MOCK CODE TO REMOVE:
```javascript
40:     update: async (data) => {
41:         await delay(800);
42:         console.log('Profile updated:', data);
43:         return { success: true, user: data };
44:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
update: async (data) => {
    const response = await apiInstance.put('/profile', data);
    return response.data; // { success: true, user: {...} }
},
```

### 4.2 Update Password
- **Target Line**: ~45 to 49
- **API**: `PUT /profile/password`

#### ❌ MOCK CODE TO REMOVE:
```javascript
45:     updatePassword: async (data) => {
46:         await delay(1000);
47:         console.log('Password updated');
48:         return { success: true };
49:     }
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
updatePassword: async (data) => {
    // data = { currentPassword, newPassword }
    const response = await apiInstance.put('/profile/password', data);
    return response.data; // { success: true }
},
```

---

## 📚 5. Course Endpoints (Public)

**File Path**: 📁 `src/services/api.js` → `courses` object

### 5.1 Get All Courses
- **Target Line**: ~54 to 65

#### ❌ MOCK CODE TO REMOVE:
```javascript
54:     getAll: async (filters = {}) => {
55:         await delay(600);
56:         let result = [...coursesSub];
57:         if (filters.category && filters.category !== 'All') {
58:             result = result.filter(c => c.category === filters.category);
59:         }
60:         if (filters.search) {
61:             result = result.filter(c =>
62:                 c.title.toLowerCase().includes(filters.search.toLowerCase())
63:             );
64:         }
65:         return result;
66:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getAll: async (filters = {}) => {
    // إرسال الفلاتر (category, search) كـ Query Params
    const response = await apiInstance.get('/courses', { params: filters });
    
    // السيرفر يجب أن يعيد مصفوفة من الكورسات مباشرة
    return response.data;
},
```

### 5.2 Get Course By ID
- **Target Line**: ~68 to 73

#### ❌ MOCK CODE TO REMOVE:
```javascript
68:     getById: async (id) => {
69:         await delay(600);
70:         const course = coursesSub.find((c) => c.id === parseInt(id));
71:         if (!course) throw new Error('Course not found');
72:         return course;
73:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getById: async (id) => {
    const response = await apiInstance.get(`/courses/${id}`);
    return response.data;
},
```

### 5.3 Get Categories
- **Target Line**: ~75 to 78
- **API**: `GET /courses/categories`

#### ❌ MOCK CODE TO REMOVE:
```javascript
75:     getCategories: async () => {
76:         await delay(400);
77:         return categories;
78:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getCategories: async () => {
    const response = await apiInstance.get('/courses/categories');
    return response.data; // ["AI & Machine Learning", "Web Development", ...]
},
```

### 5.4 Get Course Lectures (Public)
- **Target Line**: ~80 to 83
- **API**: `GET /courses/:id/lectures`

#### ❌ MOCK CODE TO REMOVE:
```javascript
80:     getLectures: async (id) => {
81:         await delay(500);
82:         return lecturesSub.filter(l => l.courseId === parseInt(id));
83:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getLectures: async (id) => {
    const response = await apiInstance.get(`/courses/${id}/lectures`);
    return response.data; // Array of Lecture objects
},
```

---

## 👨‍🏫 6. Instructors Public Endpoints

**File Path**: 📁 `src/services/api.js` → `instructors` object

### 6.1 Get All Instructors
- **Target Line**: ~88 to 91
- **API**: `GET /instructors`

#### ❌ MOCK CODE TO REMOVE:
```javascript
88:     getAll: async () => {
89:         await delay(500);
90:         return mockInstructors;
91:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getAll: async () => {
    const response = await apiInstance.get('/instructors');
    return response.data; // Array of Instructor objects
},
```

### 6.2 Get Instructor By ID
- **Target Line**: ~92 to 95
- **API**: `GET /instructors/:id`

#### ❌ MOCK CODE TO REMOVE:
```javascript
92:     getById: async (id) => {
93:         await delay(500);
94:         return mockInstructors.find(ins => ins.id === parseInt(id));
95:     }
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getById: async (id) => {
    const response = await apiInstance.get(`/instructors/${id}`);
    return response.data; // Single Instructor object
},
```

---

## 📊 7. Public Statistics Endpoints

**File Path**: 📁 `src/services/api.js` → `stats` object

### 7.1 Get Public Overview Stats
- **Target Line**: ~100 to 108
- **API**: `GET /stats/public`
- **Used in**: HomePage counters section

#### ❌ MOCK CODE TO REMOVE:
```javascript
100:    getPublicOverview: async () => {
101:        await delay(500);
102:        return {
103:            totalStudents: 52300,
104:            activeCourses: 240,
105:            totalInstructors: 180,
106:            satisfactionRate: 99
107:        };
108:    }
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getPublicOverview: async () => {
    const response = await apiInstance.get('/stats/public');
    return response.data;
    // Expected: { totalStudents, activeCourses, totalInstructors, satisfactionRate }
},
```

---

## 🎓 8. Learner Dashboard & Progress

**File Path**: 📁 `src/services/api.js` → `learner` object

### 8.1 Get Enrolled Progress
- **Target Line**: ~113 to 131
- **API**: `GET /learner/my-courses`

#### ❌ MOCK CODE TO REMOVE:
```javascript
113:    getProgress: async () => {
114:        await delay(500);
115:        return [
116:            { courseId: 1, title: '...', progress: 65, ... },
121:            { courseId: 2, title: '...', progress: 45, ... },
128:        ];
131:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getProgress: async () => {
    const response = await apiInstance.get('/learner/my-courses');
    return response.data;
    // Expected: [{ courseId, title, progress (0-100), lastLesson, image }]
},
```

### 8.2 Get Learner Stats
- **Target Line**: ~133 to 140
- **API**: `GET /learner/stats`

#### ❌ MOCK CODE TO REMOVE:
```javascript
133:    getStats: async () => {
134:        await delay(500);
135:        return {
136:            hoursWatched: 12,
137:            certificates: 2,
138:            coursesInProgress: 4
139:        };
140:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getStats: async () => {
    const response = await apiInstance.get('/learner/stats');
    return response.data;
    // Expected: { hoursWatched, certificates, coursesInProgress }
},
```

### 8.3 Get Recommendations
- **Target Line**: ~142 to 145
- **API**: `GET /learner/recommendations`

#### ❌ MOCK CODE TO REMOVE:
```javascript
142:    getRecommendations: async () => {
143:        await delay(600);
144:        return coursesSub.slice(0, 3);
145:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getRecommendations: async () => {
    const response = await apiInstance.get('/learner/recommendations');
    return response.data; // Array of Course objects (max 3-5)
},
```

### 8.4 Checkout & Payments
- **Target Line**: ~147 to 164

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
checkout: async (courseId, paymentData) => {
    // إرسال بيانات الدفع والكورس المختار
    const response = await apiInstance.post(`/payments/checkout/${courseId}`, paymentData);
    return response.data; // { success: true, orderId: "..." }
},

getPurchase: async (courseId) => {
    // التحقق من حالة كورس معين (مباع أم لا)
    const response = await apiInstance.get(`/learner/check-purchase/${courseId}`);
    return response.data;
    // Expected: { id, date, status: "completed" } or null
},
```

### 8.5 Get Saved Videos
- **Target Line**: ~166 to 177
- **API**: `GET /learner/saved-videos`

#### ❌ MOCK CODE TO REMOVE:
```javascript
166:    getSavedVideos: async () => {
167:        await delay(600);
168:        return lecturesSub.slice(0, 2).map(l => ({
169:            id: l.id,
170:            title: l.title,
171:            courseTitle: l.course,
172:            thumbnail: l.thumbnail,
173:            duration: l.duration,
174:            savedAt: new Date(...).toISOString()
175:        }));
177:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getSavedVideos: async () => {
    const response = await apiInstance.get('/learner/saved-videos');
    return response.data;
    // Expected: [{ id, title, courseTitle, thumbnail, duration, savedAt }]
},
```

### 8.6 Get Learner Announcements
- **Target Line**: ~179 to 198
- **API**: `GET /learner/announcements`

#### ❌ MOCK CODE TO REMOVE:
```javascript
179:    getAnnouncements: async () => {
180:        await delay(400);
181:        return [
182:            { id: 1, title: 'Welcome...', body: '...', date: '...', type: 'system' },
189:            { id: 2, title: 'New Course...', body: '...', date: '...', type: 'course', courseId: 1 }
197:        ];
198:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getAnnouncements: async () => {
    const response = await apiInstance.get('/learner/announcements');
    return response.data;
    // Expected: Array of Announcement objects
},
```

### 8.7 Get Billing History
- **Target Line**: ~200 to 220
- **API**: `GET /learner/billing`

#### ❌ MOCK CODE TO REMOVE:
```javascript
200:    getBillingHistory: async () => {
201:        await delay(700);
202:        return [
203:            { id: 'TRX-98421', courseTitle: '...', amount: 19.99, ... },
210:            { id: 'TRX-98425', courseTitle: '...', amount: 24.99, ... },
219:        ];
220:    }
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getBillingHistory: async () => {
    const response = await apiInstance.get('/learner/billing');
    return response.data;
    // Expected: Array of Billing History objects
},
```

---

## 👨‍🏫 9. Instructor Dashboard

**File Path**: 📁 `src/services/api.js` → `instructor` object

### 9.1 Instructor Stats
- **Target Line**: ~225 to 235
- **API**: `GET /instructor/stats`

#### ❌ MOCK CODE TO REMOVE:
```javascript
225:    getStats: async () => {
226:        await delay(500);
227:        return {
228:            totalStudents: 15420,
229:            totalRevenue: 24500,
230:            avgRating: 4.8,
231:            totalReviews: 850,
232:            activeCourses: 12,
233:            pendingReview: 2
234:        };
235:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getStats: async () => {
    const response = await apiInstance.get('/instructor/stats');
    return response.data;
    // Expected: { totalStudents, totalRevenue, avgRating, totalReviews, activeCourses, pendingReview }
},
```

### 9.2 Instructor Courses (CRUD)
- **Target Line**: ~237 to 263

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
courses: {
    getAll: async () => {
        // GET /instructor/courses
        const response = await apiInstance.get('/instructor/courses');
        return response.data;
        // Expected: Array of Course objects with extra fields: { students, status, revenue }
    },
    create: async (data) => {
        // POST /instructor/courses
        const response = await apiInstance.post('/instructor/courses', data);
        return response.data;
    },
    update: async (id, data) => {
        // PUT /instructor/courses/:id
        const response = await apiInstance.put(`/instructor/courses/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        // DELETE /instructor/courses/:id
        const response = await apiInstance.delete(`/instructor/courses/${id}`);
        return response.data; // { success: true }
    }
},
```

### 9.3 Instructor Lectures (CRUD + Toggle Status)
- **Target Line**: ~265 to 305
- **Note**: Requires Multipart/form-data for video files on `create`.

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
lectures: {
    getAll: async (courseId) => {
        // GET /instructor/lectures?courseId=... (or 'all')
        const params = courseId !== 'all' ? { courseId } : {};
        const response = await apiInstance.get('/instructor/lectures', { params });
        return response.data; // Array of Lecture objects
    },
    create: async (formData) => {
        // POST /instructor/lectures/upload
        // ملاحظة: الـ formData يحتوي على الفيديو والملفات والبيانات الوصفية
        const response = await apiInstance.post('/instructor/lectures/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    update: async (id, data) => {
        // PUT /instructor/lectures/:id
        const response = await apiInstance.put(`/instructor/lectures/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        // DELETE /instructor/lectures/:id
        const response = await apiInstance.delete(`/instructor/lectures/${id}`);
        return response.data; // { success: true }
    },
    toggleStatus: async (id) => {
        // PATCH /instructor/lectures/:id/toggle-status
        const response = await apiInstance.patch(`/instructor/lectures/${id}/toggle-status`);
        return response.data; // { success: true }
    }
},
```

### 9.4 Instructor Reviews
- **Target Line**: ~307 to 319
- **API**: `GET /instructor/reviews` + `POST /instructor/reviews/:id/reply`

#### ❌ MOCK CODE TO REMOVE:
```javascript
307:    reviews: {
308:        getAll: async () => {
309:            await delay(500);
310:            return reviewsSub;
311:        },
312:        reply: async (id, comment) => {
313:            await delay(500);
314:            reviewsSub = reviewsSub.map(r => 
315:                r.id === id ? { ...r, reply: comment } : r
316:            );
317:            return { id, user: 'Instructor', comment, date: 'Just now' };
318:        }
319:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
reviews: {
    getAll: async () => {
        const response = await apiInstance.get('/instructor/reviews');
        return response.data; // Array of Review objects
    },
    reply: async (id, comment) => {
        const response = await apiInstance.post(`/instructor/reviews/${id}/reply`, { comment });
        return response.data; // { id, user, comment, date }
    }
},
```

### 9.5 Instructor Questions (Q&A)
- **Target Line**: ~321 to 333
- **API**: `GET /instructor/questions` + `POST /instructor/questions/:id/reply`

#### ❌ MOCK CODE TO REMOVE:
```javascript
321:    questions: {
322:        getAll: async () => {
323:            await delay(500);
324:            return questionsSub;
325:        },
326:        reply: async (id, replyText) => {
327:            await delay(500);
328:            questionsSub = questionsSub.map(q => 
329:                q.id === id ? { ...q, reply: replyText } : q
330:            );
331:            return { id, reply: replyText, date: 'Just now' };
332:        }
333:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
questions: {
    getAll: async () => {
        const response = await apiInstance.get('/instructor/questions');
        return response.data; // Array of Question objects
    },
    reply: async (id, replyText) => {
        const response = await apiInstance.post(`/instructor/questions/${id}/reply`, { reply: replyText });
        return response.data; // { id, reply, date }
    }
},
```

### 9.6 Instructor Announcements
- **Target Line**: ~336 to 348
- **API**: `GET /instructor/announcements` + `POST /instructor/announcements`

#### ❌ MOCK CODE TO REMOVE:
```javascript
announcements: {
    getAll: async (courseId) => {
        await delay(400);
        if (courseId === 'all') return announcementsSub;
        return announcementsSub.filter(a => a.courseId === courseId);
    },
    create: async (data) => {
        await delay(500);
        const newAnnouncement = { ...data, id: Date.now() };
        announcementsSub = [newAnnouncement, ...announcementsSub];
        return newAnnouncement;
    }
}
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
announcements: {
    getAll: async (courseId) => {
        // GET /instructor/announcements?courseId=:id
        const params = courseId !== 'all' ? { courseId } : {};
        const response = await apiInstance.get('/instructor/announcements', { params });
        return response.data;
        // Expected: Array of { id, subject, message, course, courseId, date, sentTo }
    },
    create: async (data) => {
        // POST /instructor/announcements
        // Body: { courseId, subject, message }
        // Backend resolves: course name from courseId, sentTo from enrolled students count
        const response = await apiInstance.post('/instructor/announcements', {
            courseId: data.courseId,
            subject: data.subject,
            message: data.message
        });
        return response.data;
        // Expected: { id, subject, message, course, courseId, date, sentTo }
    }
}
```

> [!IMPORTANT]
> **Backend Notes:**
> - `course` (string): Backend must resolve the course name from `courseId`. If `courseId === 'all'`, return `"All Courses"`.
> - `sentTo` (number): Backend must calculate how many enrolled students received this announcement.
> - The frontend sends only `{ courseId, subject, message }`. All other fields are server-generated.

---

## 🛡️ 10. Admin Panel (System Control)

**File Path**: 📁 `src/services/api.js` → `admin` object

### 10.1 Admin Dashboard Stats
- **Target Line**: ~350 to 371
- **API**: `GET /admin/dashboard-stats`

#### ❌ MOCK CODE TO REMOVE:
```javascript
350:    stats: {
351:        getOverview: async () => {
352:            await delay(500);
353:            return {
354:                totalStudents: 1540,
355:                activeCourses: mockCourses.length,
356:                totalRevenue: 85000,
357:                ...
370:            };
371:        },
372:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
stats: {
    getOverview: async () => {
        const response = await apiInstance.get('/admin/dashboard-stats');
        return response.data;
        /* Expected:
        {
            totalStudents, activeCourses, totalRevenue, totalInstructors,
            videosUploaded, userGrowth, courseGrowth, videoGrowth, revenueGrowth,
            revenueChart: [number, ...],  // Array of 7 numbers for chart
            recentActivity: [{ id, user, action, time }]
        }
        */
    },
},
```

### 10.2 Admin Users Management (CRUD)
- **Target Line**: ~374 to 401

#### ❌ MOCK CODE TO REMOVE:
```javascript
374:    users: {
375:        getAll: async () => {
376:            await delay(600);
377:            return [
378:                { id: 1, name: 'Dr. Laila Hassan', ... },
384:            ];
385:        },
386:        create: async (data) => { ... },
390:        update: async (id, data) => { ... },
394:        delete: async (id) => { ... },
398:        toggleStatus: async (id) => { ... }
401:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
users: {
    getAll: async () => {
        // GET /admin/users
        const response = await apiInstance.get('/admin/users');
        return response.data;
        // Expected: [{ id, name, email, role, joined, status, avatar }]
    },
    create: async (data) => {
        // POST /admin/users
        const response = await apiInstance.post('/admin/users', data);
        return response.data;
    },
    update: async (id, data) => {
        // PUT /admin/users/:id
        const response = await apiInstance.put(`/admin/users/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        // DELETE /admin/users/:id
        const response = await apiInstance.delete(`/admin/users/${id}`);
        return response.data; // { success: true }
    },
    toggleStatus: async (id) => {
        // PATCH /admin/users/:id/toggle-status
        const response = await apiInstance.patch(`/admin/users/${id}/toggle-status`);
        return response.data; // { success: true }
    }
},
```

### 10.3 Admin Courses Management (CRUD)
- **Target Line**: ~404 to 425

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
courses: {
    getAll: async () => {
        // GET /admin/courses
        const response = await apiInstance.get('/admin/courses');
        return response.data; // Array of full Course objects
    },
    create: async (data) => {
        // POST /admin/courses
        const response = await apiInstance.post('/admin/courses', data);
        return response.data;
    },
    update: async (id, data) => {
        // PUT /admin/courses/:id
        const response = await apiInstance.put(`/admin/courses/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        // DELETE /admin/courses/:id
        const response = await apiInstance.delete(`/admin/courses/${id}`);
        return response.data; // { success: true }
    }
},
```

### 10.4 Admin Videos Management (CRUD + Toggle)
- **Target Line**: ~427 to 461

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
videos: {
    getAll: async () => {
        // GET /admin/videos
        const response = await apiInstance.get('/admin/videos');
        return response.data; // Array of Lecture objects
    },
    create: async (formData) => {
        // POST /admin/videos
        const response = await apiInstance.post('/admin/videos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    update: async (id, data) => {
        // PUT /admin/videos/:id
        const response = await apiInstance.put(`/admin/videos/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        // DELETE /admin/videos/:id
        const response = await apiInstance.delete(`/admin/videos/${id}`);
        return response.data; // { success: true }
    },
    toggleStatus: async (id) => {
        // PATCH /admin/videos/:id/toggle-status
        const response = await apiInstance.patch(`/admin/videos/${id}/toggle-status`);
        return response.data; // { success: true }
    }
},
```

### 10.5 Admin Platform Settings
- **Target Line**: ~464 to 485
- **API**: `GET /admin/settings` + `PUT /admin/settings`

#### ❌ MOCK CODE TO REMOVE:
```javascript
464:    settings: {
465:        get: async () => {
466:            await delay(600);
467:            return {
468:                platformName: 'Nexora AI',
469:                supportEmail: 'support@nexora.ai',
470:                maintenanceMode: false,
                   ...
478:            };
479:        },
480:        update: async (data) => {
481:            await delay(1000);
482:            console.log('Settings updated:', data);
483:            return { success: true, settings: data };
484:        }
485:    }
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
settings: {
    get: async () => {
        const response = await apiInstance.get('/admin/settings');
        return response.data;
        /* Expected:
        {
            platformName, supportEmail, maintenanceMode (bool),
            enableAiTutor (bool), defaultAiModel (string),
            feedbackIntensity ("low"|"medium"|"high"),
            autoApproveCourses (bool), defaultCurrency (string),
            googleLogin (bool), githubLogin (bool)
        }
        */
    },
    update: async (data) => {
        const response = await apiInstance.put('/admin/settings', data);
        return response.data; // { success: true, settings: {...} }
    }
}
```

---

## 🤖 11. AI Chat & Video Assistant

**File Path**: 📁 `src/services/api.js` → `ai` object

### 11.1 Chat Assistant
- **Target Line**: ~490 to 515
- **API**: `POST /ai/chat`

#### ❌ MOCK CODE TO REMOVE:
```javascript
490:    chat: async (message, context = {}) => {
491:        await delay(1200);
492:        const msg = message.toLowerCase();
495:        if (msg.includes('react')) { ... }
           // ... keyword-based mock responses
514:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
chat: async (message, context = {}) => {
    const response = await apiInstance.post('/ai/chat', { 
        message, 
        context // يشمل courseId, lectureId, timestamp
    });
    return response.data; // { message: "..." }
},
```

### 11.2 Video Assistant
- **Target Line**: ~520 to 559
- **API**: `POST /ai/video-assistant`

#### ❌ MOCK CODE TO REMOVE:
```javascript
520:    videoAssistant: async ({ lectureId, currentTime, action, query }) => {
521:        await delay(800);
522:        // Auto prompt logic + keyword-based responses...
558:    }
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
videoAssistant: async ({ lectureId, currentTime, action, query }) => {
    const response = await apiInstance.post('/ai/video-assistant', {
        lectureId,
        currentTime,
        action,   // "auto_prompt" | "show-code" | "explain-scene" | "explain-section" | "ask"
        query
    });
    return response.data;
    // Expected: { message: "...", suggested: boolean }
    // suggested = true means auto-generated prompt (not user-initiated)
},
```

---

## 💬 12. Testimonials

**File Path**: 📁 `src/services/api.js` → `testimonials` object

### 12.1 Get All Testimonials
- **Target Line**: ~563 to 568
- **API**: `GET /testimonials`

#### ❌ MOCK CODE TO REMOVE:
```javascript
563:    testimonials: {
564:        getAll: async () => {
565:            await delay(300);
566:            return testimonials;
567:        }
568:    }
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
testimonials: {
    getAll: async () => {
        const response = await apiInstance.get('/testimonials');
        return response.data; // Array of Testimonial objects
    }
}
```

---

## 🏁 13. FINAL CLEANUP CHECKLIST

1. **Delete `src/data/mockData.js`**: سيصبح غير مستخدم.
2. **Remove `delay()` Helper**: احذفه من جميع ملفات الـ services.
3. **Remove Local variables**: احذف `coursesSub` و `lecturesSub` و `questionsSub` و `reviewsSub` و `announcementsSub` من ملف `api.js`.
4. **Remove `normalizeDuration()`**: الباك اند هيكون مسؤول عن التأكد إن الـ duration بالثواني.
5. **Change Imports**: استبدل استيراد البيانات الوهمية باستيراد `apiInstance`.
6. **Remove `i18n` import from `api.js`**: الباك اند الـ AI هيكون مسؤول عن اللغة بناءً على الـ request headers أو body.

> [!IMPORTANT]
> **DURATION FORMAT**:
> The frontend `formatDuration()` utility currently accepts both:
>   - **number (seconds)**: 45000 → "12:30:00" ✅ **Preferred**
>   - **string (MM:SS)**: "12:30" → returned as-is (temporary fallback)
> 
> Once backend is live, **all duration fields MUST return numbers** (total seconds only).
> The string fallback will be removed after full integration.

> [!IMPORTANT]
> يجب على الباك اند العودة لملف `src/services/api.js` دائماً للتأكد من المسميات التي يتوقعها الفرونت اند في الـ Response، لتجنب حدوث أخطاء في العرض.

> [!WARNING]
> **getCurrentUser() Breaking Change**:
> تحويل `getCurrentUser` في `authService.js` من synchronous إلى `async` يتطلب تعديل كل الأماكن اللي بتستدعيه — خصوصاً في `AuthContext.jsx`. تأكد من إضافة `await` لكل استدعاء.

---

## 📋 FULL API ENDPOINTS SUMMARY TABLE

| # | Method | Endpoint | Service Location | Description |
|---|--------|----------|------------------|-------------|
| 1 | POST | `/auth/login` | `authService.login` | تسجيل الدخول |
| 2 | POST | `/auth/register` | `authService.register` | إنشاء حساب جديد |
| 3 | POST | `/auth/logout` | `authService.logout` | تسجيل الخروج |
| 4 | GET | `/auth/me` | `authService.getCurrentUser` | التحقق من الجلسة |
| 5 | PUT | `/profile` | `api.profile.update` | تحديث البروفايل |
| 6 | PUT | `/profile/password` | `api.profile.updatePassword` | تغيير كلمة السر |
| 7 | GET | `/courses` | `api.courses.getAll` | جلب كل الكورسات |
| 8 | GET | `/courses/:id` | `api.courses.getById` | جلب كورس بالـ ID |
| 9 | GET | `/courses/categories` | `api.courses.getCategories` | جلب الكاتيجوريز |
| 10 | GET | `/courses/:id/lectures` | `api.courses.getLectures` | جلب محاضرات كورس |
| 11 | GET | `/instructors` | `api.instructors.getAll` | جلب كل المدرسين |
| 12 | GET | `/instructors/:id` | `api.instructors.getById` | جلب مدرس بالـ ID |
| 13 | GET | `/stats/public` | `api.stats.getPublicOverview` | إحصائيات الصفحة الرئيسية |
| 14 | GET | `/learner/my-courses` | `api.learner.getProgress` | كورسات الطالب المسجل فيها |
| 15 | GET | `/learner/stats` | `api.learner.getStats` | إحصائيات الطالب |
| 16 | GET | `/learner/recommendations` | `api.learner.getRecommendations` | كورسات مقترحة |
| 17 | POST | `/payments/checkout/:courseId` | `api.learner.checkout` | شراء كورس |
| 18 | GET | `/learner/check-purchase/:courseId` | `api.learner.getPurchase` | التحقق من الشراء |
| 19 | GET | `/learner/saved-videos` | `api.learner.getSavedVideos` | الفيديوهات المحفوظة |
| 20 | GET | `/learner/announcements` | `api.learner.getAnnouncements` | إعلانات الطالب |
| 21 | GET | `/learner/billing` | `api.learner.getBillingHistory` | سجل المدفوعات |
| 22 | GET | `/instructor/stats` | `api.instructor.getStats` | إحصائيات المدرس |
| 23 | GET | `/instructor/courses` | `api.instructor.courses.getAll` | كورسات المدرس |
| 24 | POST | `/instructor/courses` | `api.instructor.courses.create` | إنشاء كورس |
| 25 | PUT | `/instructor/courses/:id` | `api.instructor.courses.update` | تحديث كورس |
| 26 | DELETE | `/instructor/courses/:id` | `api.instructor.courses.delete` | حذف كورس |
| 27 | GET | `/instructor/lectures` | `api.instructor.lectures.getAll` | محاضرات المدرس |
| 28 | POST | `/instructor/lectures/upload` | `api.instructor.lectures.create` | رفع محاضرة |
| 29 | PUT | `/instructor/lectures/:id` | `api.instructor.lectures.update` | تحديث محاضرة |
| 30 | DELETE | `/instructor/lectures/:id` | `api.instructor.lectures.delete` | حذف محاضرة |
| 31 | PATCH | `/instructor/lectures/:id/toggle-status` | `api.instructor.lectures.toggleStatus` | تغيير حالة المحاضرة |
| 32 | GET | `/instructor/reviews` | `api.instructor.reviews.getAll` | جلب التقييمات |
| 33 | POST | `/instructor/reviews/:id/reply` | `api.instructor.reviews.reply` | الرد على تقييم |
| 34 | GET | `/instructor/questions` | `api.instructor.questions.getAll` | جلب الأسئلة |
| 35 | POST | `/instructor/questions/:id/reply` | `api.instructor.questions.reply` | الرد على سؤال |
| 36 | GET | `/instructor/announcements` | `api.instructor.announcements.getAll` | إعلانات المدرس |
| 37 | POST | `/instructor/announcements` | `api.instructor.announcements.create` | إنشاء إعلان |
| 38 | GET | `/admin/dashboard-stats` | `api.admin.stats.getOverview` | إحصائيات الأدمن |
| 39 | GET | `/admin/users` | `api.admin.users.getAll` | جلب كل المستخدمين |
| 40 | POST | `/admin/users` | `api.admin.users.create` | إنشاء مستخدم |
| 41 | PUT | `/admin/users/:id` | `api.admin.users.update` | تحديث مستخدم |
| 42 | DELETE | `/admin/users/:id` | `api.admin.users.delete` | حذف مستخدم |
| 43 | PATCH | `/admin/users/:id/toggle-status` | `api.admin.users.toggleStatus` | تفعيل/تعطيل مستخدم |
| 44 | GET | `/admin/courses` | `api.admin.courses.getAll` | كل الكورسات (أدمن) |
| 45 | POST | `/admin/courses` | `api.admin.courses.create` | إنشاء كورس (أدمن) |
| 46 | PUT | `/admin/courses/:id` | `api.admin.courses.update` | تحديث كورس (أدمن) |
| 47 | DELETE | `/admin/courses/:id` | `api.admin.courses.delete` | حذف كورس (أدمن) |
| 48 | GET | `/admin/videos` | `api.admin.videos.getAll` | كل الفيديوهات (أدمن) |
| 49 | POST | `/admin/videos` | `api.admin.videos.create` | رفع فيديو (أدمن) |
| 50 | PUT | `/admin/videos/:id` | `api.admin.videos.update` | تحديث فيديو (أدمن) |
| 51 | DELETE | `/admin/videos/:id` | `api.admin.videos.delete` | حذف فيديو (أدمن) |
| 52 | PATCH | `/admin/videos/:id/toggle-status` | `api.admin.videos.toggleStatus` | تغيير حالة فيديو |
| 53 | GET | `/admin/settings` | `api.admin.settings.get` | جلب إعدادات المنصة |
| 54 | PUT | `/admin/settings` | `api.admin.settings.update` | تحديث إعدادات المنصة |
| 55 | POST | `/ai/chat` | `api.ai.chat` | محادثة الذكاء الاصطناعي |
| 56 | POST | `/ai/video-assistant` | `api.ai.videoAssistant` | مساعد الفيديو الذكي |
| 57 | GET | `/testimonials` | `api.testimonials.getAll` | آراء المستخدمين |
