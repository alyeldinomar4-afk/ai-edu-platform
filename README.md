# AI Education Platform

> A modern, full-featured **AI-powered Learning Management System** built with React. This is the **frontend** layer of the graduation project — designed to be connected to any backend.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Role-Based Access** | 3 user roles: Student, Instructor, Admin — each with a dedicated dashboard |
| **AI Chat Assistant** | Interactive demo chat with simulated AI tutor responses (`/ai-demo`) |
| **Course Catalog** | Browse, search, and filter courses by category |
| **Video Player** | Full-screen learning experience with curriculum sidebar |
| **Admin Panel** | Manage courses, view platform stats, and user data |
| **Responsive Design** | Works on mobile, tablet, and desktop |
| **Animations** | Smooth page transitions using Framer Motion |

---

## 🚀 Tech Stack

- **React 19** — UI framework
- **Vite** — Build tool & dev server
- **Tailwind CSS v4** — Styling
- **React Router DOM v7** — Client-side routing
- **Framer Motion** — Animations
- **Lucide React** — Icon library

---

## 🔑 Test Accounts

| Role | Email | Password | Dashboard |
| :--- | :--- | :--- | :--- |
| **Student** | `user@test.com` | `123456` | `/learner/dashboard` |
| **Instructor** | `instructor@test.com` | `123456` | `/instructor/dashboard` |
| **Admin** | `admin@test.com` | `admin123` | `/admin/dashboard` |

---

## 🛠️ How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production (creates /dist folder)
npm run build

# 4. Open on mobile/other devices
npm run host
```

---

## 📂 Project Structure

```
src/
├── auth/           # Auth context & protected route logic
├── components/     # Reusable UI components (Button, Navbar, etc.)
│   ├── common/     # Shared components (ComingSoon, etc.)
│   ├── features/   # Feature-specific components (Course cards, Quiz, AI)
│   ├── layout/     # Layout wrappers (MainLayout, AdminLayout, AuthLayout)
│   └── ui/         # Base UI elements (Button, Breadcrumb, Skeleton)
├── context/        # Global state (Auth)
├── data/           # Mock data (courses, categories, testimonials)
├── pages/          # All page views
│   ├── admin/      # Admin dashboard & management
│   ├── auth/       # Login, Register, Forgot Password
│   ├── course/     # Video player page
│   ├── courses/    # Course catalog & details
│   ├── dashboard/  # Legacy dashboard (redirects)
│   ├── instructor/ # Instructor dashboard
│   └── learner/    # Learner dashboard
├── services/       # API service layer (mock → real backend)
└── utils/          # Helper functions
```

---

## 🔗 Backend Integration Guide

The frontend is **100% ready** for backend connection. See [`BACKEND_HANDOFF.md`](./BACKEND_HANDOFF.md) for full details.

**Quick summary:**
1. All API calls go through `src/services/api.js` — replace mock functions with real `fetch`/`axios` calls
2. Auth flow is in `src/auth/AuthContext.jsx` — replace `localStorage` logic with JWT token management
3. AI chat logic is in `src/pages/AIDemoPage.jsx` — replace `getDemoResponse()` with a `POST /api/ai/chat` call

---

## 📦 Deployment (Netlify)

1. Run `npm run build` to generate the `dist/` folder
2. Upload the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Make sure `public/_redirects` exists with: `/* /index.html 200`

---

## 📄 License

This project is part of a graduation project and is for educational purposes.
