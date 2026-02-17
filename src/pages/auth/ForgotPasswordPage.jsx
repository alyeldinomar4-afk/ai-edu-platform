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
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                <p className="text-slate-500 mb-6">
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
                    <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back to sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Forgot password?</h2>
                <p className="text-slate-500 mt-2">No worries, we'll send you reset instructions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email address
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full justify-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Back to sign in
                </Link>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
