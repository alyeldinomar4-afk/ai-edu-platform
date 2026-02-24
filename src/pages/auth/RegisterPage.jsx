import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, AlertCircle, Briefcase } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../auth/useAuth';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'learner'
    });

    const { register } = useAuth();
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
            const user = await register(formData.name, formData.email, formData.password, formData.role);
            // Redirect based on role
            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'instructor') navigate('/instructor/dashboard');
            else navigate('/learner/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to register');
            setLoading(false);
        }
    };

    return (
        <div className="transition-colors duration-300">
            <div className="mb-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slide-up">
                    Create an account
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base animate-slide-up [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
                    Start your AI learning journey today
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        I am a...
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                            <option value="learner">Student</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">* Choose "Student" to learn or "Instructor" to teach.</p>
                </div>

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
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full justify-center h-12"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark cursor-pointer">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;
