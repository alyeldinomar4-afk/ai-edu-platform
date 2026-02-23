import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock api
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="text-center transition-colors duration-300">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 transition-colors">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    We sent a password reset link to your email address.
                </p>
                <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => setSubmitted(false)}
                >
                    Back to reset
                </Button>
                <div className="mt-6">
                    <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center justify-center gap-2 cursor-pointer">
                        <ArrowLeft size={16} /> Back to sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="transition-colors duration-300">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot password?</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">No worries, we'll send you reset instructions.</p>
            </div>

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
                            className="appearance-none block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full justify-center h-12"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center justify-center gap-2 cursor-pointer">
                    <ArrowLeft size={16} /> Back to sign in
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
