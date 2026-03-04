import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Megaphone, Send, Users, Clock, Bold, Italic, Link as LinkIcon, List } from 'lucide-react';
import InstructorNav from '../../components/layout/InstructorNav';
import Button from '../../components/ui/Button';

// Mock Data
const coursesList = [
    { id: 'all', title: 'All Courses' },
    { id: 'c1', title: 'Advanced React Patterns' },
    { id: 'c2', title: 'Python for Machine Learning' },
];

const initialAnnouncements = [
    {
        id: 1,
        course: 'Advanced React Patterns',
        subject: 'New Bonus Section Added!',
        message: 'Hi everyone! I just uploaded 3 new videos covering the latest React 19 hooks. Make sure to check them out in Section 8.',
        date: '2 hours ago',
        sentTo: 1450
    },
    {
        id: 2,
        course: 'All Courses',
        subject: 'Upcoming Live Q&A Session',
        message: 'Join me this Saturday at 2 PM GMT for a live Q&A session on YouTube. Bring your toughest questions!',
        date: '3 days ago',
        sentTo: 5200
    }
];

const InstructorAnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [showForm, setShowForm] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState('all');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setIsSending(true);
        setTimeout(() => {
            const courseName = coursesList.find(c => c.id === selectedCourse)?.title || 'Selected Course';
            const newAnnouncement = {
                id: Date.now(),
                course: courseName,
                subject,
                message,
                date: 'Just now',
                sentTo: selectedCourse === 'all' ? 5200 : 1450 // Mock numbers
            };

            setAnnouncements([newAnnouncement, ...announcements]);
            setSubject('');
            setMessage('');
            setSelectedCourse('all');
            setShowForm(false);
            setIsSending(false);
            toast.success('Announcement sent successfully!');
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Announcements</h1>
                    <p className="text-slate-500 dark:text-slate-400">Keep your students engaged by sending updates and news.</p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)}>
                        <Megaphone className="w-5 h-5 mr-2" /> New Announcement
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
                        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Compose Announcement</h2>
                            <form onSubmit={handleSend} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    >
                                        {coursesList.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Important Update: New Content Added"
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                                        {/* Mock Formatting Toolbar */}
                                        <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                            <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Bold"><Bold size={16} /></button>
                                            <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Italic"><Italic size={16} /></button>
                                            <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="List"><List size={16} /></button>
                                            <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-400" title="Link"><LinkIcon size={16} /></button>
                                            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Mock Rich Text Editor</span>
                                        </div>
                                        <textarea
                                            required
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write your message here..."
                                            rows="6"
                                            className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-white focus:outline-none transition-colors resize-y"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)} disabled={isSending}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSending || !subject || !message}>
                                        {isSending ? 'Sending...' : <><Send size={16} className="mr-2" /> Send Announcement</>}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Past Announcements</h2>
            <div className="space-y-4">
                {announcements.map((ann) => (
                    <motion.div
                        key={ann.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{ann.subject}</h3>
                                <p className="text-sm font-medium text-primary dark:text-primary-400">{ann.course}</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {ann.date}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span className="flex items-center gap-1.5"><Users size={14} /> Sent to {ann.sentTo.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p>{ann.message}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
};

export default InstructorAnnouncementsPage;
