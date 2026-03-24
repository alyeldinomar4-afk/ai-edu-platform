import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';

const AIDemoPage = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: t('videoPlayer.aiDemo.welcome'),
            timestamp: new Date()
        }
    ]);

    // Update initial message when language changes
    useEffect(() => {
        setMessages(prev => prev.map(m => {
            if (m.id === 1 && m.role === 'assistant') {
                return { ...m, content: t('videoPlayer.aiDemo.welcome') };
            }
            return m;
        }));
    }, [t]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 150);

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 300);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const getDemoResponse = (userMessage) => {
        const msg = userMessage.toLowerCase();

        if (msg.includes('react') || msg.includes('component') || msg.includes('ريأكت')) {
            return t('videoPlayer.aiDemo.responses.react');
        }
        
        if (msg.includes('python') || msg.includes('loop') || msg.includes('بايثون')) {
            return t('videoPlayer.aiDemo.responses.python');
        }
        
        if (msg.includes('machine learning') || msg.includes('ml') || msg.includes('ai') || msg.includes('تعلم الآلة') || msg.includes('ذكاء اصطناعي')) {
            return t('videoPlayer.aiDemo.responses.ml');
        }
        
        if (msg.includes('help') || msg.includes('what can you do') || msg.includes('مساعدة')) {
            return t('videoPlayer.aiDemo.responses.help');
        }

        return t('videoPlayer.aiDemo.responses.default', { message: userMessage });
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                role: 'assistant',
                content: getDemoResponse(input),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        t('videoPlayer.aiDemo.questions.react'),
        t('videoPlayer.aiDemo.questions.python'),
        t('videoPlayer.aiDemo.questions.ml'),
        t('videoPlayer.aiDemo.questions.js')
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('videoPlayer.aiDemo.backToHome')}</span>
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('videoPlayer.aiDemo.title')}</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t('videoPlayer.aiDemo.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors"
                    style={{ height: 'calc(100vh - 280px)' }}
                >
                    {/* Messages */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant'
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                        }`}>
                                        {message.role === 'assistant' ? (
                                            <Bot className="w-5 h-5 text-white" />
                                        ) : (
                                            <User className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                                        <div className={`rounded-2xl p-4 ${message.role === 'assistant'
                                            ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50'
                                            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md'
                                            }`}>
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                {message.content}
                                            </div>
                                        </div>
                                        <div className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing Indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Suggested Questions */}
                    {messages.length <= 2 && (
                        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 transition-colors">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2">{t('videoPlayer.aiDemo.tryAsking')}</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.map((question, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(question)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-all shadow-sm"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={t('videoPlayer.aiDemo.placeholder')}
                                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                disabled={isTyping}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="px-6 rounded-xl"
                            >
                                {isTyping ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center italic">
                            {t('videoPlayer.aiDemo.demoMode')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIDemoPage;
