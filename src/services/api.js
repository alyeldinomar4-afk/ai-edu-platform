import { 
    courses as mockCourses, 
    instructors as mockInstructors, 
    lectures as mockLectures,
    instructorQuestions,
    instructorAnnouncements,
    instructorReviews,
    globalStats,
    categories,
    testimonials
} from '../data/mockData';
import i18n from '../i18n';
import httpClient from './httpClient';

// Adapters for data shape mismatches
const adapters = {
    testimonial: (item) => ({
        id: item._id || item.id,
        name: item.name,
        role: item.role,
        content: item.content,
        rating: item.rating || 5,
        image: item.image?.url || item.image || "https://via.placeholder.com/150",
    }),
    statsOverview: (data) => ({
        totalStudents: data.totalStudents || 0,
        activeCourses: data.activeCourses || 0,
        totalInstructors: data.totalInstructors || 0,
        totalLectures: data.totalLectures || 0,
        hoursWatched: data.hoursWatched || 0,
        satisfactionRate: data.avgRating ? Math.round((data.avgRating / 5) * 100) : 99,
    }),
    course: (data) => ({
        id: data._id || data.id,
        title: data.title,
        instructor: data.instructor?.fullName || data.instructor || "Unknown Instructor",
        instructorId: data.instructor?._id || data.instructorId || 1,
        rating: data.rating || 0,
        reviews: data.reviewsCount || data.reviews || 0,
        price: data.price || 0,
        discount: data.discount || 0,
        image: data.image?.url || data.image || "https://via.placeholder.com/300",
        category: data.category?.name || data.category || "General",
        level: data.level || "Beginner",
        lessons: data.lessonsCount || data.lessons || 0,
        duration: data.duration || 0,
        description: data.description || "",
        highlights: data.highlights || []
    }),
    lecture: (data) => ({
        id: data._id || data.id,
        title: data.title,
        description: data.description || '',
        courseId: data.courseData?._id || data.course?._id || data.courseId || 1,
        course: data.courseData?.title || data.course?.title || data.course || "Unknown Course",
        videoUrl: data.video?.url || data.videoUrl?.url || data.videoUrl || "",
        duration: data.duration || 0,
        thumbnail: data.thumbnail?.url || data.thumbnail || "https://via.placeholder.com/150",
        status: data.status || "published",
        // transcript data for AI tutor
        transcript: data.video?.transcript || data.transcript || null,
    }),
    user: (data) => ({
        id: data._id || data.id,
        name: data.fullName || data.name || "Unknown User",
        email: data.email || "",
        role: data.role || "learner",
        avatar: data.avatar?.url || data.avatar || "https://via.placeholder.com/150",
        joined: data.createdAt ? data.createdAt.split('T')[0] : (data.joined || "2024-01-01"),
        status: data.status || "active"
    })
};

// Mutable data stores for synchronization
let coursesSub = [...mockCourses];
let lecturesSub = [...mockLectures];
let questionsSub = [...instructorQuestions];
let reviewsSub = [...instructorReviews];
let announcementsSub = [...instructorAnnouncements];

// Simulated network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeDuration = (duration) => {
  // Backend expects number (seconds). If UI sends a string (e.g. "10:30"), we convert it here.
  if (typeof duration === "number") return duration;

  if (typeof duration === "string" && duration.includes(":")) {
    const parts = duration.split(":").map(Number);
    if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
    if (parts.length === 3)
      return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }

  const num = parseInt(duration, 10);
  return isNaN(num) ? 0 : num;
};

