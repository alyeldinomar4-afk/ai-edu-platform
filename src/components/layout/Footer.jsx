import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            {/* Light mode logo */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-100 w-10 h-10 flex items-center justify-center overflow-hidden dark:hidden">
                                <img src={logoLight} alt="AI Edu Logo" className="w-full h-full object-contain" />
                            </div>
                            {/* Dark mode logo */}
                            <div className="hidden bg-black rounded-lg shadow-sm w-10 h-10 items-center justify-center overflow-hidden border border-slate-800 dark:flex">
                                <img src={logoDark} alt="AI Edu Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 dark:text-white">
                                AI<span className="text-primary">Edu</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Empowering the next generation of learners with AI-driven personalized education.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/courses" className="hover:text-primary transition-colors">Browse Courses</Link></li>
                            <li><Link to="/mentors" className="hover:text-primary transition-colors">Find a Mentor</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link to="/for-business" className="hover:text-primary transition-colors">For Business</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 dark:text-slate-500 text-sm">
                        © {new Date().getFullYear()} AI Edu Platform. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-slate-400 dark:text-slate-500">
                        <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Github size={20} /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
