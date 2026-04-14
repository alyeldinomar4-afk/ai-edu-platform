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

// Mutable data stores for synchronization
let coursesSub = [...mockCourses];
let lecturesSub = [...mockLectures];
let questionsSub = [...instructorQuestions];
let reviewsSub = [...instructorReviews];

// Simulated network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeDuration = (duration) => {
    // Backend expects number (seconds). If UI sends a string (e.g. "10:30"), we convert it here.
    if (typeof duration === 'number') return duration;
    
    if (typeof duration === 'string' && duration.includes(':')) {
        const parts = duration.split(':').map(Number);
        if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
        if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    }
    
    const num = parseInt(duration, 10);
    return isNaN(num) ? 0 : num;
};

export const api = {
    // ─── Profile Endpoints ───────────────────────────────────
    profile: {
        update: async (data) => {
            await delay(800);
            console.log('Profile updated:', data);
            return { success: true, user: data };
        },
        updatePassword: async (data) => {
            await delay(1000);
            console.log('Password updated');
            return { success: true };
        }
    },

    // ─── Course Endpoints ────────────────────────────────────
    courses: {
        getAll: async (filters = {}) => {
            await delay(600);
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
        },

        getById: async (id) => {
            await delay(600);
            const course = coursesSub.find((c) => c.id === parseInt(id));
            if (!course) throw new Error('Course not found');
            return course;
        },

        getCategories: async () => {
            await delay(400);
            return categories;
        },

        getLectures: async (id) => {
            await delay(500);
            return lecturesSub.filter(l => l.courseId === parseInt(id));
        },
    },

    // ─── Instructors Public Endpoints ────────────────────────
    instructors: {
        getAll: async () => {
            await delay(500);
            return mockInstructors;
        },
        getById: async (id) => {
            await delay(500);
            return mockInstructors.find(ins => ins.id === parseInt(id));
        }
    },
 
    // ─── Statistics Endpoints ───────────────────────────────
    stats: {
        getPublicOverview: async () => {
            await delay(500);
            return {
                totalStudents: 52300,
                activeCourses: 240,
                totalInstructors: 180,
                satisfactionRate: 99
            };
        }
    },

    // ─── Learner Endpoints ───────────────────────────────────
    learner: {
        getProgress: async () => {
            await delay(500);
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
        },

        getStats: async () => {
            await delay(500);
            return {
                hoursWatched: 12,
                certificates: 2,
                coursesInProgress: 4
            };
        },

        getRecommendations: async () => {
            await delay(600);
            return coursesSub.slice(0, 3);
        },

        checkout: async (courseId) => {
            await delay(1000);
            const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
            if (!purchased.includes(parseInt(courseId))) {
                purchased.push(parseInt(courseId));
                localStorage.setItem('purchasedCourses', JSON.stringify(purchased));
            }
            return { success: true, orderId: `ORD-${Date.now()}` };
        },

        getPurchase: async (courseId) => {
            await delay(500);
            const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
            if (purchased.includes(parseInt(courseId))) {
                return { id: courseId, date: new Date().toISOString(), status: 'completed' };
            }
            return null;
        },

        getSavedVideos: async () => {
            await delay(600);
            // Return some samples from lecturesSub
            return lecturesSub.slice(0, 2).map(l => ({
                id: l.id,
                title: l.title,
                courseTitle: l.course,
                thumbnail: l.thumbnail,
                duration: l.duration,
                savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
            }));
        },

        getAnnouncements: async () => {
            await delay(400);
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
        },

        getBillingHistory: async () => {
            await delay(700);
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
    },

    // ─── Instructor Dashboard Endpoints ─────────────────────
    instructor: {
        getStats: async () => {
            await delay(500);
            return {
                totalStudents: 15420,
                totalRevenue: 24500,
                avgRating: 4.8,
                totalReviews: 850,
                activeCourses: 12,
                pendingReview: 2
            };
        },

        courses: {
            getAll: async () => {
                await delay(600);
                return coursesSub.filter(c => c.instructorId === 1).map((c, index) => ({
                    ...c,
                    students: 120 + (index * 15),
                    status: 'published',
                    revenue: 1200 + (index * 350)
                }));
            },
            create: async (data) => {
                await delay(800);
                const newCourse = { ...data, id: coursesSub.length + 1, instructorId: 1 };
                coursesSub = [newCourse, ...coursesSub];
                return newCourse;
            },
            update: async (id, data) => {
                await delay(800);
                coursesSub = coursesSub.map(c => c.id === parseInt(id) ? { ...c, ...data } : c);
                return { ...data, id };
            },
            delete: async (id) => {
                await delay(500);
                coursesSub = coursesSub.filter(c => c.id !== parseInt(id));
                return { success: true };
            }
        },

        lectures: {
            getAll: async (courseId) => {
                await delay(500);
                if (courseId === 'all') return lecturesSub;
                return lecturesSub.filter(l => l.courseId === parseInt(courseId));
            },
            create: async (data) => {
                await delay(800);
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
            },
            update: async (id, data) => {
                await delay(800);
                const updateData = { ...data };
                if (updateData.duration !== undefined) {
                    updateData.duration = normalizeDuration(updateData.duration);
                }
                lecturesSub = lecturesSub.map(l => l.id === parseInt(id) ? { ...l, ...updateData } : l);
                return { ...updateData, id };
            },
            delete: async (id) => {
                await delay(500);
                lecturesSub = lecturesSub.filter(l => l.id !== parseInt(id));
                return { success: true };
            },
            toggleStatus: async (id) => {
                await delay(400);
                lecturesSub = lecturesSub.map(l => l.id === parseInt(id) ? { ...l, status: l.status === 'published' ? 'draft' : 'published' } : l);
                return { success: true };
            }
        },

        reviews: {
            getAll: async () => {
                await delay(500);
                return reviewsSub;
            },
            reply: async (id, comment) => {
                await delay(500);
                reviewsSub = reviewsSub.map(r => 
                    r.id === id ? { ...r, reply: comment } : r
                );
                return { id, user: 'Instructor', comment, date: 'Just now' };
            }
        },

        questions: {
            getAll: async () => {
                await delay(500);
                return questionsSub;
            },
            reply: async (id, replyText) => {
                await delay(500);
                questionsSub = questionsSub.map(q => 
                    q.id === id ? { ...q, reply: replyText } : q
                );
                return { id, reply: replyText, date: 'Just now' };
            }
        },

        announcements: {
            getAll: async (courseId) => {
                await delay(400);
                if (courseId === 'all') return instructorAnnouncements;
                return instructorAnnouncements.filter(a => a.courseId === courseId);
            },
            create: async (data) => {
                await delay(500);
                return { ...data, id: Date.now() };
            }
        }
    },

    // ─── Admin Endpoints ─────────────────────────────────────
    admin: {
        stats: {
            getOverview: async () => {
                await delay(500);
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
            },
        },

        users: {
            getAll: async () => {
                await delay(600);
                return [
                    { id: 1, name: 'Dr. Laila Hassan', email: 'laila@nexora.ai', role: 'instructor', joined: '2023-01-10', status: 'active', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
                    { id: 2, name: 'Ahmed Mansour', email: 'ahmed@nexora.ai', role: 'instructor', joined: '2023-02-15', status: 'active', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
                    { id: 3, name: 'System Admin', email: 'admin@test.com', role: 'admin', joined: '2023-01-01', status: 'active', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80' },
                    { id: 4, name: 'Test Student', email: 'user@test.com', role: 'learner', joined: '2023-03-20', status: 'active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80' },
                    { id: 5, name: 'Ahmed Ali', email: 'ahmed.ali@example.com', role: 'learner', joined: '2023-05-12', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Ahmed+Ali&background=random' },
                    { id: 6, name: 'Sara Kamel', email: 'sara.kamel@example.com', role: 'learner', joined: '2023-06-18', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Sara+Kamel&background=random' },
                ];
            },
            create: async (data) => {
                await delay(800);
                return { ...data, id: Date.now() };
            },
            update: async (id, data) => {
                await delay(800);
                return { ...data, id };
            },
            delete: async (id) => {
                await delay(500);
                return { success: true };
            },
            toggleStatus: async (id) => {
                await delay(400);
                return { success: true };
            }
        },

        courses: {
            getAll: async () => {
                await delay(600);
                return coursesSub;
            },
            create: async (data) => {
                await delay(800);
                const newCourse = { ...data, id: Date.now() };
                coursesSub = [newCourse, ...coursesSub];
                return newCourse;
            },
            update: async (id, data) => {
                await delay(800);
                coursesSub = coursesSub.map(c => c.id === parseInt(id) ? { ...c, ...data } : c);
                return { ...data, id };
            },
            delete: async (id) => {
                await delay(500);
                coursesSub = coursesSub.filter(c => c.id !== parseInt(id));
                return { success: true };
            }
        },

        videos: {
            getAll: async () => {
                await delay(600);
                return lecturesSub;
            },
            create: async (data) => {
                await delay(800);
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
            },
            update: async (id, data) => {
                await delay(800);
                lecturesSub = lecturesSub.map(v => v.id === parseInt(id) ? { ...v, ...data } : v);
                return { ...data, id };
            },
            delete: async (id) => {
                await delay(500);
                lecturesSub = lecturesSub.filter(v => v.id !== parseInt(id));
                return { success: true };
            },
            toggleStatus: async (id) => {
                await delay(400);
                lecturesSub = lecturesSub.map(v => v.id === parseInt(id) ? { ...v, status: v.status === 'published' ? 'draft' : 'published' } : v);
                return { success: true };
            }
        },

        settings: {
            get: async () => {
                await delay(600);
                return {
                    platformName: 'Nexora AI',
                    supportEmail: 'support@nexora.ai',
                    maintenanceMode: false,
                    enableAiTutor: true,
                    defaultAiModel: 'gpt-4-turbo',
                    feedbackIntensity: 'medium',
                    autoApproveCourses: false,
                    defaultCurrency: 'USD',
                    googleLogin: true,
                    githubLogin: true
                };
            },
            update: async (data) => {
                await delay(1000);
                console.log('Settings updated:', data);
                return { success: true, settings: data };
            }
        }
    },

    // ─── AI Chat & Video Assistant ──────────────────────────
    ai: {
        chat: async (message, context = {}) => {
            await delay(1200);
            const msg = message.toLowerCase();
            const isAr = i18n.language === 'ar';

            if (msg.includes('react') || msg.includes('component') || msg.includes('ريأكت')) {
                return { message: isAr ? "ريأكت (React) هي مكتبة JavaScript لبناء واجهات المستخدم. تعتمد على فكرة المكونات (Components) التي تجعل الكود قابلاً لإعادة الاستخدام وسهل الصيانة." : "React is a JavaScript library for building user interfaces. It relies on the concept of Components, making code reusable and easier to maintain." };
            }
            if (msg.includes('python') || msg.includes('loop') || msg.includes('بايثون')) {
                return { message: isAr ? "بايثون هي لغة برمجة قوية وسهلة التعلم. تُستخدم بكثرة في علم البيانات، الذكاء الاصطناعي، وتطوير الويب لسهولة قراءة كودها وتوفر مكتبات ضخمة لها." : "Python is a powerful and easy-to-learn programming language. It is widely used in Data Science, AI, and Web Development due to its readability and massive library support." };
            }
            if (msg.includes('machine learning') || msg.includes('ml') || msg.includes('ai') || msg.includes('تعلم الآلة') || msg.includes('ذكاء اصطناعي')) {
                return { message: isAr ? "تعلم الآلة (ML) هو فرع من الذكاء الاصطناعي يركز على بناء أنظمة تتعلم من البيانات وتحسن أداءها مع الوقت دون برمجة صريحة لكل خطوة." : "Machine Learning (ML) is a branch of AI focusing on building systems that learn from data and improve over time without being explicitly programmed for every step." };
            }
            if (msg.includes('code') || msg.includes('مثال') || msg.includes('كود')) {
                return {
                    message: isAr
                        ? "بالتأكيد! إليك مثال بسيط لمكون React:\n\n```javascript\nfunction Welcome() {\n  return (\n    <div className='p-4 bg-blue-500 text-white rounded-lg'>\n      <h1>أهلاً بك في مشروعي!</h1>\n    </div>\n  );\n}\n```\nشوفت التنسيق جميل إزاي؟ ✨"
                        : "Sure thing! Here is a simple React component example:\n\n```javascript\nfunction Welcome() {\n  return (\n    <div className='p-4 bg-blue-500 text-white rounded-lg'>\n      <h1>Welcome to my project!</h1>\n    </div>\n  );\n}\n```\nI have formatted it for you! ✨"
                };
            }

            return {
                message: isAr ? `سؤال مثير للاهتمام! سأقوم بتحليل "${message}" والرد عليك بالتفصيل بناءً على المصادر المتاحة لدي.` : `Interesting question! I will analyze "${message}" and provide a detailed response based on the available resources.`
            };
        },
        /**
         * AI Video Assistant
         * Handles auto-prompts on pause and contextual user questions.
         */
        videoAssistant: async ({ lectureId, currentTime, action, query }) => {
            await delay(800);
            
            // 1. Auto Prompt logic
            if (action === 'auto_prompt') {
                return {
                    message: i18n.language === 'ar' 
                        ? "لاحظت أنك توقفت هنا. هل تود أن أشرح لك المفهوم البرمجي الذي يظهر على الشاشة الآن؟"
                        : "I noticed you paused here. Would you like me to explain the concept being shown on screen right now?",
                    suggested: true
                };
            }

            // 2. Specialized responses for specific contextual queries
            if (action === 'show-code' || (query && query.includes('code'))) {
                return {
                    message: i18n.language === 'ar'
                        ? "بالتأكيد! إليك كود برمجي يوضح المفهوم الذي يتم شرحه في الفيديو:\n\n```javascript\nimport { useState, useEffect } from 'react';\n\nexport const useDebounce = (value, delay) => {\n  const [val, setVal] = useState(value);\n  useEffect(() => {\n    const h = setTimeout(() => setVal(value), delay);\n    return () => clearTimeout(h);\n  }, [value, delay]);\n  return val;\n};\n```\n\nويمكنك نسخه مباشرة وتجربته في مشروعك! 🚀"
                        : "Certainly! Here's a clean implementation of the Custom Hook discussed in the video:\n\n```javascript\nimport { useState, useEffect } from 'react';\n\nexport const useDebounce = (value, delay) => {\n  const [val, setVal] = useState(value);\n  useEffect(() => {\n    const h = setTimeout(() => setVal(value), delay);\n    return () => clearTimeout(h);\n  }, [value, delay]);\n  return val;\n};\n```\n\nYou can copy this directly into your project! 🚀",
                    suggested: false
                };
            }

            if (action === 'explain-scene' || action === 'explain-section') {
                return {
                    message: i18n.language === 'ar' 
                        ? "أرى شرحًا لبنية الـ React Context تظهر على الشاشة. يتحدث المعلم في هذه اللحظة عن كيفية تمرير البيانات عبر شجرة المكونات دون الحاجة لاستخدام الـ Props يدوياً."
                        : "I see a structural diagram showing React Context architecture. The instructor is explaining how data is passed through the component tree without manually passing props at every level.",
                    suggested: false
                };
            }

            // 3. Default fallback response
            return {
                message: i18n.language === 'ar'
                    ? `سؤال رائع عن محتوى الفيديو عند الثانية ${Math.floor(currentTime)}. في هذا الجزء، يشرح المحاضر كيفية تحسين أداء التطبيق وتقليل عمليات إعادة الـ Rendering لزيادة السرعة.`
                    : `That's a great question about the content at ${Math.floor(currentTime)}s. In this part, the instructor is discussing how to optimize application performance and minimize re-renders for speed.`,
                suggested: false
            };
        }
    },

    // ─── Testimonials ────────────────────────────────────────
    testimonials: {
        getAll: async () => {
            await delay(300);
            return testimonials;
        }
    }
};