export const api = {
    // ─── Profile Endpoints ───────────────────────────────────
    profile: {
        update: async (data) => {
            try {
                const payload = {
                    ...data,
                    fullName: data.name
                };
                delete payload.name;
                const response = await httpClient.put('/auth/me', payload);
                return { success: true, user: response.data || data };
            } catch (error) {
                console.warn("Fallback to mock data for profile update", error);
                throw error;
                return { success: true, user: data };
            }
        },
        updatePassword: async (data) => {
            try {
                const payload = {
                    currentpassword: data.currentPassword,
                    newpassword: data.newPassword
                };
                const response = await httpClient.patch('/auth/me', payload);
                return { success: true, message: response.message };
            } catch (error) {
                console.warn("Fallback to mock data for password update", error);
                throw error;
                return { success: true };
            }
        }
    },

    // ─── Course Endpoints ────────────────────────────────────
    courses: {
        getAll: async (filters = {}) => {
            try {
                const apiParams = {};
                if (filters.search) apiParams.search = filters.search;
                if (filters.category && filters.category !== 'All') apiParams['filters[category]'] = filters.category;
                if (filters.level && filters.level !== 'All') apiParams['filters[level]'] = filters.level;

                const response = await httpClient.get('/courses', { params: apiParams });
                const data = response.data || [];
                return data.map(adapters.course);
            } catch (error) {
                console.warn("Fallback to mock data for courses.getAll", error);
                throw error;
                let result = [...coursesSub];
                if (filters.category && filters.category !== 'All') {
                    result = result.filter(c => c.category === filters.category);
                }
                if (filters.search) {
                    result = result.filter(c =>
                        c.title.toLowerCase().includes(filters.search.toLowerCase())
                    );
                }
                return result;
            }
        },

        getById: async (id) => {
            try {
                const response = await httpClient.get(`/courses/${id}`);
                const data = response.data || response;
                return adapters.course(data);
            } catch (error) {
                console.warn("Fallback to mock data for courses.getById", error);
                throw error;
                const course = coursesSub.find((c) => c.id === parseInt(id) || c.id === id);
                if (!course) throw new Error('Course not found');
                return course;
            }
        },

        getCategories: async () => {
            try {
                const response = await httpClient.get('/categories');
                const data = response.data || [];
                // Handle objects vs array of strings
                return data
            } catch (error) {
                console.error("Fallback to mock data for categories", error);
                // throw error;
                return categories;
            }
        },

        getLectures: async (id) => {
            try {
                const response = await httpClient.get(`/lectures`, { params: { 'filters[course]': id } });
                const data = response.data || [];
                return data.map(adapters.lecture);
            } catch (error) {
                console.warn("Fallback to mock data for course lectures", error);
                throw error;
            }
        },

        getLectureById: async (lectureId, language = 'en') => {
            try {
                const response = await httpClient.get(`/lectures/${lectureId}`, { params: { language } });
                const data = response.data || response;
                return adapters.lecture(data);
            } catch (error) {
                console.warn("Fallback to mock data for getLectureById", error);
                throw error;
                return lecturesSub.find(l => String(l.id) === String(lectureId)) || null;
            }
        }
    },

    // ─── Instructors Public Endpoints ────────────────────────
    instructors: {
        getAll: async () => {
            try {
                const response = await httpClient.get('/instructors');
                const data = response.data || [];
                return data.map(adapters.user);
            } catch (error) {
                console.warn("Fallback to mock data for instructors", error);
                // throw error;
                return mockInstructors;
            }
        },
        getById: async (id) => {
            try {
                const response = await httpClient.get(`/instructors/${id}`);
                const data = response.data || response;
                return adapters.user(data);
            } catch (error) {
                console.warn("Fallback to mock data for instructor by id", error);
                throw error;
                return mockInstructors.find(ins => ins.id === parseInt(id) || ins.id === id);
            }
        }
    },
 
    // ─── Statistics Endpoints ───────────────────────────────
    stats: {
        getPublicOverview: async () => {
            try {
                const response = await httpClient.get('/stats/overview');
                const data = response.data || response;
                return adapters.statsOverview(data);
            } catch (error) {
                console.warn("Fallback to mock data for stats", error);
                // throw error;
                return {
                    totalStudents: 52300,
                    activeCourses: 240,
                    totalInstructors: 180,
                    satisfactionRate: 99
                };
            }
        }
    },

    // ─── Learner Endpoints ───────────────────────────────────
    learner: {
        getProgress: async () => {
            try {
                const response = await httpClient.get('/learner/my-courses');
                return response.data || [];
            } catch (error) {
                console.warn("Fallback to mock data for learner progress", error);
                // throw error;
                return [
                    {
                        courseId: 1,
                        title: 'Machine Learning Fundamentals',
                        progress: 65,
                        lastLesson: 'Understanding Neural Networks and Deep Learning',
                        image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                    },
                    {
                        courseId: 2,
                        title: 'Advanced React Patterns',
                        progress: 45,
                        lastLesson: 'Advanced React Context and Hooks',
                        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                    },
                ];
            }
        },

        getStats: async () => {
            try {
                const response = await httpClient.get('/learner/stats');
                return response.data || response;
            } catch (error) {
                console.warn("Fallback to mock data for learner stats", error);
                // throw error;
                return {
                    hoursWatched: 12,
                    certificates: 2,
                    coursesInProgress: 4
                };
            }
        },

        getRecommendations: async () => {
            try {
                const response = await httpClient.get('/learner/recommendations');
                const data = response.data || [];
                return data.map(adapters.course);
            } catch (error) {
                console.warn("Fallback to mock data for learner recommendations", error);
                // throw error;
                return coursesSub.slice(0, 3);
            }
        },

    checkout: async (courseId) => {
      // throw error;
      const purchased = JSON.parse(
        localStorage.getItem("purchasedCourses") || "[]",
      );
      if (!purchased.includes(courseId)) {
        purchased.push(courseId);
        localStorage.setItem("purchasedCourses", JSON.stringify(purchased));
      }
      return { success: true, orderId: `ORD-${Date.now()}` };
    },

    getPurchase: async (courseId) => {
      // throw error;
      const purchased = JSON.parse(
        localStorage.getItem("purchasedCourses") || "[]",
      );
      if (purchased.includes(courseId)) {
        return {
          id: courseId,
          date: new Date().toISOString(),
          status: "completed",
        };
      }
      return null;
    },

    getSavedVideos: async () => {
      // throw error;
      // Return some samples from lecturesSub
      return lecturesSub.slice(0, 2).map((l) => ({
        id: l.id,
        title: l.title,
        courseTitle: l.course,
        thumbnail: l.thumbnail,
        duration: l.duration,
        savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      }));
    },

        getAnnouncements: async () => {
            try {
                const response = await httpClient.get('/learner/announcements');
                return response.data || [];
            } catch (error) {
                console.warn("Fallback to mock data for learner announcements", error);
                // throw error;
                return [
                    {
                        id: 1,
                        title: 'Welcome to Nexora AI!',
                        body: 'We are glad to have you on board. Start exploring our AI courses today.',
                        date: '2024-03-10',
                        type: 'system'
                    },
                    {
                        id: 2,
                        title: 'New Course Release: Advanced NLP',
                        body: 'A new course on Natural Language Processing has been released by Dr. Laila.',
                        date: '2024-03-12',
                        type: 'course',
                        courseId: 1
                    }
                ];
            }
        },

        getBillingHistory: async () => {
            try {
                const response = await httpClient.get('/learner/billing');
                return response.data || [];
            } catch (error) {
                console.warn("Fallback to mock data for billing history", error);
                // throw error;
                return [
                    {
                        id: 'TRX-98421',
                        courseTitle: 'Machine Learning Fundamentals',
                        amount: 19.99,
                        date: '2024-02-15T10:30:00Z',
                        status: 'completed',
                        paymentMethod: 'Stripe'
                    },
                    {
                        id: 'TRX-98425',
                        courseTitle: 'Advanced React Patterns',
                        amount: 24.99,
                        date: '2024-03-01T14:45:00Z',
                        status: 'completed',
                        paymentMethod: 'PayPal'
                    }
                ];
            }
        }
    },

    // ─── Instructor Dashboard Endpoints ─────────────────────
    instructor: {
        getStats: async () => {
            try {
                const response = await httpClient.get('/instructor/stats');
                return response.data || response;
            } catch (error) {
                console.warn("Fallback to mock data for instructor stats", error);
                throw error;
                return {
                    totalStudents: 15420,
                    totalRevenue: 24500,
                    avgRating: 4.8,
                    totalReviews: 850,
                    activeCourses: 12,
                    pendingReview: 2
                };
            }
        },

        courses: {
            getAll: async () => {
                try {
                    // Backend README says instructor courses are managed via /courses with instructor token
                    const response = await httpClient.get('/courses');
                    const data = response.data || [];
                    return data.map(adapters.course).map(c => ({
                        ...c,
                        students: c.students || 0,
                        status: c.status || 'published',
                        revenue: c.revenue || 0
                    }));
                } catch (error) {
                    console.warn("Fallback to mock data for instructor courses", error);
                    throw error;
                    return coursesSub.filter(c => c.instructorId === 1).map((c, index) => ({
                        ...c,
                        students: 120 + (index * 15),
                        status: 'published',
                        revenue: 1200 + (index * 350)
                    }));
                }
            },
            create: async (data) => {
                try {
                    const response = await httpClient.post('/courses', data);
                    return response.data || data;
                } catch (error) {
                    console.warn("Fallback to mock data for course create", error);
                    throw error;
                    const newCourse = { ...data, id: coursesSub.length + 1, instructorId: 1 };
                    coursesSub = [newCourse, ...coursesSub];
                    return newCourse;
                }
            },
            update: async (id, data) => {
                try {
                    const response = await httpClient.put(`/courses/${id}`, data);
                    return response.data || { ...data, id };
                } catch (error) {
                    console.warn("Fallback to mock data for course update", error);
                    throw error;
                    coursesSub = coursesSub.map(c => c.id === parseInt(id) ? { ...c, ...data } : c);
                    return { ...data, id };
                }
            },
            delete: async (id) => {
                try {
                    await httpClient.delete(`/courses/${id}`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for course delete", error);
                    throw error;
                    coursesSub = coursesSub.filter(c => c.id !== parseInt(id));
                    return { success: true };
                }
            }
        },

        lectures: {
            getAll: async (courseId) => {
                try {
                    const params = courseId !== 'all' ? { course: courseId } : {};
                    const response = await httpClient.get('/lectures', { params });
                    const data = response.data || [];
                    return data.map(adapters.lecture);
                } catch (error) {
                    console.warn("Fallback to mock data for instructor lectures", error);
                    throw error;
                    if (courseId === 'all') return lecturesSub;
                    return lecturesSub.filter(l => l.courseId === parseInt(courseId));
                }
            },
            create: async (data) => {
                try {
                    const normalizedData = {
                        ...data,
                        duration: normalizeDuration(data.duration)
                    };
                    const response = await httpClient.post('/lectures', normalizedData);
                    return response.data || normalizedData;
                } catch (error) {
                    console.warn("Fallback to mock data for lecture create", error);
                    throw error;
                    const normalizedData = {
                        ...data,
                        duration: normalizeDuration(data.duration)
                    };
                    const newLecture = { 
                        ...normalizedData, 
                        id: Date.now(), 
                        views: 0, 
                        date: new Date().toISOString().split('T')[0] 
                    };
                    lecturesSub = [newLecture, ...lecturesSub];
                    return newLecture;
                }
            },
            update: async (id, data) => {
                try {
                    const updateData = { ...data };
                    if (updateData.duration !== undefined) {
                        updateData.duration = normalizeDuration(updateData.duration);
                    }
                    const response = await httpClient.put(`/lectures/${id}`, updateData);
                    return response.data || { ...updateData, id };
                } catch (error) {
                    console.warn("Fallback to mock data for lecture update", error);
                    throw error;
                    const updateData = { ...data };
                    if (updateData.duration !== undefined) {
                        updateData.duration = normalizeDuration(updateData.duration);
                    }
                    lecturesSub = lecturesSub.map(l => l.id === parseInt(id) ? { ...l, ...updateData } : l);
                    return { ...updateData, id };
                }
            },
            delete: async (id) => {
                try {
                    await httpClient.delete(`/lectures/${id}`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for lecture delete", error);
                    throw error;
                    lecturesSub = lecturesSub.filter(l => l.id !== parseInt(id));
                    return { success: true };
                }
            },
            toggleStatus: async (id) => {
                try {
                    await httpClient.patch(`/lectures/${id}/status`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for lecture toggle status", error);
                    throw error;
                    lecturesSub = lecturesSub.map(l => l.id === parseInt(id) ? { ...l, status: l.status === 'published' ? 'draft' : 'published' } : l);
                    return { success: true };
                }
            }
        },

        reviews: {
            getAll: async () => {
                try {
                    const response = await httpClient.get('/reviews');
                    return response.data || [];
                } catch (error) {
                    console.warn("Fallback to mock data for reviews", error);
                    throw error;
                    return reviewsSub;
                }
            },
            reply: async (id, comment) => {
                try {
                    const response = await httpClient.put(`/reviews/${id}`, { reply: comment });
                    return response.data || { id, user: 'Instructor', comment, date: 'Just now' };
                } catch (error) {
                    console.warn("Fallback to mock data for review reply", error);
                    throw error;
                    reviewsSub = reviewsSub.map(r => 
                        r.id === id ? { ...r, reply: comment } : r
                    );
                    return { id, user: 'Instructor', comment, date: 'Just now' };
                }
            }
        },

        questions: {
            getAll: async () => {
                try {
                    const response = await httpClient.get('/questions');
                    return response.data || [];
                } catch (error) {
                    console.warn("Fallback to mock data for questions", error);
                    throw error;
                    return questionsSub;
                }
            },
            reply: async (id, replyText) => {
                try {
                    const response = await httpClient.put(`/questions/${id}`, { reply: replyText, isAnswered: true });
                    return response.data || { id, reply: replyText, date: 'Just now' };
                } catch (error) {
                    console.warn("Fallback to mock data for question reply", error);
                    throw error;
                    questionsSub = questionsSub.map(q => 
                        q.id === id ? { ...q, reply: replyText } : q
                    );
                    return { id, reply: replyText, date: 'Just now' };
                }
            }
        },

        announcements: {
            getAll: async (courseId) => {
                try {
                    const params = courseId !== 'all' ? { course: courseId } : {};
                    const response = await httpClient.get('/announcements', { params });
                    return response.data || [];
                } catch (error) {
                    console.warn("Fallback to mock data for instructor announcements", error);
                    throw error;
                    if (courseId === 'all') return announcementsSub;
                    return announcementsSub.filter(a => a.courseId === courseId);
                }
            },
            create: async (data) => {
                try {
                    const response = await httpClient.post('/announcements', data);
                    return response.data || data;
                } catch (error) {
                    console.warn("Fallback to mock data for announcement create", error);
                    throw error;
                    const newAnnouncement = { ...data, id: Date.now() };
                    announcementsSub = [newAnnouncement, ...announcementsSub];
                    return newAnnouncement;
                }
            }
        }
    },

    // ─── Admin Endpoints ─────────────────────────────────────
    admin: {
        stats: {
            getOverview: async () => {
                try {
                    const response = await httpClient.get('/admin/dashboard-stats');
                    return response.data || response;
                } catch (error) {
                    console.warn("Fallback to mock data for admin stats", error);
                    throw error;
                    return {
                        totalStudents: 1540,
                        activeCourses: mockCourses.length,
                        totalRevenue: 85000,
                        totalInstructors: 2,
                        videosUploaded: 48,
                        userGrowth: 12,
                        courseGrowth: 5,
                        videoGrowth: 8,
                        revenueGrowth: 15,
                        revenueChart: [40, 60, 45, 70, 65, 85, 95],
                        recentActivity: [
                            { id: 1, user: 'Ahmed Ali', action: 'Purchased: Machine Learning', time: '5m ago' },
                            { id: 2, user: 'Sara Kamel', action: 'Enrolled: React Patterns', time: '12m ago' },
                            { id: 3, user: 'Dr. Laila Hassan', action: 'Uploaded New Lecture', time: '45m ago' },
                            { id: 4, user: 'Ahmed Mansour', action: 'Updated Course Price', time: '1h ago' }
                        ]
                    };
                }
            },
        },

        users: {
            getAll: async () => {
                try {
                    const response = await httpClient.get('/users');
                    const data = response.data || [];
                    return data.map(adapters.user);
                } catch (error) {
                    console.warn("Fallback to mock data for admin users", error);
                    throw error;
                    return [
                        { id: 1, name: 'Dr. Laila Hassan', email: 'laila@nexora.ai', role: 'instructor', joined: '2023-01-10', status: 'active', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
                        { id: 2, name: 'Ahmed Mansour', email: 'ahmed@nexora.ai', role: 'instructor', joined: '2023-02-15', status: 'active', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
                        { id: 3, name: 'System Admin', email: 'admin@test.com', role: 'admin', joined: '2023-01-01', status: 'active', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80' },
                        { id: 4, name: 'Test Student', email: 'user@test.com', role: 'learner', joined: '2023-03-20', status: 'active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80' },
                        { id: 5, name: 'Ahmed Ali', email: 'ahmed.ali@example.com', role: 'learner', joined: '2023-05-12', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Ahmed+Ali&background=random' },
                        { id: 6, name: 'Sara Kamel', email: 'sara.kamel@example.com', role: 'learner', joined: '2023-06-18', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Sara+Kamel&background=random' },
                    ];
                }
            },
            create: async (data) => {
                try {
                    const response = await httpClient.post('/users', data);
                    return response.data || { ...data, id: Date.now() };
                } catch (error) {
                    console.warn("Fallback to mock data for admin user create", error);
                    throw error;
                    return { ...data, id: Date.now() };
                }
            },
            update: async (id, data) => {
                try {
                    const response = await httpClient.put(`/users/${id}`, data);
                    return response.data || { ...data, id };
                } catch (error) {
                    console.warn("Fallback to mock data for admin user update", error);
                    throw error;
                    return { ...data, id };
                }
            },
            delete: async (id) => {
                try {
                    await httpClient.delete(`/users/${id}`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for admin user delete", error);
                    throw error;
                    return { success: true };
                }
            },
            toggleStatus: async (id) => {
                try {
                    await httpClient.patch(`/users/${id}/status`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for admin user toggle status", error);
                    throw error;
                    return { success: true };
                }
            }
        },

        courses: {
            getAll: async () => {
                try {
                    const response = await httpClient.get('/courses');
                    const data = response.data || [];
                    return data.map(adapters.course);
                } catch (error) {
                    console.warn("Fallback to mock data for admin courses", error);
                    throw error;
                    return coursesSub;
                }
            },
            create: async (data) => {
                try {
                    const response = await httpClient.post('/courses', data);
                    return response.data || { ...data, id: Date.now() };
                } catch (error) {
                    console.warn("Fallback to mock data for admin course create", error);
                    throw error;
                    const newCourse = { ...data, id: Date.now() };
                    coursesSub = [newCourse, ...coursesSub];
                    return newCourse;
                }
            },
            update: async (id, data) => {
                try {
                    const response = await httpClient.put(`/courses/${id}`, data);
                    return response.data || { ...data, id };
                } catch (error) {
                    console.warn("Fallback to mock data for admin course update", error);
                    throw error;
                    coursesSub = coursesSub.map(c => c.id === parseInt(id) ? { ...c, ...data } : c);
                    return { ...data, id };
                }
            },
            delete: async (id) => {
                try {
                    await httpClient.delete(`/courses/${id}`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for admin course delete", error);
                    throw error;
                    coursesSub = coursesSub.filter(c => c.id !== parseInt(id));
                    return { success: true };
                }
            }
        },

        videos: {
            getAll: async () => {
                try {
                    const response = await httpClient.get('/lectures');
                    return response.data || [];
                } catch (error) {
                    console.warn("Fallback to mock data for admin videos", error);
                    throw error;
                    return lecturesSub;
                }
            },
            create: async (data) => {
                try {
                    const normalizedData = {
                        ...data,
                        duration: normalizeDuration(data.duration)
                    };
                    const response = await httpClient.post('/lectures', normalizedData);
                    return response.data || normalizedData;
                } catch (error) {
                    console.warn("Fallback to mock data for admin video create", error);
                    throw error;
                    const normalizedData = {
                        ...data,
                        duration: normalizeDuration(data.duration)
                    };
                    const newLecture = { 
                        ...normalizedData, 
                        id: Date.now(), 
                        views: 0, 
                        date: new Date().toISOString().split('T')[0] 
                    };
                    lecturesSub = [newLecture, ...lecturesSub];
                    return newLecture;
                }
            },
            update: async (id, data) => {
                try {
                    const response = await httpClient.put(`/lectures/${id}`, data);
                    return response.data || { ...data, id };
                } catch (error) {
                    console.warn("Fallback to mock data for admin video update", error);
                    throw error;
                    lecturesSub = lecturesSub.map(v => v.id === parseInt(id) ? { ...v, ...data } : v);
                    return { ...data, id };
                }
            },
            delete: async (id) => {
                try {
                    await httpClient.delete(`/lectures/${id}`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for admin video delete", error);
                    throw error;
                    lecturesSub = lecturesSub.filter(v => v.id !== parseInt(id));
                    return { success: true };
                }
            },
            toggleStatus: async (id) => {
                try {
                    await httpClient.patch(`/lectures/${id}/status`);
                    return { success: true };
                } catch (error) {
                    console.warn("Fallback to mock data for admin video toggle status", error);
                    throw error;
                    lecturesSub = lecturesSub.map(v => v.id === parseInt(id) ? { ...v, status: v.status === 'published' ? 'draft' : 'published' } : v);
                    return { success: true };
                }
            }
        },

    settings: {
      get: async () => {
        throw error;
        return {
          platformName: "Nexora AI",
          supportEmail: "support@nexora.ai",
          maintenanceMode: false,
          enableAiTutor: true,
          defaultAiModel: "gpt-4-turbo",
          feedbackIntensity: "medium",
          autoApproveCourses: false,
          defaultCurrency: "USD",
          googleLogin: true,
          githubLogin: true,
        };
      },
      update: async (data) => {
        throw error;
        console.log("Settings updated:", data);
        return { success: true, settings: data };
      },
    },
  },

  // ─── AI Chat & Video Assistant ──────────────────────────
  ai: {
    /**
     * POST /api/ai/ask
     * Sends the user's question to the AI along with lecture context (title, description, chunks).
     * @param {Object} params
     * @param {string} params.title        - Lecture title
     * @param {string} params.description  - Lecture description
     * @param {string} params.question     - The user's question
     * @param {Array}  params.chunks       - data.transcript.chunks from the lecture API
     */
    ask: async ({ title, description, question, chunks = [] }) => {
      try {
        const response = await httpClient.post('/ai/ask', {
          title,
          description,
          question,
          chunks,
        });
        // Backend is expected to return { message: "..." } or { data: { message: "..." } }
        return {
          message: response?.data?.message || response?.message || response,
        };
      } catch (error) {
        console.warn('Fallback to mock for ai.ask', error);
        // Graceful mock fallback
        throw error;
        const isAr = i18n.language === 'ar';
        return {
          message: isAr
            ? `بناءً على محتوى المحاضرة "${title}"، سؤالك عن "${question}" يتعلق بـ: ${chunks.slice(0, 2).map(c => c.text).join(' ')} ...`
            : `Based on the lecture "${title}", your question about "${question}" relates to: ${chunks.slice(0, 2).map(c => c.text).join(' ')} ...`,
        };
      }
    },

    chat: async (message, context = {}) => {
      throw error;
      const msg = message.toLowerCase();
      const isAr = i18n.language === "ar";

      if (
        msg.includes("react") ||
        msg.includes("component") ||
        msg.includes("ريأكت")
      ) {
        return {
          message: isAr
            ? "ريأكت (React) هي مكتبة JavaScript لبناء واجهات المستخدم. تعتمد على فكرة المكونات (Components) التي تجعل الكود قابلاً لإعادة الاستخدام وسهل الصيانة."
            : "React is a JavaScript library for building user interfaces. It relies on the concept of Components, making code reusable and easier to maintain.",
        };
      }
      if (
        msg.includes("python") ||
        msg.includes("loop") ||
        msg.includes("بايثون")
      ) {
        return {
          message: isAr
            ? "بايثون هي لغة برمجة قوية وسهلة التعلم. تُستخدم بكثرة في علم البيانات، الذكاء الاصطناعي، وتطوير الويب لسهولة قراءة كودها وتوفر مكتبات ضخمة لها."
            : "Python is a powerful and easy-to-learn programming language. It is widely used in Data Science, AI, and Web Development due to its readability and massive library support.",
        };
      }
      if (
        msg.includes("machine learning") ||
        msg.includes("ml") ||
        msg.includes("ai") ||
        msg.includes("تعلم الآلة") ||
        msg.includes("ذكاء اصطناعي")
      ) {
        return {
          message: isAr
            ? "تعلم الآلة (ML) هو فرع من الذكاء الاصطناعي يركز على بناء أنظمة تتعلم من البيانات وتحسن أداءها مع الوقت دون برمجة صريحة لكل خطوة."
            : "Machine Learning (ML) is a branch of AI focusing on building systems that learn from data and improve over time without being explicitly programmed for every step.",
        };
      }
      if (msg.includes("code") || msg.includes("مثال") || msg.includes("كود")) {
        return {
          message: isAr
            ? "بالتأكيد! إليك مثال بسيط لمكون React:\n\n```javascript\nfunction Welcome() {\n  return (\n    <div className='p-4 bg-blue-500 text-white rounded-lg'>\n      <h1>أهلاً بك في مشروعي!</h1>\n    </div>\n  );\n}\n```\nشوفت التنسيق جميل إزاي؟ ✨"
            : "Sure thing! Here is a simple React component example:\n\n```javascript\nfunction Welcome() {\n  return (\n    <div className='p-4 bg-blue-500 text-white rounded-lg'>\n      <h1>Welcome to my project!</h1>\n    </div>\n  );\n}\n```\nI have formatted it for you! ✨",
        };
      }

      return {
        message: isAr
          ? `سؤال مثير للاهتمام! سأقوم بتحليل "${message}" والرد عليك بالتفصيل بناءً على المصادر المتاحة لدي.`
          : `Interesting question! I will analyze "${message}" and provide a detailed response based on the available resources.`,
      };
    },
    /**
     * AI Video Assistant
     * Handles auto-prompts on pause and contextual user questions.
     */
    videoAssistant: async ({ lectureId, currentTime, action, query }) => {
      throw error;

      // 1. Auto Prompt logic
      if (action === "auto_prompt") {
        return {
          message:
            i18n.language === "ar"
              ? "لاحظت أنك توقفت هنا. هل تود أن أشرح لك المفهوم البرمجي الذي يظهر على الشاشة الآن؟"
              : "I noticed you paused here. Would you like me to explain the concept being shown on screen right now?",
          suggested: true,
        };
      }

      // 2. Specialized responses for specific contextual queries
      if (action === "show-code" || (query && query.includes("code"))) {
        return {
          message:
            i18n.language === "ar"
              ? "بالتأكيد! إليك كود برمجي يوضح المفهوم الذي يتم شرحه في الفيديو:\n\n```javascript\nimport { useState, useEffect } from 'react';\n\nexport const useDebounce = (value, delay) => {\n  const [val, setVal] = useState(value);\n  useEffect(() => {\n    const h = setTimeout(() => setVal(value), delay);\n    return () => clearTimeout(h);\n  }, [value, delay]);\n  return val;\n};\n```\n\nويمكنك نسخه مباشرة وتجربته في مشروعك! 🚀"
              : "Certainly! Here's a clean implementation of the Custom Hook discussed in the video:\n\n```javascript\nimport { useState, useEffect } from 'react';\n\nexport const useDebounce = (value, delay) => {\n  const [val, setVal] = useState(value);\n  useEffect(() => {\n    const h = setTimeout(() => setVal(value), delay);\n    return () => clearTimeout(h);\n  }, [value, delay]);\n  return val;\n};\n```\n\nYou can copy this directly into your project! 🚀",
          suggested: false,
        };
      }

      if (action === "explain-scene" || action === "explain-section") {
        return {
          message:
            i18n.language === "ar"
              ? "أرى شرحًا لبنية الـ React Context تظهر على الشاشة. يتحدث المعلم في هذه اللحظة عن كيفية تمرير البيانات عبر شجرة المكونات دون الحاجة لاستخدام الـ Props يدوياً."
              : "I see a structural diagram showing React Context architecture. The instructor is explaining how data is passed through the component tree without manually passing props at every level.",
          suggested: false,
        };
      }

      // 3. Default fallback response
      return {
        message:
          i18n.language === "ar"
            ? `سؤال رائع عن محتوى الفيديو عند الثانية ${Math.floor(currentTime)}. في هذا الجزء، يشرح المحاضر كيفية تحسين أداء التطبيق وتقليل عمليات إعادة الـ Rendering لزيادة السرعة.`
            : `That's a great question about the content at ${Math.floor(currentTime)}s. In this part, the instructor is discussing how to optimize application performance and minimize re-renders for speed.`,
        suggested: false,
      };
    },
  },

    // ─── Testimonials ────────────────────────────────────────
    testimonials: {
        getAll: async () => {
            try {
                const response = await httpClient.get('/testimonials');
                const data = response.data || [];
                return data.map(adapters.testimonial);
            } catch (error) {
                console.warn("Fallback to mock data for testimonials", error);
                // throw error;
                return testimonials;
            }
        }
    }
};
