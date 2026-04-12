import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, ArrowLeft, Zap, Code, Brain, BookOpen, MessageSquare, Lightbulb, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TypewriterMessage from '../components/features/ai/TypewriterMessage';
import { api } from '../services/api';

const AIDemoPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: t('videoPlayer.aiDemo.welcome'), timestamp: new Date(), isNew: false }
    ]);

    useEffect(() => {
        setMessages(prev => prev.map(m => {
            if (m.id === 1 && m.role === 'assistant') return { ...m, content: t('videoPlayer.aiDemo.welcome') };
            return m;
        }));
    }, [t]);

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        
        const userMessage = { id: Date.now(), role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        
        const savedInput = input;
        setInput('');
        setIsTyping(true);

        try {
            const result = await api.ai.chat(savedInput);
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: result.message, 
                timestamp: new Date(), 
                isNew: true 
            }]);
        } catch (error) {
            console.error("AI Demo Error:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                role: 'assistant', 
                content: isRTL ? "عذراً، حدث خطأ في الاتصال بنظام الذكاء الاصطناعي." : "Sorry, I had trouble connecting to the AI system.", 
                timestamp: new Date(), 
                isNew: true 
            }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const suggestedQuestions = [
        { label: t('videoPlayer.aiDemo.questions.react'), icon: Code },
        { label: t('videoPlayer.aiDemo.questions.python'), icon: BookOpen },
        { label: isRTL ? 'أعطني مثال كود' : 'Give me a code example', icon: Lightbulb },
        { label: t('videoPlayer.aiDemo.questions.ml'), icon: Brain },
    ];

    const features = [
        { icon: Brain, title: isRTL ? 'ذكاء سياقي' : 'Contextual AI', desc: isRTL ? 'يفهم السياق ويقدم إجابات دقيقة' : 'Understands context for precise answers', color: 'from-blue-500 to-cyan-500' },
        { icon: Code, title: isRTL ? 'أمثلة برمجية' : 'Code Examples', desc: isRTL ? 'كود جاهز للنسخ مع تنسيق احترافي' : 'Copy-ready code with syntax highlighting', color: 'from-purple-500 to-pink-500' },
        { icon: Eye, title: isRTL ? 'تحليل مباشر' : 'Live Analysis', desc: isRTL ? 'يحلل الفيديو ويشرح المحتوى فورياً' : 'Analyzes video and explains content live', color: 'from-amber-500 to-orange-500' },
        { icon: MessageSquare, title: isRTL ? 'محادثة طبيعية' : 'Natural Chat', desc: isRTL ? 'تحدث معه كأنه معلم حقيقي' : 'Chat naturally like a real tutor', color: 'from-emerald-500 to-teal-500' },
    ];

    const msgVariants = {
        hidden: (role) => ({ opacity: 0, x: role === 'user' ? 20 : -20, scale: 0.95 }),
        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-[#0A0F1C] dark:via-slate-950 dark:to-[#0A0F1C] text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300">
            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-400/5 dark:bg-indigo-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/5 dark:bg-purple-600/8 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-400/3 dark:bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back link */}
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors mb-6 group text-sm">
                    <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
                    {t('videoPlayer.aiDemo.backToHome')}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-auto lg:h-[calc(100vh-120px)]">
                    {/* ========== INTRO (TITLE CARD) ========== */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-[320px] order-1 lg:order-none lg:col-start-1 lg:row-start-1 flex flex-col"
                    >
                        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0"
                                >
                                    <Sparkles className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{t('videoPlayer.aiDemo.title')}</h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('videoPlayer.aiDemo.subtitle')}</p>
                                </div>
                            </div>
                            <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-none">{t('videoPlayer.aiDemo.description')}</p>
                        </div>
                    </motion.div>

                    {/* ========== RIGHT CHAT (ORDERED BEFORE FEATURES ON MOBILE) ========== */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex-1 order-2 lg:order-none lg:col-start-2 lg:row-span-2 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden min-h-0 shadow-sm dark:shadow-none mb-6 lg:mb-0 h-[600px] lg:h-auto"
                    >
                        {/* Chat Header */}
                        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-white/40 dark:bg-slate-900/40">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nexora AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{isRTL ? 'متصل الآن' : 'Online'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-full">
                                <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">{isRTL ? 'وضع تجريبي' : 'Demo Mode'}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        custom={message.role}
                                        variants={msgVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${message.role === 'assistant'
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
                                                : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                                }`}
                                        >
                                            {message.role === 'assistant'
                                                ? <Bot className="w-5 h-5 text-white" />
                                                : <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                            }
                                        </motion.div>

                                        <div className="flex-1 max-w-[85%]">
                                            <div className={`rounded-2xl p-4 text-[14px] leading-relaxed shadow-sm transition-all duration-300 ${message.role === 'assistant'
                                                ? `bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'} hover:bg-white dark:hover:bg-slate-800 transition-colors`
                                                : `bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20 ${isRTL ? 'rounded-tl-none' : 'rounded-tr-none'}`
                                                }`}>
                                                <div className="overflow-hidden">
                                                    {message.role === 'assistant' ? (
                                                        <TypewriterMessage text={message.content} isNew={message.isNew} />
                                                    ) : (
                                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-2 font-semibold tracking-wide ${message.role === 'user' ? (isRTL ? 'text-left' : 'text-right') : ''}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                        <div className={`bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 rounded-2xl px-5 py-3.5 ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1.5">
                                                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                                                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-purple-500 rounded-full" />
                                                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-pink-500 rounded-full" />
                                                </div>
                                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{isRTL ? 'يفكر...' : 'Thinking...'}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4 sm:p-5 flex-shrink-0">
                            {/* Suggested questions */}
                            {messages.length <= 2 && (
                                <div className="mb-4">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2.5">{t('videoPlayer.aiDemo.tryAsking')}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {suggestedQuestions.map((q, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.02, y: -1 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setInput(q.label)}
                                                className="group/q relative text-[11px] font-semibold bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:border-primary/30 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white px-3 py-2.5 rounded-xl transition-all flex items-center gap-2 overflow-hidden"
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/[0.03] to-transparent -translate-x-full group-hover/q:translate-x-full transition-transform duration-700" />
                                                <q.icon size={14} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 relative z-10" />
                                                <span className="relative z-10 truncate">{q.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="relative flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={t('videoPlayer.aiDemo.placeholder')}
                                    className={`w-full py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner ${isRTL ? 'pl-14 pr-5' : 'pr-14 pl-5'}`}
                                    disabled={isTyping}
                                />
                                <motion.button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:shadow-none transition-all hover:shadow-xl hover:shadow-indigo-500/30 ${isRTL ? 'left-2' : 'right-2'}`}
                                >
                                    {isTyping ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Send className={`w-5 h-5 text-white ${isRTL ? 'scale-x-[-1]' : ''}`} />
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* ========== FEATURES LIST (ORDERED AFTER CHAT ON MOBILE) ========== */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:w-[320px] order-3 lg:order-none lg:col-start-1 lg:row-start-2"
                    >
                        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none h-full">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">{isRTL ? 'المميزات' : 'Features'}</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                                {features.map((feat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="group flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-all cursor-default border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 text-center sm:text-start lg:text-start"
                                    >
                                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center flex-shrink-0 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity`}>
                                            <feat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[12px] sm:text-sm font-bold text-slate-800 dark:text-white mb-0.5 transition-colors group-hover:text-primary dark:group-hover:text-indigo-400 truncate">{feat.title}</h4>
                                            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-tight font-medium hidden sm:block lg:block">{feat.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AIDemoPage;
