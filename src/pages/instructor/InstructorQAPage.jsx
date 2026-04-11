import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/useAuth';
import { MessageSquare, CheckCircle, Clock, ChevronDown, ChevronUp, Reply, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InstructorNav from '../../components/layout/InstructorNav';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

// Mock data is now managed in src/data/mockData.js and served via api.js

const InstructorQAPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            try {
                const data = await api.instructor.questions.getAll();
                // Map API data to UI format if needed
                const formatted = data.map(q => ({
                    ...q,
                    studentName: q.user, // API uses 'user'
                    avatar: q.avatar || `https://ui-avatars.com/api/?name=${q.user}&background=random`,
                    course: q.course || 'Global Q&A',
                    question: q.question,
                    date: q.date || 'Just now',
                    status: q.reply ? 'resolved' : 'pending'
                }));
                setQuestions(formatted);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const toggleExpand = (question) => {
        if (expandedId === question.id) {
            setExpandedId(null);
        } else {
            setExpandedId(question.id);
            setReplyText(question.reply || '');
        }
    };

    const handleReply = async (id) => {
        if (!replyText.trim()) return;
        try {
            await api.instructor.questions.reply(id, replyText);
            setQuestions(prev => prev.map(q =>
                q.id === id ? { ...q, status: 'resolved', reply: replyText } : q
            ));
            setExpandedId(null);
            toast.success(t('common.success'));
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    const pendingCount = questions.filter(q => q.status === 'pending').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.instructor.qa.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('dashboard.instructor.qa.subtitle')}</p>
            </div>

            <InstructorNav />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-3 mb-2 text-yellow-600 dark:text-yellow-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Clock className="w-5 h-5" />
                            <h3 className="font-semibold">{t('dashboard.instructor.qa.needsReply')}</h3>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
                    </div>
                    <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-3 mb-2 text-green-600 dark:text-green-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <CheckCircle className="w-5 h-5" />
                            <h3 className="font-semibold">{t('dashboard.instructor.qa.resolved')}</h3>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{questions.length - pendingCount}</p>
                    </div>
                </div>

                {/* Questions List */}
                <div className="md:col-span-3 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                        </div>
                    ) : questions.map((q) => (
                        <motion.div
                            key={q.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border overflow-hidden transition-colors ${q.status === 'pending' ? 'border-primary/30 dark:border-primary/20' : 'border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            {/* Header (Clickable) */}
                            <div
                                onClick={() => toggleExpand(q)}
                                className={`p-5 sm:p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                            >
                                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <img src={q.avatar} alt={q.studentName} className="w-10 h-10 rounded-full mt-1" />
                                    <div>
                                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{q.studentName}</h3>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">• {q.date}</span>
                                        </div>
                                        <p className="text-sm text-primary dark:text-primary-400 font-medium mb-1">{q.course}</p>
                                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{q.question}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-3 self-end sm:self-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${q.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                        {q.status === 'pending' ? t('dashboard.instructor.qa.pending') : t('dashboard.instructor.qa.resolved')}
                                    </span>
                                    {expandedId === q.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {expandedId === q.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                                    >
                                        <div className="p-5 sm:p-6">
                                            {/* Full Question */}
                                            <div className="mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <p className="text-slate-700 dark:text-slate-200">{q.question}</p>
                                            </div>

                                            {/* Reply Box */}
                                            <div className="flex gap-4 items-start">
                                                <img src={user?.avatar || "https://ui-avatars.com/api/?name=Instructor&background=random"} alt="You" className="w-10 h-10 rounded-full hidden sm:block" />
                                                <div className="flex-1">
                                                    <textarea
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder={t('dashboard.instructor.qa.placeholder')}
                                                        rows="4"
                                                        className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-y mb-3 ${isRTL ? 'text-right' : ''}`}
                                                    />
                                                    <div className={`flex justify-end gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                        <Button variant="ghost" onClick={() => setExpandedId(null)}>{t('dashboard.instructor.qa.cancel')}</Button>
                                                        <Button onClick={() => handleReply(q.id)}>
                                                            <Reply size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                                                            {q.status === 'resolved' ? t('dashboard.instructor.qa.update') : t('dashboard.instructor.qa.post')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                    {!isLoading && questions.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t('dashboard.instructor.qa.emptyTitle')}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{t('dashboard.instructor.qa.emptySubtitle')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorQAPage;
