import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, BookOpen, User, DollarSign, CheckCircle, PlayCircle, BarChart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { courses } from '../../data/mockData';

const CourseDetailsPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    // Find course by ID (mock) - fallback to first course if not found
    const course = courses.find(c => c.id === parseInt(id)) || courses[0];

    // Simulate loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [id]);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'instructor', label: 'Instructor' },
        { id: 'reviews', label: 'Reviews' },
    ];

    if (isLoading) {
        return (
            <div className="bg-slate-50 min-h-screen pb-12">
                <div className="bg-slate-900 text-white pt-12 pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LoadingSkeleton className="h-4 w-32 mb-4 bg-slate-700" />
                        <LoadingSkeleton className="h-10 w-3/4 mb-4 bg-slate-700" />
                        <LoadingSkeleton className="h-6 w-full max-w-2xl mb-6 bg-slate-700" />
                        <div className="flex gap-6">
                            <LoadingSkeleton className="h-4 w-24 bg-slate-700" />
                            <LoadingSkeleton className="h-4 w-32 bg-slate-700" />
                            <LoadingSkeleton className="h-4 w-28 bg-slate-700" />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                                <LoadingSkeleton className="h-8 w-48 mb-6" />
                                <LoadingSkeleton className="h-4 w-full mb-3" />
                                <LoadingSkeleton className="h-4 w-full mb-3" />
                                <LoadingSkeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                                <LoadingSkeleton className="h-48 w-full rounded-lg mb-4" />
                                <LoadingSkeleton className="h-8 w-24 mb-4" />
                                <LoadingSkeleton className="h-12 w-full mb-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-12 overflow-x-hidden">
            {/* Course Header */}
            <div className="bg-slate-900 text-white pt-12 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Breadcrumb
                            items={[
                                { label: 'Courses', href: '/courses' },
                                { label: course.category, href: `/courses?category=${encodeURIComponent(course.category)}` },
                                { label: course.title }
                            ]}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">{course.title}</h1>
                            <p className="text-slate-300 text-base sm:text-lg mb-6 line-clamp-2">
                                Master {course.title} with this comprehensive course. Learn from industry experts and build real-world projects.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                                    <span className="font-bold text-white">{course.rating}</span>
                                    <span className="hidden sm:inline">({course.reviews} reviews)</span>
                                    <span className="sm:hidden">({course.reviews})</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate max-w-[150px] sm:max-w-none">
                                        <span className="hidden sm:inline">Created by </span>
                                        <span className="text-white hover:underline cursor-pointer font-medium">{course.instructor}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <span className="hidden sm:inline">Last updated: June 2025</span>
                                    <span className="sm:hidden">Updated Jun 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab.id
                                            ? 'text-primary'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 md:p-8 min-h-[400px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeTab === 'overview' && (
                                            <div className="space-y-6">
                                                <h3 className="text-xl font-bold text-slate-900">Course Description</h3>
                                                <p className="text-slate-600 leading-relaxed">
                                                    This course is designed to take you from beginner to advanced in {course.title}.
                                                    We cover everything from the fundamentals to complex topics, ensuring you have a solid understanding of the subject matter.
                                                </p>

                                                <h3 className="text-xl font-bold text-slate-900">What you'll learn</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                                        <div key={item} className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-slate-600 text-sm">Master core concepts and advanced techniques</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'curriculum' && (
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 mb-4">
                                                    <h3 className="text-xl font-bold text-slate-900">Course Content</h3>
                                                    <span className="text-sm text-slate-500">{course.lessons} lectures • {course.duration} total length</span>
                                                </div>
                                                {[1, 2, 3, 4].map((section) => (
                                                    <div key={section} className="border border-slate-200 rounded-lg overflow-hidden">
                                                        <div className="bg-slate-50 px-4 py-3 font-semibold text-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors">
                                                            <span>Section {section}: Introduction to Module</span>
                                                            <span className="text-xs text-slate-500">3 lectures • 45m</span>
                                                        </div>
                                                        <div className="divide-y divide-slate-100">
                                                            {[1, 2, 3].map((lecture) => (
                                                                <div key={lecture} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                                                    <div className="flex items-center gap-3">
                                                                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                                                                        <span className="text-sm text-slate-600 group-hover:text-slate-900">Lecture {lecture}: Getting Started</span>
                                                                    </div>
                                                                    <span className="text-xs text-slate-400">15:00</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === 'instructor' && (
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                <div className="w-24 h-24 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                                                    <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt={course.instructor} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{course.instructor}</h3>
                                                    <p className="text-primary font-medium text-sm mb-4">Senior Instructor & Developer</p>
                                                    <div className="flex gap-4 text-sm text-slate-500 mb-4">
                                                        <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-primary text-primary" /> 4.8 Rating</div>
                                                        <div className="flex items-center gap-1"><User className="w-4 h-4" /> 25k Students</div>
                                                        <div className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> 12 Courses</div>
                                                    </div>
                                                    <p className="text-slate-600 text-sm leading-relaxed">
                                                        {course.instructor} is a seasoned software engineer with over 10 years of experience in the industry.
                                                        They have taught thousands of students and are passionate about making complex topics easy to understand.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'reviews' && (
                                            <div className="space-y-6">
                                                <h3 className="text-xl font-bold text-slate-900">Student Reviews</h3>
                                                <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                                    <div className="text-center">
                                                        <div className="text-5xl font-bold text-slate-900">{course.rating}</div>
                                                        <div className="flex p-1 justify-center"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /></div>
                                                        <div className="text-xs text-slate-500">Course Rating</div>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        {[5, 4, 3, 2, 1].map((rating) => (
                                                            <div key={rating} className="flex items-center gap-2">
                                                                <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-yellow-400" style={{ width: `${rating * 20}%` }} />
                                                                </div>
                                                                <div className="flex"><Star className="w-3 h-3 text-slate-300" /></div>
                                                                <span className="text-xs text-slate-400">{rating * 15}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 space-y-6 sticky top-24">
                            <div className="rounded-lg overflow-hidden aspect-video relative group cursor-pointer">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-3xl font-bold text-slate-900">${course.price}</span>
                                    <span className="text-lg text-slate-400 line-through mb-1">${(course.price * 1.5).toFixed(2)}</span>
                                    <span className="text-sm font-semibold text-green-600 mb-1 ml-auto">33% OFF</span>
                                </div>
                                <Link to={`/courses/${id}/learn`}>
                                    <Button className="w-full mb-3" size="lg">Enroll Now</Button>
                                </Link>
                                <p className="text-xs text-center text-slate-500">30-Day Money-Back Guarantee</p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-slate-900">This course includes:</h4>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-center gap-3"><PlayCircle className="w-4 h-4 text-slate-400" /> {course.duration} on-demand video</li>
                                    <li className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-slate-400" /> {course.lessons} articles & resources</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-slate-400" /> Full lifetime access</li>
                                    <li className="flex items-center gap-3"><BarChart className="w-4 h-4 text-slate-400" /> Certificate of completion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
