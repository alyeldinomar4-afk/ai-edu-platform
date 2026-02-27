import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/useAuth';
import { MessageSquare, CheckCircle, Clock, ChevronDown, ChevronUp, Reply } from 'lucide-react';
import InstructorNav from '../../components/layout/InstructorNav';
import Button from '../../components/ui/Button';

// Mock Data
const initialQuestions = [
    {
        id: 1,
        studentName: 'Ahmed Ali',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Ali&background=random',
        course: 'Advanced React Patterns',
        question: 'Could you explain why we use forwardRef in the compound components pattern?',
        date: '2 hours ago',
        status: 'pending',
        reply: ''
    },
    {
        id: 2,
        studentName: 'Sarah Jenkins',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random',
        course: 'Python for Machine Learning',
        question: 'I am getting an out-of-bounds error on Pandas dataframes when using iloc. What is the best way to handle indices safely?',
        date: '1 day ago',
        status: 'resolved',
        reply: 'Hi Sarah. Check the boundaries of your dataframe before using iloc. You can safely slice by writing df.iloc[0:len(df)], which ensures we do not exceed the max index.'
    },
    {
        id: 3,
        studentName: 'Omar Hassan',
        avatar: 'https://ui-avatars.com/api/?name=Omar+Hassan&background=random',
        course: 'Advanced React Patterns',
        question: 'Is it bad practice to use Context CPU-intensive states?',
        date: '2 days ago',
        status: 'pending',
        reply: ''
    }
];

const InstructorQAPage = () => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState(initialQuestions);
    const [expandedId, setExpandedId] = useState(null);
    const [replyText, setReplyText] = useState('');

    const toggleExpand = (question) => {
        if (expandedId === question.id) {
            setExpandedId(null);
        } else {
            setExpandedId(question.id);
            setReplyText(question.reply || '');
        }
    };

    const handleReply = (id) => {
        if (!replyText.trim()) return;
        setQuestions(prev => prev.map(q =>
            q.id === id ? { ...q, status: 'resolved', reply: replyText } : q
        ));
        setExpandedId(null);
    };

    const pendingCount = questions.filter(q => q.status === 'pending').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Q&A Management</h1>
                <p className="text-slate-500 dark:text-slate-400">Answer student questions and keep them unblocked on their learning journey.</p>
            </div>

            <InstructorNav />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-2 text-yellow-600 dark:text-yellow-500">
                            <Clock className="w-5 h-5" />
                            <h3 className="font-semibold">Needs Reply</h3>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-2 text-green-600 dark:text-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <h3 className="font-semibold">Resolved</h3>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{questions.length - pendingCount}</p>
                    </div>
                </div>

                {/* Questions List */}
                <div className="md:col-span-3 space-y-4">
                    {questions.map((q) => (
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
                                className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                            >
                                <div className="flex items-start gap-4">
                                    <img src={q.avatar} alt={q.studentName} className="w-10 h-10 rounded-full mt-1" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{q.studentName}</h3>
                                            <span className="text-xs text-slate-400 dark:text-slate-500">• {q.date}</span>
                                        </div>
                                        <p className="text-sm text-primary dark:text-primary-400 font-medium mb-1">{q.course}</p>
                                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{q.question}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${q.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                        {q.status === 'pending' ? 'Pending' : 'Resolved'}
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
                                                        placeholder="Write your answer here..."
                                                        rows="4"
                                                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-y mb-3"
                                                    />
                                                    <div className="flex justify-end gap-3">
                                                        <Button variant="ghost" onClick={() => setExpandedId(null)}>Cancel</Button>
                                                        <Button onClick={() => handleReply(q.id)}>
                                                            <Reply size={16} className="mr-2" />
                                                            {q.status === 'resolved' ? 'Update Answer' : 'Post Answer'}
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
                    {questions.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No questions yet</h3>
                            <p className="text-slate-500 dark:text-slate-400">You are all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorQAPage;
