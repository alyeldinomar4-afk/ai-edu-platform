import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect based on role if they try to access unauthorized area
        // e.g., Learner tries to access Admin
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
        return <Navigate to="/learner/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
