/**
 * API Service Layer
 * -----------------
 * This file is the SINGLE integration point for all backend API calls.
 * Currently uses mock data from src/data/mockData.js.
 * 
 * TO INTEGRATE WITH BACKEND:
 * 1. Replace the mock implementations with fetch/axios calls
 * 2. Update BASE_URL to your backend URL
 * 3. Add token from localStorage to Authorization header
 * 
 * Example:
 *   const BASE_URL = 'https://your-api.com/api';
 *   const headers = () => ({
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${localStorage.getItem('ai_edu_token')}`
 *   });
 */

import { courses, categories, testimonials } from '../data/mockData';

// Simulated network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    // ─── Course Endpoints ────────────────────────────────────
    // Backend: GET /api/courses
    courses: {
        /**
         * Get all courses
         * Backend: GET /api/courses?category=X&search=Y
         * Response: Course[]
         */
        getAll: async (filters = {}) => {
            await delay(600);
            let result = [...courses];
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

        /**
         * Get single course by ID
         * Backend: GET /api/courses/:id
         * Response: Course (with curriculum, reviews)
         */
        getById: async (id) => {
            await delay(600);
            const course = courses.find((c) => c.id === parseInt(id));
            if (!course) throw new Error('Course not found');
            return course;
        },

        /**
         * Get available categories
         * Backend: GET /api/categories
         * Response: Category[]
         */
        getCategories: async () => {
            await delay(400);
            return categories;
        },
    },

    // ─── Learner Endpoints ───────────────────────────────────
    // Backend: GET /api/learner/*
    learner: {
        /**
         * Get enrolled courses with progress
         * Backend: GET /api/learner/progress
         * Headers: Authorization: Bearer <token>
         * Response: { courseId, title, progress, lastLesson }[]
         */
        getProgress: async () => {
            await delay(500);
            return [
                {
                    courseId: 1,
                    title: 'Machine Learning Fundamentals',
                    progress: 65,
                    lastLesson: 'Lecture 14: Gradient Descent',
                    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                },
                {
                    courseId: 2,
                    title: 'Advanced React Patterns',
                    progress: 45,
                    lastLesson: 'Lesson 5: Higher Order Components',
                    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                },
            ];
        },

        /**
         * Get learner stats
         * Backend: GET /api/learner/stats
         * Response: { hoursWatched, certificates, coursesInProgress }
         */
        getStats: async () => {
            await delay(500);
            return {
                hoursWatched: 12,
                certificates: 2,
                coursesInProgress: 4
            };
        },

        /**
         * Get recommended courses for this learner
         * Backend: GET /api/learner/recommendations
         * Response: Course[] (based on AI/ML analysis)
         */
        getRecommendations: async () => {
            await delay(600);
            return courses.slice(0, 3);
        },
    },

    // ─── Instructor Endpoints ────────────────────────────────
    // Backend: GET /api/instructor/*
    instructor: {
        /**
         * Get instructor dashboard stats
         * Backend: GET /api/instructor/stats
         * Response: { totalStudents, totalRevenue, avgRating, activeCourses }
         */
        getStats: async () => {
            await delay(500);
            return {
                totalStudents: 1234,
                totalRevenue: '$12.5k',
                avgRating: 4.8,
                totalReviews: 500,
                activeCourses: 8,
                pendingReview: 2
            };
        },

        /**
         * Get instructor's courses
         * Backend: GET /api/instructor/courses
         * Response: InstructorCourse[]
         */
        getCourses: async () => {
            await delay(600);
            return [
                {
                    id: 1,
                    title: 'Introduction to AI v1.0',
                    students: 120,
                    status: 'Published',
                    revenue: '$1,200',
                    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                },
                {
                    id: 2,
                    title: 'Introduction to AI v2.0',
                    students: 85,
                    status: 'Published',
                    revenue: '$950',
                    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                },
                {
                    id: 3,
                    title: 'Introduction to AI v3.0',
                    students: 200,
                    status: 'Draft',
                    revenue: '$0',
                    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                },
            ];
        },
    },

    // ─── Admin Endpoints ─────────────────────────────────────
    // Backend: GET /api/admin/*
    admin: {
        /**
         * Get admin dashboard stats
         * Backend: GET /api/admin/stats
         * Response: { totalUsers, activeCourses, totalRevenue, activeUsers }
         */
        getStats: async () => {
            await delay(500);
            return {
                totalUsers: 12345,
                activeCourses: courses.length,
                totalRevenue: 45678,
                activeUsers: 890
            };
        },

        /**
         * Get all users (admin)
         * Backend: GET /api/admin/users?page=X&limit=Y
         * Response: { users: User[], total: number }
         */
        getUsers: async () => {
            await delay(600);
            return [
                { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'learner', joined: '2023-10-15' },
                { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'learner', joined: '2023-11-02' },
                { id: 3, name: 'Charlie Kim', email: 'charlie@example.com', role: 'instructor', joined: '2023-09-01' },
                { id: 4, name: 'David Lee', email: 'david@example.com', role: 'learner', joined: '2023-12-10' },
                { id: 5, name: 'Emma Wilson', email: 'emma@example.com', role: 'admin', joined: '2024-01-05' },
            ];
        },
    },

    // ─── AI Chat Endpoints ───────────────────────────────────
    // Backend: POST /api/ai/chat
    ai: {
        /**
         * Send message to AI tutor
         * Backend: POST /api/ai/chat
         * Body: { message, context?: { courseId, videoTimestamp } }
         * Response: { response: string }
         */
        chat: async (message, context = {}) => {
            await delay(1500);
            return {
                response: `I analyzed your question: "${message}". Based on the current context, here is a detailed explanation...`
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
