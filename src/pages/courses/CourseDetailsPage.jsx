import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Clock, BookOpen, User, Users, DollarSign, CheckCircle, PlayCircle, BarChart, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { api } from '../../services/api';
import { useAuth } from '../../auth/useAuth';
import { cn } from '../../utils';
import { formatCurrency, formatDuration } from '../../utils/formatters';

const CourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t, i18n } = useTranslation();

    const [isPurchased, setIsPurchased] = useState(false);
    const [lectures, setLectures] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewHover, setReviewHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [reviews, setReviews] = useState([
        { name: "Mohammed Khaled", date: "3 days ago", rating: 5, comment: "This course is life-changing. Everything is explained so clearly!" },
        { name: "Youssef Tariq", date: "1 week ago", rating: 4, comment: "Great content, but would love more practical exercises in section 3." }
    ]);

    const [course, setCourse] = useState(null);
    const [instructorData, setInstructorData] = useState(null);

    const handleSubmitReview = () => {
        if (reviewRating === 0) { setReviewError('Please select a star rating first.'); return; }
        if (!reviewText.trim()) { setReviewError('Please write your feedback before submitting.'); return; }
        setReviewError('');
        setReviews(prev => [{ name: 'أنت', date: 'Just now', rating: reviewRating, comment: reviewText.trim() }, ...prev]);
        setReviewRating(0);
        setReviewText('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 4000);
    };

    // Fetch course data
    useEffect(() => {
        const fetchCourseData = async () => {
            setIsLoading(true);
            try {
                const courseData = await api.courses.getById(parseInt(id));
                if (courseData) {
                    setCourse(courseData);
                    // Fetch instructors to get bio/avatar
                    const instructors = await api.instructors.getAll();
                    const instructor = instructors.find(ins => ins.name === courseData.instructor);
                    setInstructorData(instructor);

                    // Fetch actual lectures
                    const lecturesData = await api.courses.getLectures(parseInt(id));
                    setLectures(lecturesData);

                    // Check purchase status from API
                    const purchase = await api.learner.getPurchase(id);
                    setIsPurchased(purchase?.status === 'completed' || false);
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchCourseData();
    }, [id]);

    const tabs = [
        { id: 'overview', label: t('courseDetails.tabs.overview') },
        { id: 'curriculum', label: t('courseDetails.tabs.curriculum') },
        { id: 'instructor', label: t('courseDetails.tabs.instructor') },
        { id: 'reviews', label: t('courseDetails.tabs.reviews') },
    ];

    if (isLoading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-12 transition-colors duration-300">
                <div className="bg-slate-900 dark:bg-black text-white pt-12 pb-24 border-b dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LoadingSkeleton className="h-4 w-32 mb-4 bg-slate-700 dark:bg-slate-800" />
                        <LoadingSkeleton className="h-10 w-3/4 mb-4 bg-slate-700 dark:bg-slate-800" />
                        <LoadingSkeleton className="h-6 w-full max-w-2xl mb-6 bg-slate-700 dark:bg-slate-800" />
                        <div className="flex gap-6">
                            <LoadingSkeleton className="h-4 w-24 bg-slate-700 dark:bg-slate-800" />
                            <LoadingSkeleton className="h-4 w-32 bg-slate-700 dark:bg-slate-800" />
                            <LoadingSkeleton className="h-4 w-28 bg-slate-700 dark:bg-slate-800" />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
                                <LoadingSkeleton className="h-8 w-48 mb-6" />
                                <LoadingSkeleton className="h-4 w-full mb-3" />
                                <LoadingSkeleton className="h-4 w-full mb-3" />
                                <LoadingSkeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800">
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

    if (!course && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X size={40} className="text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('courses.noCoursesFound')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">{t('courses.noCoursesHint')}</p>
                    <Link to="/courses">
                        <Button className="w-full">{t('dashboard.instructor.lectures.backToDashboard')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-12 overflow-x-hidden transition-colors duration-300">
            {/* Course Header */}
            <div className="bg-slate-900 dark:bg-black text-white pt-12 pb-8 sm:pb-24 border-b dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Breadcrumb
                            light={true}
                            items={[
                                { label: t('nav.courses'), href: '/courses' },
                                { label: course.category, href: `/courses?category=${encodeURIComponent(course.category)}` },
                                { label: course.title }
                            ]}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight wrap-break-word">{course.title}</h1>
                            <p className="text-slate-300 dark:text-slate-400 text-base sm:text-lg mb-6">
                                {t('courseDetails.description_short', { title: course.title })}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                                    <span className="font-bold text-white">{course.rating}</span>
                                    <span>{t('courseDetails.numReviews', { count: course.reviews })}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4 shrink-0 text-slate-400" />
                                    <Link to={`/instructor/user/${encodeURIComponent(course.instructor.replace(/\s+/g, '-').toLowerCase())}`} className="truncate max-w-[150px] sm:max-w-none hover:text-primary transition-colors cursor-pointer block">
                                        <span className="hidden sm:inline text-slate-400">{t('courseDetails.createdBy')} </span>
                                        <span className="text-white font-medium underline decoration-primary/50 underline-offset-4">{course.instructor}</span>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    <span>{t('courseDetails.lastUpdated')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:-mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 dark:border-slate-800 overflow-x-auto scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative cursor-pointer ${activeTab === tab.id
                                            ? 'text-primary'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
                            <div className="p-6 md:p-8 min-h-[400px] relative">
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
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('courseDetails.description')}</h3>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {course.description}
                                                </p>
                                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {t('courseDetails.description_full', { category: course.category, instructor: course.instructor })}
                                                </p>

                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('courseDetails.whatLearn')}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {(course.highlights || [1, 2, 3, 4, 5, 6]).map((item, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                                            <span className="text-slate-600 dark:text-slate-300 text-sm">
                                                                {typeof item === 'string' ? item : t('courseDetails.masterCore')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'curriculum' && (
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 mb-4">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('courseDetails.content')}</h3>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">{lectures.length} {t('courseDetails.lectures')} • {formatDuration(course.duration)} {t('courseDetails.totalLength')}</span>
                                                </div>
                                                
                                                {lectures.length > 0 ? (
                                                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                                        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 flex justify-between items-center cursor-default">
                                                            <span>{t('courseDetails.curriculum')}</span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">{lectures.length} {t('courseDetails.lectures')}</span>
                                                        </div>
                                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                            {lectures.map((lecture, idx) => (
                                                                <div key={lecture.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                                                    <div className="flex items-center gap-3">
                                                                        <PlayCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors" />
                                                                        <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                                                                            {idx + 1}. {lecture.title}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xs text-slate-400 dark:text-slate-500">{formatDuration(lecture.duration)}</span>
                                                                        {lecture.locked && !isPurchased && (
                                                                            <Lock className="w-3 h-3 text-slate-400" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                                        <PlayCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                                        <p className="text-slate-500 dark:text-slate-400">{t('courseDetails.noLectures', 'No lectures available yet for this course.')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'instructor' && (
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden shadow-lg border-2 border-white dark:border-slate-800">
                                                    <img src={instructorData?.avatar || `https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt={course.instructor} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <Link to={`/instructor/user/${encodeURIComponent(course.instructor.replace(/\s+/g, '-').toLowerCase())}`} className="block hover:opacity-80 transition-opacity">
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 hover:text-primary transition-colors">{course.instructor}</h3>
                                                    </Link>
                                                    <p className="text-primary font-medium text-sm mb-4">{instructorData?.role || t('courseDetails.seniorInstructor')}</p>
                                                    <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                                        <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-primary text-primary" /> {instructorData?.rating || '4.8'} {t('courseDetails.rating')}</div>
                                                        <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {instructorData?.studentsCount || '25k'} {t('courseDetails.students')}</div>
                                                        <div className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> {instructorData?.coursesCount || '12'} {t('courseDetails.courses')}</div>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                        {instructorData?.bio || t('courseDetails.instructorBio', { instructor: course.instructor })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'reviews' && (
                                            <div className="relative">
                                                {/* Locked Reviews Overlay */}
                                                {!isPurchased && course.price > 0 && (
                                                    <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="text-center px-6"
                                                        >
                                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                                <Lock className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                                                            </div>
                                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('courseDetails.locked.title')}</h3>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-[250px] mx-auto">{t('courseDetails.locked.reviews_subtitle', 'Purchase this course to see what other students are saying and leave your own feedback.')}</p>
                                                            <Button onClick={() => navigate(`/checkout/${id}`)} size="sm" className="shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] bg-primary hover:bg-primary-dark">
                                                                <Lock className="w-3 h-3" />
                                                                {t('courseDetails.locked.unlock')}
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                )}
                                                
                                                <div className={cn("space-y-8", !isPurchased && course.price > 0 && "opacity-20 pointer-events-none blur-[2px]")}>
                                                    {/* Summary Stats */}
                                                    <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                        <div className="text-center md:border-r md:border-slate-200 dark:md:border-slate-700 md:pr-12">
                                                            <div className="text-6xl font-bold text-slate-900 dark:text-white mb-2">{course.rating}</div>
                                                            <div className="flex justify-center gap-1 mb-2">
                                                                {[1, 2, 3, 4, 5].map(i => (
                                                                    <Star key={i} className={`w-5 h-5 ${i <= Math.round(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                                                ))}
                                                            </div>
                                                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('courseDetails.courseRating')}</div>
                                                        </div>
                                                        <div className="flex-1 w-full space-y-3">
                                                            {[5, 4, 3, 2, 1].map((rating) => (
                                                                <div key={rating} className="flex items-center gap-4 text-sm">
                                                                    <span className="w-12 font-medium text-slate-600 dark:text-slate-400">{rating} Stars</span>
                                                                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${rating === 5 ? 75 : rating === 4 ? 15 : 5}%` }} />
                                                                    </div>
                                                                    <span className="w-10 text-right text-slate-400">{rating === 5 ? '75%' : rating === 4 ? '15%' : '5%'}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* NEW: Leave a Review Form */}
                                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-primary/10 shadow-sm">
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('courseDetails.leaveReview')}</h3>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('courseDetails.ratePrompt')}</label>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map(i => (
                                                                        <button
                                                                            key={i}
                                                                            type="button"
                                                                            onClick={() => setReviewRating(i)}
                                                                            onMouseEnter={() => setReviewHover(i)}
                                                                            onMouseLeave={() => setReviewHover(0)}
                                                                            className="p-1 transition-transform hover:scale-110 active:scale-95"
                                                                        >
                                                                            <Star
                                                                                className={`w-8 h-8 transition-colors duration-150 ${i <= (reviewHover || reviewRating)
                                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                                    : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                                                                                    }`}
                                                                            />
                                                                        </button>
                                                                    ))}
                                                                    {reviewRating > 0 && (
                                                                        <span className="ml-2 self-center text-sm font-semibold text-yellow-500">
                                                                            {reviewRating === 1 ? t('courseDetails.ratings.poor') :
                                                                             reviewRating === 2 ? t('courseDetails.ratings.fair') :
                                                                             reviewRating === 3 ? t('courseDetails.ratings.good') :
                                                                             reviewRating === 4 ? t('courseDetails.ratings.veryGood') :
                                                                             t('courseDetails.ratings.excellent')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('courseDetails.feedbackPrompt')}</label>
                                                                <textarea
                                                                    value={reviewText}
                                                                    onChange={(e) => { setReviewText(e.target.value); setReviewError(''); }}
                                                                    placeholder={t('courseDetails.feedbackPlaceholder')}
                                                                    rows="4"
                                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                                                />
                                                            </div>
                                                            {reviewError && (
                                                                <p className="text-sm text-red-500 font-medium">{reviewError}</p>
                                                            )}
                                                            {reviewSuccess && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -8 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="text-sm text-green-600 font-semibold flex items-center gap-2"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" /> Thank you! Your review has been submitted.
                                                                </motion.p>
                                                            )}
                                                            <div className="flex justify-end">
                                                                <Button onClick={handleSubmitReview}>{t('courseDetails.submitReview')}</Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Reviews List */}
                                                    <div className="space-y-6 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('courseDetails.recentReviews')}</h3>
                                                        <AnimatePresence>
                                                            {reviews.map((r, i) => (
                                                                <motion.div
                                                                    key={r.name + i}
                                                                    initial={{ opacity: 0, y: -12 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="flex gap-4 pb-6 border-b border-slate-50 dark:border-slate-800/50 last:border-0 transition-colors"
                                                                >
                                                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden">
                                                                        <img src={`https://ui-avatars.com/api/?name=${r.name}&background=random`} alt={r.name} />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div>
                                                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{r.name}</h4>
                                                                                <div className="flex gap-0.5 mt-1">
                                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                                        <Star key={star} className={`w-3 h-3 ${star <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`} />
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <span className="text-[10px] text-slate-400 font-medium">{r.date}</span>
                                                                        </div>
                                                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{r.comment}</p>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </AnimatePresence>
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
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 space-y-6 sticky top-24 transition-colors">
                            <div className="rounded-lg overflow-hidden aspect-video relative group cursor-pointer">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {course.price === 0 ? t('home.cta.free') : formatCurrency(course.discount ? (course.price * (1 - course.discount / 100)) : course.price, i18n.language)}
                                    </span>
                                    {course.price > 0 && course.discount > 0 && (
                                        <>
                                            <span className="text-lg text-slate-400 dark:text-slate-500 line-through mb-1">
                                                {formatCurrency(course.price, i18n.language)}
                                            </span>
                                            <span className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1 ml-auto">{course.discount}% OFF</span>
                                        </>
                                    )}
                                </div>

                                {user?.role === 'instructor' && user?.name === course.instructor ? (
                                    <Link to={`/instructor/dashboard`}>
                                        <Button className="w-full mb-3 shadow-[0_4px_14px_0_rgb(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:-translate-y-0.5 transition-all" size="lg">
                                            {t('courseDetails.manageCourse')}
                                        </Button>
                                    </Link>
                                ) : isPurchased ? (
                                    <Link to={`/courses/${id}/learn`}>
                                        <Button className="w-full mb-3 shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all bg-green-500 hover:bg-green-600" size="lg">
                                            <PlayCircle className="w-4 h-4" />
                                            {t('courseDetails.continueLearning')}
                                        </Button>
                                    </Link>
                                ) : course.price === 0 ? (
                                    <Button 
                                        className="w-full mb-3 shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all bg-green-500 hover:bg-green-600" 
                                        size="lg"
                                        onClick={() => {
                                            const purchased = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
                                            if (!purchased.includes(course.id)) {
                                                purchased.push(course.id);
                                                localStorage.setItem('purchasedCourses', JSON.stringify(purchased));
                                            }
                                            navigate(`/courses/${id}/learn`);
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {t('courseDetails.enrollFree')}
                                    </Button>
                                ) : (
                                    <Link to={`/checkout/${id}`}>
                                        <Button className="w-full mb-3 shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all" size="lg">
                                            <Lock className="w-4 h-4" />
                                            {t('courseDetails.buyCourse')}
                                        </Button>
                                    </Link>
                                )}

                                <p className="text-xs text-center text-slate-500 dark:text-slate-400">{t('courseDetails.moneyBack')}</p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-slate-900 dark:text-white">{t('courseDetails.includes')}:</h4>
                                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <li className="flex items-center gap-3"><PlayCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {formatDuration(course.duration)} {t('courseDetails.onDemandVideo')}</li>
                                    <li className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {course.lessons} {t('courseDetails.articlesResources')}</li>
                                    <li className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t('courseDetails.lifetimeAccess')}</li>
                                    <li className="flex items-center gap-3"><BarChart className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t('courseDetails.certificate')}</li>
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
