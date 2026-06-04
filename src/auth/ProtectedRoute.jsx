import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { session, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Normalize session role (handle potential 'student' vs 'learner' mismatch)
    const currentRole = session.role === 'student' ? 'learner' : session.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
        // Determine redirect path based on role
        let redirectPath = '/learner/dashboard';
        if (currentRole === 'admin') redirectPath = '/admin/dashboard';
        else if (currentRole === 'instructor') redirectPath = '/instructor/dashboard';

        // Prevent infinite redirect loops
        if (location.pathname === redirectPath) {
            return children;
        }

        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
