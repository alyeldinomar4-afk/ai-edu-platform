import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center gap-2 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <span className="font-bold text-2xl text-slate-900">
                        AI<span className="text-primary">Edu</span>
                    </span>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
