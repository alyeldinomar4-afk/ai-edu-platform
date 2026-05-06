import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Megaphone, Send, Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InstructorNav from '../../components/layout/InstructorNav';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';

// Mock data is now managed in src/data/mockData.js and served via api.js

const InstructorAnnouncementsPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [announcements, setAnnouncements] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState('all');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [annData, courseData] = await Promise.all([
                    api.instructor.announcements.getAll('all'),
                    api.instructor.courses.getAll()
                ]);
                setAnnouncements(annData);
                setCoursesList(courseData.map(c => ({ id: c.id, title: c.title })));
            } catch (error) {
                console.error('Error fetching announcements:', error);
                setFetchError(true);
                toast.error(t('common.error'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setIsSending(true);
        try {
            const courseName = selectedCourse === 'all' ? t('dashboard.instructor.announcements.allCourses') : (coursesList.find(c => String(c.id) === String(selectedCourse))?.title || 'Selected Course');
            
            const newAnnouncement = await api.instructor.announcements.create({
                courseId: selectedCourse,
                course: courseName,
                subject,
                message,
                date: t('common.justNow'),
                sentTo: selectedCourse === 'all' ? 5200 : 1450 // Mock numbers for UI
            });

            setAnnouncements([newAnnouncement, ...announcements]);
            setSubject('');
            setMessage('');
            setSelectedCourse('all');
            setShowForm(false);
            toast.success(t('dashboard.instructor.announcements.success'));
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 ${isRTL ? 'text-right' : ''}`}>
                <div className={isRTL ? 'text-right' : ''}>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.instructor.announcements.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('dashboard.instructor.announcements.subtitle')}</p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Megaphone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('dashboard.instructor.announcements.new')}
                    </Button>
                )}
            </div>

            <InstructorNav />

            {/* Compose Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.98 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.98 }}
                        className="mb-8"
                    >
                        <div className={`bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 ${isRTL ? 'text-right' : ''}`}>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('dashboard.instructor.announcements.composeTitle')}</h2>
                            <form onSubmit={handleSend} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.instructor.announcements.selectCourse')}</label>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                                    >
                                        <option value="all">{t('dashboard.instructor.announcements.allCourses')}</option>
                                        {coursesList.filter(c => c.id !== 'all').map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.instructor.announcements.subject')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder={t('dashboard.instructor.announcements.subjectPlaceholder')}
                                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${isRTL ? 'text-right' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('dashboard.instructor.announcements.message')}</label>
                                    <textarea
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={t('dashboard.instructor.announcements.messagePlaceholder')}
                                        rows="6"
                                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y ${isRTL ? 'text-right' : ''}`}
                                    />
                                </div>
                                <div className={`flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)} disabled={isSending}>
                                        {t('dashboard.instructor.announcements.cancel')}
                                    </Button>
                                    <Button type="submit" disabled={isSending || !subject || !message}>
                                        {isSending ? t('dashboard.instructor.announcements.sending') : <><Send size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> {t('dashboard.instructor.announcements.send')}</>}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History */}
            <h2 className={`text-lg font-bold text-slate-900 dark:text-white mb-4 ${isRTL ? 'text-right' : ''}`}>{t('dashboard.instructor.announcements.history')}</h2>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                    </div>
                ) : announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <motion.div
                            key={ann.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors ${isRTL ? 'text-right' : ''}`}
                        >
                            <div className={`flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className={isRTL ? 'text-right' : ''}>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{ann.subject}</h3>
                                    <p className="text-sm font-medium text-primary dark:text-primary-400">{ann.course}</p>
                                </div>
                                <div className={`flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Clock size={14} /> {ann.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Users size={14} /> {t('dashboard.instructor.announcements.sentTo', { count: Number(ann.sentTo || 0).toLocaleString() })}</span>
                                </div>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                <p>{ann.message || ann.content}</p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">{t('dashboard.instructor.announcements.emptyTitle')}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{t('dashboard.instructor.announcements.emptySubtitle')}</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default InstructorAnnouncementsPage;
