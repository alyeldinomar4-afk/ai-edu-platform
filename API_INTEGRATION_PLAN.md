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

---

## 🔐 3. Authentication Module

**File Path**: 📁 `src/services/authService.js`

### 2.1 Login Function
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

### 2.2 Register Function
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

---

## 📚 4. Core API Services

**File Path**: 📁 `src/services/api.js`

### 3.1 Get All Courses
- **Target Line**: ~52 to 64

#### ❌ MOCK CODE TO REMOVE:
```javascript
52:     getAll: async (filters = {}) => {
53:         await delay(600);
54:         let result = [...coursesSub];
55:         if (filters.category && filters.category !== 'All') {
56:             result = result.filter(c => c.category === filters.category);
57:         }
58:         if (filters.search) {
59:             result = result.filter(c =>
60:                 c.title.toLowerCase().includes(filters.search.toLowerCase())
61:             );
62:         }
63:         return result;
64:     },
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

### 3.2 Get Course By ID (Curriculum)
- **Target Line**: ~66 to 71

#### ❌ MOCK CODE TO REMOVE:
```javascript
66:     getById: async (id) => {
67:         await delay(600);
68:         const course = coursesSub.find((c) => c.id === parseInt(id));
69:         if (!course) throw new Error('Course not found');
70:         return course;
71:     },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getById: async (id) => {
    const response = await apiInstance.get(`/courses/${id}`);
    return response.data;
},
```

---

## 🎓 5. Learner Dashboard & Progress

**File Path**: 📁 `src/services/api.js` -> `learner` object

### 4.1 Get Enrolled Progress
- **Target Line**: ~111 to 129

#### ❌ MOCK CODE TO REMOVE:
```javascript
111:    getProgress: async () => {
112:        await delay(500);
113:        return [
114:            { courseId: 1, title: '...', progress: 65, ... },
121:            { courseId: 2, title: '...', progress: 45, ... },
128:        ];
129:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getProgress: async () => {
    const response = await apiInstance.get('/learner/my-courses');
    return response.data;
},
```

### 4.2 Checkout & Payments
- **Target Line**: ~145 to 153

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
},
```

---

## 👨‍🏫 6. Instructor Dashboard

**File Path**: 📁 `src/services/api.js` -> `instructor` object

### 5.1 Uploading Lectures (Videos)
- **Target Line**: ~260 to 274
- **Note**: Requires Multipart/form-data for video files.

#### ❌ MOCK CODE TO REMOVE:
```javascript
260:    create: async (data) => {
261:        await delay(800);
262:        const normalizedData = { ... };
272:        lecturesSub = [newLecture, ...lecturesSub];
273:        return newLecture;
274:    },
```

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
create: async (formData) => {
    // ملاحظة: الـ formData يحتوي على الفيديو والملفات والبيانات الوصفية
    const response = await apiInstance.post('/instructor/lectures/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
},
```

---

## 🤖 7. AI Tutor & Contextual Assistant

**File Path**: 📁 `src/services/api.js` -> `ai` object

### 6.1 Chat Assistant
- **Target Line**: ~473 to 498

#### ❌ MOCK CODE TO REMOVE:
```javascript
473:    chat: async (message, context = {}) => {
474:        await delay(1200);
475:        const msg = message.toLowerCase();
478:        if (msg.includes('react')) { ... }
495:        return { message: "AI response here..." };
498:    },
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

---

## 🛡️ 8. Admin Panel (System Control)

**File Path**: 📁 `src/services/api.js` -> `admin` object

### 7.1 Overview Stats
- **Target Line**: ~334 to 354

#### ✅ PRODUCTION CODE TO INSERT:
```javascript
getOverview: async () => {
    const response = await apiInstance.get('/admin/dashboard-stats');
    return response.data;
},
```

---

## 🏁 9. FINAL CLEANUP CHECKLIST

1. **Delete `src/data/mockData.js`**: سيصبح غير مستخدم.
2. **Remove `delay()` Helper**: احذفه من جميع ملفات الـ services.
3. **Remove Local variables**: احذف `coursesSub` و `lecturesSub` من ملف `api.js`.
4. **Change Imports**: استبدل استيراد البيانات الوهمية باستيراد `apiInstance`.

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

