import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../auth/useAuth';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await login(formData.email, formData.password);
            // Redirect based on role
            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'instructor') navigate('/instructor/dashboard');
            else navigate('/learner/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div className="transition-colors duration-300">
            <div className="mb-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slide-up">
                    Welcome back
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base animate-slide-up [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
                    Sign in to continue your learning journey
                </p>
                <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-700 inline-block pointer-events-none">
                    <p>Student: user@test.com / 123456</p>
                    <p>Instructor: instructor@test.com / 123456</p>
                    <p>Admin: admin@test.com / admin123</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email address
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Password
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 rounded dark:bg-slate-900"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300 cursor-pointer">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link to="/forgot-password" hidden className="font-medium text-primary hover:text-primary-dark cursor-pointer">
                            Forgot password?
                        </Link>
                        {/* The link is not hidden in the source but I'll make sure it's accessible */}
                        <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark cursor-pointer">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full justify-center h-12"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Sign in'}
                </Button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-center font-normal dark:border-slate-700 dark:text-slate-300"
                        onClick={() => console.log('Google login clicked - ready for backend integration')}
                    >
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-center font-normal dark:border-slate-700 dark:text-slate-300"
                        onClick={() => console.log('GitHub login clicked - ready for backend integration')}
                    >
                        GitHub
                    </Button>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary-dark cursor-pointer">
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;
