import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, ArrowLeft, Zap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import VideoPlayer from '../components/features/video/VideoPlayer';
import TypewriterMessage from '../components/features/ai/TypewriterMessage';

const AIDemoPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: t('videoPlayer.aiDemo.welcome'),
            timestamp: new Date(),
            isNew: false
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

        if (msg.includes('code') || msg.includes('مثال') || msg.includes('كود')) {
            return isRTL 
                ? "بالتأكيد! إليك مثال بسيط لكود React لمكون (Component) يقوم بعرض رسالة ترحيب:\n\n```javascript\nfunction Welcome() {\n  return (\n    <div className='p-4 bg-blue-500 text-white rounded-lg'>\n      <h1>أهلاً بك في مشروعي!</h1>\n    </div>\n  );\n}\n```\nلاحظ كيف قمت بتنسيقه لك بشكل احترافي! ✨"
                : "Sure thing! Here is a simple React component example:\n\n```javascript\nfunction Welcome() {\n  return (\n    <div className='p-4 bg-blue-500 text-white rounded-lg'>\n      <h1>Welcome to my project!</h1>\n    </div>\n  );\n}\n```\nI have formatted it for you to be easy to read! ✨";
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
            const content = getDemoResponse(input);
            
            const aiResponse = {
                id: messages.length + 2,
                role: 'assistant',
                content: content,
                timestamp: new Date(),
                isNew: true
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
        isRTL ? "أعطني مثال كود" : "Give me a code example",
        t('videoPlayer.aiDemo.questions.ml')
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">{t('videoPlayer.aiDemo.backToHome')}</span>
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('videoPlayer.aiDemo.title')}</h1>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">{t('videoPlayer.aiDemo.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left side: Video Player */}
                    <div className="w-full lg:flex-1 lg:sticky lg:top-8 order-2 lg:order-1">
                        <div className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 p-2 transition-all hover:shadow-primary/5">
                            <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-950">
                                <VideoPlayer 
                                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                                    title={t('videoPlayer.aiDemo.title')}
                                />
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                                    <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t('videoPlayer.aiDemo.features.context.title')}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{t('videoPlayer.aiDemo.features.context.desc')}</p>
                            </div>
                            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                                    <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t('videoPlayer.aiDemo.features.interactive.title')}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{t('videoPlayer.aiDemo.features.interactive.desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Chat */}
                    <div
                        className="w-full lg:w-[450px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-all order-1 lg:order-2"
                        style={{ height: 'calc(100vh - 120px)', maxHeight: '750px' }}
                    >
                        {/* Messages Area */}
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
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${message.role === 'assistant'
                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                            : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                                            }`}>
                                            {message.role === 'assistant' ? (
                                                <Bot className="w-5 h-5 text-white" />
                                            ) : (
                                                <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                            )}
                                        </div>

                                        <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'items-end' : ''}`}>
                                            <div className={`rounded-3xl p-4 shadow-sm ${message.role === 'assistant'
                                                ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50'
                                                : 'bg-primary text-white shadow-primary/20'
                                                }`}>
                                                <div className="text-sm leading-relaxed overflow-hidden">
                                                    {message.role === 'assistant' ? (
                                                        <TypewriterMessage text={message.content} isNew={message.isNew} />
                                                    ) : (
                                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 px-3 font-medium ${message.role === 'user' ? 'text-right' : ''}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-5 py-4 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area section */}
                        <div className="mt-auto border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
                            {messages.length <= 2 && (
                                <div className="mb-6">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-3">{t('videoPlayer.aiDemo.tryAsking')}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedQuestions.map((question, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInput(question)}
                                                className="text-[11px] font-semibold px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-all shadow-sm active:scale-95"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 items-center">
                                <div className="relative flex-1 group">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={t('videoPlayer.aiDemo.placeholder')}
                                        className="w-full pl-5 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                                        disabled={isTyping}
                                    />
                                </div>
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center p-0 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                                >
                                    {isTyping ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Send className="w-6 h-6" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 text-center font-medium italic">
                                {t('videoPlayer.aiDemo.demoMode')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIDemoPage;
