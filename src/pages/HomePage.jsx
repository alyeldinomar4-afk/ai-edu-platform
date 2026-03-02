import { motion } from 'framer-motion';
import { ArrowRight, Zap, Sparkles, Play, Award, Users, Star, Code2, BarChart3, Palette, Megaphone, Briefcase, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import CourseCard from '../components/features/course/CourseCard';
import { courses, categories, testimonials } from '../data/mockData';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const iconMap = {
        Code2,
        BarChart3,
        Palette,
        Megaphone,
        Briefcase,
        DollarSign,
    };

    return (
        <div className="space-y-0 pb-24 overflow-x-hidden transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
                {/* Abstract Background Shapes */}
                <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-linear-to-br from-primary to-accent rounded-full blur-[100px] animate-float" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-linear-to-tr from-secondary to-primary-dark rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-primary font-semibold text-sm mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>The Future of Learning is Here</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                                Master AI with <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
                                    Intelligent Education
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                                Unlock your potential with <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Nexora AI</span> — personalized learning paths,
                                real-time feedback, and world-class instructors all in one platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/courses">
                                    <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all w-full sm:w-auto">
                                        Start Learning Now <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                                <Link to="/ai-demo">
                                    <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-900 dark:border-slate-700 dark:text-slate-200 w-full sm:w-auto">
                                        <Play className="w-5 h-5 mr-2 fill-current" /> Watch Demo
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex -space-x-3">
                                    {[
                                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                    ].map(((src, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <img src={src} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    )))}
                                </div>
                                <p>Trusted by <span className="text-slate-900 dark:text-white font-bold">10,000+</span> students</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-10 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Students learning"
                                    className="rounded-2xl w-full object-cover h-[400px] md:h-[500px] brightness-90 dark:brightness-75"
                                />

                                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-50 dark:border-slate-700 flex items-center gap-4 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Course Completed</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">Python Mastery</p>
                                    </div>
                                </div>

                                <div className="absolute top-10 -right-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-50 dark:border-slate-700 flex items-center gap-3 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}>
                                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">4.9/5 Rating</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 dark:bg-black text-white py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-8 text-center md:text-left">
                    {[
                        { label: 'Active Learners', value: '50k+' },
                        { label: 'Courses Available', value: '200+' },
                        { label: 'Instructors', value: '50+' },
                        { label: 'Satisfaction Rate', value: '99%' },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex-1 min-w-[150px]">
                            <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-white">{stat.value}</h3>
                            <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">Nexora AI Categories</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">Explore What You Love</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">Browse our curated categories and find the perfect course for your goals</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/20 transition-all text-center"
                        >
                            <div className="w-12 h-12 mx-auto bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                                {cat.icon && iconMap[cat.icon] ? (
                                    (() => {
                                        const IconComponent = iconMap[cat.icon];
                                        return <IconComponent className="w-6 h-6 group-hover:text-primary transition-colors text-slate-600 dark:text-slate-400" />;
                                    })()
                                ) : (
                                    <span className={`text-2xl group-hover:text-primary transition-colors`}>{cat.icon || '📚'}</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{cat.name}</h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{cat.count} Courses</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Courses */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-20 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Top Rated</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">Featured Courses</h2>
                        </div>
                        <Link to="/courses">
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 hover:text-primary dark:text-slate-300 cursor-pointer">
                                View All Courses <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courses.slice(0, 4).map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/courses">
                            <Button variant="outline" className="w-full h-12 dark:border-slate-700 dark:text-slate-300">View All Courses</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* AI Feature Highlight */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-linear-to-br from-slate-900 via-slate-800 to-black rounded-[2.5rem] p-8 sm:p-10 md:p-20 overflow-hidden relative text-white dark:from-black dark:via-slate-950 dark:to-slate-900 border dark:border-slate-800">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span>AI-Powered Assistant</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                Learning stuck? <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Ask the AI Tutor.</span>
                            </h2>
                            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                Get instant feedback, code explanations, and personalized study plans.
                                Our AI tutor understands your learning style and adapts to your pace.
                            </p>
                            <Link to="/ai-demo">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-transform border-none shadow-xl shadow-white/5">
                                    Try AI Demo <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <div className="relative">
                            {/* Abstract UI representation of chat */}
                            <div className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700 dark:border-slate-800 shadow-2xl relative z-20">
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div className="bg-slate-700/50 dark:bg-slate-800/50 p-4 rounded-2xl rounded-tl-none text-slate-300 text-sm flex-1">
                                            <p>How do I optimize this React component for performance?</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div className="bg-slate-700/50 dark:bg-slate-800/50 p-4 rounded-2xl rounded-tl-none text-slate-300 text-sm flex-1">
                                            <p className="mb-2">You can use `useMemo` and `useCallback` to prevent unnecessary re-renders.</p>
                                            <div className="bg-slate-900 rounded p-2 font-mono text-xs text-green-300">
                                                const memoizedValue = useMemo(() =&gt; computeExpensiveValue(a, b), [a, b]);
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative blurred circles behind */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-primary to-purple-600 blur-[80px] opacity-20 -z-10 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">Testimonials</span>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">Loved by Students</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-3">See what our community has to say about Nexora AI</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10" />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm">"{t.content}"</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative text-center py-16 px-8 rounded-3xl bg-linear-to-r from-primary via-secondary to-accent overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10">
                        <Sparkles className="w-8 h-8 text-white/80 mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Learning?</h2>
                        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of students already learning smarter with Nexora AI</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-xl h-14 px-8 text-lg">
                                    Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};


export default HomePage;
