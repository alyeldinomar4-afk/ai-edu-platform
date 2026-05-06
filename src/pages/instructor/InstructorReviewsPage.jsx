import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/useAuth';
import { Star, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InstructorNav from '../../components/layout/InstructorNav';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data is now managed in src/data/mockData.js and served via api.js

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}
            />
        );
    }
    return <div className="flex gap-1">{stars}</div>;
};

const InstructorReviewsPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyTexts, setReplyTexts] = useState({});

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                const data = await api.instructor.reviews.getAll();
                // Map API data to UI format
                const formatted = data.map(r => ({
                    ...r,
                    studentName: r.user, // API usually returns 'user'
                    avatar: r.avatar || `https://ui-avatars.com/api/?name=${r.user}&background=random`,
                    course: r.course || 'Nexora Course',
                    review: r.comment || r.review, // handle both keys if any
                    date: r.date || t('common.justNow'),
                    reply: r.reply || ''
                }));
                setReviews(formatted);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setFetchError(true);
                toast.error(t('common.error'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const toggleReply = (review) => {
        if (activeReplyId === review.id) {
            setActiveReplyId(null);
        } else {
            setActiveReplyId(review.id);
            setReplyTexts(prev => ({ ...prev, [review.id]: review.reply || '' }));
        }
    };
    const handleSaveReply = async (id) => {
        try {
            const text = replyTexts[id] || '';
            if (!text.trim()) return;
            await api.instructor.reviews.reply(id, text);
            setReviews(prev => prev.map(r =>
                r.id === id ? { ...r, reply: text } : r
            ));
            setActiveReplyId(null);
            toast.success(t('common.success'));
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.instructor.reviews.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('dashboard.instructor.reviews.subtitle')}</p>
            </div>

            <InstructorNav />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center py-10">
                        <h3 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">{avgRating}</h3>
                        <div className="mb-2">
                            {renderStars(Math.round(avgRating))}
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('dashboard.instructor.reviews.avgRating')}</p>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-3 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                        </div>
                    ) : reviews.map((r) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors ${isRTL ? 'text-right' : ''}`}
                        >
                            <div className={`flex flex-col sm:flex-row gap-4 items-start border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                                <img src={r.avatar} alt={r.studentName} className="w-12 h-12 rounded-full hidden sm:block" />
                                <div className="flex-1 w-full">
                                    <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <img src={r.avatar} alt={r.studentName} className="w-10 h-10 rounded-full sm:hidden" />
                                            <div className={isRTL ? 'text-right' : ''}>
                                                <h3 className="font-bold text-slate-900 dark:text-white">{r.studentName}</h3>
                                                <p className="text-xs text-slate-400 dark:text-slate-500">{r.date}</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block">
                                            {renderStars(r.rating)}
                                        </div>
                                    </div>
                                    <div className={`sm:hidden mb-3 ${isRTL ? 'flex justify-end' : ''}`}>
                                        {renderStars(r.rating)}
                                    </div>
                                    <p className={`text-sm text-primary dark:text-primary-400 font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>{r.course}</p>
                                    <p className="text-slate-700 dark:text-slate-300">{r.review}</p>
                                </div>
                            </div>

                            {/* Existing Reply Display */}
                            {r.reply && activeReplyId !== r.id && (
                                <div className={`bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl ${isRTL ? 'mr-0 sm:mr-16 ml-0 sm:ml-4' : 'ml-0 sm:ml-16 mr-0 sm:mr-4'} mb-4 border border-slate-100 dark:border-slate-700 ${isRTL ? 'text-right' : ''}`}>
                                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{t('dashboard.instructor.reviews.yourReply')}</span>
                                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-medium">{t('dashboard.instructor.reviews.instructor')}</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{r.reply}</p>
                                </div>
                            )}

                            {/* Actions */}
                             <div className={`flex justify-end ${isRTL ? 'mr-0 sm:mr-16 flex-row-reverse' : 'ml-0 sm:ml-16'}`}>
                                <Button variant="ghost" size="sm" onClick={() => toggleReply(r)}>
                                    <MessageSquare size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                                    {r.reply ? t('dashboard.instructor.reviews.editReply') : t('dashboard.instructor.reviews.respond')}
                                </Button>
                            </div>

                            {/* Reply Input Area */}
                            <AnimatePresence>
                                {activeReplyId === r.id && (
                                     <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={`mt-4 ${isRTL ? 'mr-0 sm:mr-16' : 'ml-0 sm:ml-16'} overflow-hidden`}
                                    >
                                        <div className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <img src={user?.avatar || "https://ui-avatars.com/api/?name=Instructor&background=random"} alt="You" className="w-8 h-8 rounded-full hidden sm:block mt-1" />
                                            <div className="flex-1 text-left">
                                                <textarea
                                                    value={replyTexts[r.id] || ''}
                                                    onChange={(e) => setReplyTexts(prev => ({ ...prev, [r.id]: e.target.value }))}
                                                    placeholder={t('dashboard.instructor.reviews.placeholder')}
                                                    rows="3"
                                                    className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-y mb-3 text-sm ${isRTL ? 'text-right' : ''}`}
                                                />
                                                <div className={`flex justify-end gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                    <Button variant="ghost" size="sm" onClick={() => setActiveReplyId(null)}>{t('dashboard.instructor.reviews.cancel')}</Button>
                                                    <Button size="sm" onClick={() => handleSaveReply(r.id)}>
                                                        {r.reply ? t('dashboard.instructor.reviews.updateReply') : t('dashboard.instructor.reviews.sendReply')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Star className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t('dashboard.instructor.reviews.emptyTitle')}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{t('dashboard.instructor.reviews.emptySubtitle')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorReviewsPage;
