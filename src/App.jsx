import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailsPage from './pages/courses/CourseDetailsPage';
import VideoPlayerPage from './pages/course/VideoPlayerPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AIDemoPage from './pages/AIDemoPage';

// Dashboards
import LearnerDashboardPage from './pages/learner/LearnerDashboardPage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Admin Pages (Other)
import AdminLayout from './components/layout/AdminLayout';
import ManageCoursesPage from './pages/admin/ManageCoursesPage';
import ComingSoon from './components/common/ComingSoon';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/ai-demo" element={<AIDemoPage />} />
          </Route>

          {/* Learning Route (Fullscreen) */}
          <Route path="/courses/:courseId/learn" element={
            <ProtectedRoute allowedRoles={['learner', 'admin', 'instructor']}>
              <VideoPlayerPage />
            </ProtectedRoute>
          } />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Learner Routes */}
          <Route path="/learner" element={
            <ProtectedRoute allowedRoles={['learner']}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<LearnerDashboardPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Instructor Routes */}
          <Route path="/instructor" element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<InstructorDashboardPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="courses" element={<ManageCoursesPage />} />
            <Route path="videos" element={<ComingSoon title="Manage Videos" />} />
            <Route path="users" element={<ComingSoon title="Manage Users" />} />
            <Route path="settings" element={<ComingSoon title="Settings" />} />
          </Route>

          {/* Redirect /dashboard to appropriate role (fallback) */}
          <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/" replace /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
