/**
 * Authentication Service
 * 
 * Integrated with Backend endpoints:
 * - login()    → POST /auth/signin
 * - register() → POST /auth/signup
 */

import httpClient from './httpClient';

const USERS_KEY = 'ai_edu_users_db';
const TOKEN_KEY = 'ai_edu_token';
const CURRENT_USER_KEY = 'ai_edu_user';

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get users from local storage (Simulating a database)
const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save users
const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
    // Login
    login: async (email, password) => {
        try {
            const response = await httpClient.post('/auth/signin', { email, password });
            // The API response might have response.data or just be the response object directly depending on httpClient config
            const data = response.data || response;
            const user = data.user || data.profile || data;
            const token = data.token;
            
            return {
                user: {
                    id: user._id || user.id,
                    name: user.fullName || user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar?.url || user.avatar || `https://i.pravatar.cc/150?u=${user.email}`
                },
                token
            };
        } catch (error) {
            console.warn("Fallback to mock data for login", error);
            await delay(800); // Simulate network delay

            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                // For checking purposes, allow a default admin if not exists
                if (email === 'admin@test.com' && password === 'admin123') {
                    const adminUser = {
                        id: 'admin-1',
                        name: 'System Admin',
                        email: 'admin@test.com',
                        role: 'admin',
                        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80'
                    };
                    return {
                        user: adminUser,
                        token: 'mock-jwt-token-admin-' + Date.now()
                    };
                }

                // Allow default student user
                if (email === 'user@test.com' && password === '123456') {
                    const studentUser = {
                        id: 'student-1',
                        name: 'Test Student',
                        email: 'user@test.com',
                        role: 'learner',
                        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80'
                    };
                    return {
                        user: studentUser,
                        token: 'mock-jwt-token-learner-' + Date.now()
                    };
                }

                // Allow default instructor user
                if (email === 'instructor@test.com' && password === '123456') {
                    const instructorUser = {
                        id: 'instructor-1',
                        name: 'Test Instructor',
                        email: 'instructor@test.com',
                        role: 'instructor',
                        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80'
                    };
                    return {
                        user: instructorUser,
                        token: 'mock-jwt-token-instructor-' + Date.now()
                    };
                }

                throw new Error('Invalid email or password');
            }

            // Generate a mock token
            const token = `mock-jwt-token-${user.role}-${Date.now()}`;

            // Return user info (excluding password) and token
            const { password: _, ...userWithoutPassword } = user;
            return {
                user: userWithoutPassword,
                token
            };
        }
    },

    // Register
    register: async (name, email, password, role = 'learner') => {
        try {
            // Note: backend expects fullName for signup
            const response = await httpClient.post('/auth/signup', { fullName: name, email, password, role });
            const data = response.data || response;
            const user = data.user || data.profile || data;
            const token = data.token;
            
            return {
                user: {
                    id: user._id || user.id,
                    name: user.fullName || user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar?.url || user.avatar || `https://i.pravatar.cc/150?u=${user.email}`
                },
                token
            };
        } catch (error) {
            console.warn("Fallback to mock data for register", error);
            await delay(1000);

            const users = getUsers();
            if (users.find(u => u.email === email)) {
                throw new Error('Email already exists');
            }

            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password, // In a real app, this would be hashed!
                role,
                avatar: `https://i.pravatar.cc/150?u=${email}`,
                createdAt: new Date().toISOString()
            };

            saveUser(newUser);

            const token = `mock-jwt-token-${role}-${Date.now()}`;
            const { password: _, ...userWithoutPassword } = newUser;

            return {
                user: userWithoutPassword,
                token
            };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Get current user (for persistent session)
    getCurrentUser: () => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Store session
    setSession: (user, token) => {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, token);
    }
};
