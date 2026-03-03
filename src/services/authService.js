/**
 * Authentication Service (Mock)
 * 
 * TO INTEGRATE WITH BACKEND:
 * 1. Replace mock logic with fetch/axios calls to your auth API
 * 2. login()    → POST /api/auth/login  { email, password } → { token, user }
 * 3. register() → POST /api/auth/register { name, email, password, role } → { token, user }
 * 4. logout()   → POST /api/auth/logout (invalidate token server-side)
 * 5. getCurrentUser() → GET /api/auth/me (validate token, return user)
 * 6. setSession() → Store JWT + refresh token securely
 */

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
        await delay(800); // Simulate network delay

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            // For checking purposes, allow a default admin if not exists
            if ((email === 'admin@edu.com' || email === 'admin@test.com') && password === 'admin123') {
                const adminUser = {
                    id: 'admin-1',
                    name: 'System Admin',
                    email: 'admin@edu.com',
                    role: 'admin',
                    avatar: 'https://i.pravatar.cc/150?u=admin'
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
                    avatar: 'https://i.pravatar.cc/150?u=student'
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
                    avatar: 'https://i.pravatar.cc/150?u=instructor'
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
    },

    // Register
    register: async (name, email, password, role = 'learner') => {
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
