import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useTranslation } from 'react-i18next';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailsPage from './pages/courses/CourseDetailsPage';
import VideoPlayerPage from './pages/course/VideoPlayerPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AIDemoPage from './pages/AIDemoPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import PaymentSuccessPage from './pages/checkout/PaymentSuccessPage';

// Dashboards
import LearnerDashboardPage from './pages/learner/LearnerDashboardPage';
import LearnerProfilePage from './pages/learner/LearnerProfilePage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import InstructorProfilePage from './pages/instructor/InstructorProfilePage';
import InstructorQAPage from './pages/instructor/InstructorQAPage';
import InstructorReviewsPage from './pages/instructor/InstructorReviewsPage';
import InstructorAnnouncementsPage from './pages/instructor/InstructorAnnouncementsPage';
import PublicInstructorProfilePage from './pages/instructor/PublicInstructorProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Admin Pages (Other)
import AdminLayout from './components/layout/AdminLayout';
import ManageCoursesPage from './pages/admin/ManageCoursesPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import AdminManageVideosPage from './pages/admin/ManageVideosPage';
import InstructorLecturesPage from './pages/instructor/InstructorLecturesPage';
import ComingSoon from './components/common/ComingSoon';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
    document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
              <Route path="/instructor/user/:name" element={<PublicInstructorProfilePage />} />
              <Route path="/ai-demo" element={<AIDemoPage />} />
              <Route path="/checkout/:courseId" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
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
              <Route path="profile" element={<LearnerProfilePage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Instructor Routes */}
            <Route path="/instructor" element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<InstructorDashboardPage />} />
              <Route path="profile" element={<InstructorProfilePage />} />
              <Route path="qa" element={<InstructorQAPage />} />
              <Route path="reviews" element={<InstructorReviewsPage />} />
              <Route path="announcements" element={<InstructorAnnouncementsPage />} />
              <Route path="videos" element={<InstructorLecturesPage />} />
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
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="courses" element={<ManageCoursesPage />} />
              <Route path="videos" element={<AdminManageVideosPage />} />
              <Route path="users" element={<ManageUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Redirect /dashboard to appropriate role (fallback) */}
            <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/" replace /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
