import { useState, useEffect, useRef } from 'react';
import { Send, Zap, Bot, User, Clock, Sparkles, FileText, Eye, Target, Code2, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TypewriterMessage from './TypewriterMessage';
import { api } from '../../../services/api';

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const msgVariants = {
    hidden: (role) => ({
        opacity: 0,
        x: role === 'user' ? 20 : -20,
        scale: 0.95,
    }),
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const buttonStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const buttonItem = {
    hidden: { opacity: 0, y: 8, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
};

const ContextualAI = ({ videoState, addMarker, hideHeader = false }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', text: t('videoPlayer.aiTutor.defaultWelcome'), isNew: false }
    ]);

    useEffect(() => {
        setMessages(prev => prev.map(m => {
            if (m.id === 1 && m.role === 'ai') {
                return { ...m, text: t('videoPlayer.aiTutor.defaultWelcome'), isNew: false };
            }
            return m;
        }));
    }, [t]);

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const pauseTimerRef = useRef(null);
    const lastPromptTimeRef = useRef(0);
    const promptedTimestampsRef = useRef(new Set());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const currentTime = videoState?.currentTime || 0;
    const isPaused = !videoState?.isPlaying;

    useEffect(() => {
        if (!isPaused || videoState?.currentTime === 0) {
            if (pauseTimerRef.current) {
                clearTimeout(pauseTimerRef.current);
                pauseTimerRef.current = null;
            }
            return;
        }

        pauseTimerRef.current = setTimeout(() => {
            const now = Date.now();
            const timeSinceLastPrompt = now - lastPromptTimeRef.current;
            const approximateTime = Math.floor(currentTime / 5) * 5;

            if (timeSinceLastPrompt > 10000 && !promptedTimestampsRef.current.has(approximateTime)) {
                const timestamp = formatTime(currentTime);
                const promptId = `prompt-${Date.now()}`;

                setMessages(prev => [...prev, {
                    id: promptId,
                    role: 'ai',
                    text: t('videoPlayer.aiTutor.pausePrompt', { timestamp }),
                    isPrompt: true,
                    timestamp: currentTime,
                    isNew: true
                }]);

                lastPromptTimeRef.current = now;
                promptedTimestampsRef.current.add(approximateTime);
                addMarker?.(currentTime);
            }
        }, 3000);

        return () => {
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        };
    }, [isPaused, currentTime, videoState, addMarker, t]);

    const handleSend = async (e, customText = null) => {
        if (e) e.preventDefault();
        const textToSend = customText || input;
        if (!textToSend.trim()) return;

        addMarker?.(currentTime);

        const userMessageId = Date.now();
        setMessages(prev => [...prev, {
            id: userMessageId,
            role: 'user',
            text: textToSend,
            timestamp: currentTime
        }]);

        if (!customText) setInput('');
        setIsTyping(true);

        try {
            // Get action from text if it's one of the quick actions
            let action = 'chat';
            if (textToSend === t('videoPlayer.aiTutor.explainSectionConfirm')) action = 'explain-section';
            else if (textToSend === t('videoPlayer.aiTutor.summarizePrompt')) action = 'summarize';
            else if (textToSend === t('videoPlayer.aiTutor.explainScenePrompt')) action = 'explain-scene';
            else if (textToSend === t('videoPlayer.aiTutor.createQuizPrompt')) action = 'create-quiz';
            else if (textToSend === t('videoPlayer.aiTutor.showCodePrompt')) action = 'show-code';

            const response = await api.ai.videoAssistant({
                lectureId: videoState?.lectureId || 'demo-lecture',
                currentTime: currentTime,
                action: action,
                query: textToSend
            });

            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: response.message,
                timestamp: currentTime,
                isNew: true
            }]);
        } catch (error) {
            console.error('AI Assistant Error:', error);
            setIsTyping(false);
            // Simple fallback if API fails
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: isRTL ? "عذراً، حدث خطأ في الاتصال بالمدرب الذكي." : "Sorry, I had trouble connecting to the AI Tutor.",
                timestamp: currentTime,
                isNew: true
            }]);
        }
    };

    const quickActions = [
        { label: t('videoPlayer.aiTutor.summarizePart'), text: t('videoPlayer.aiTutor.summarizePrompt'), icon: FileText, color: 'text-blue-400' },
        { label: t('videoPlayer.aiTutor.explainScene'), text: t('videoPlayer.aiTutor.explainScenePrompt'), icon: Eye, color: 'text-emerald-400' },
        { label: t('videoPlayer.aiTutor.createQuiz'), text: t('videoPlayer.aiTutor.createQuizPrompt'), icon: Target, color: 'text-amber-400' },
        { label: t('videoPlayer.aiTutor.showCode'), text: t('videoPlayer.aiTutor.showCodePrompt'), icon: Code2, color: 'text-pink-400' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0F172A] border-l border-slate-800 overflow-hidden text-slate-200 font-sans relative">
            {/* Minimal Header for mobile or state indicator */}
            {!hideHeader && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#131C31]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-400/20">
                            <Zap className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('videoPlayer.aiTutor.title')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            {videoState?.isPlaying ? (
                                <motion.div
                                    key="watching"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20"
                                >
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider whitespace-nowrap">{t('videoPlayer.aiTutor.watchingWithYou', { defaultValue: 'LIVE' })}</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="paused"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 rounded-full border border-amber-400/20"
                                >
                                    <Pause size={10} className="text-amber-400 fill-amber-400" />
                                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider whitespace-nowrap">{t('videoPlayer.aiTutor.paused')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-8 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            custom={msg.role}
                            variants={msgVariants}
                            initial="hidden"
                            animate="visible"
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'ai'
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 outline outline-2 outline-indigo-500/30'
                                    : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            >
                                {msg.role === 'ai' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-slate-600 dark:text-slate-300" />}
                            </motion.div>

                            <div className={`group relative p-4 rounded-2xl max-w-[85%] min-w-[30%] text-[14px] leading-relaxed transition-all duration-300 ${msg.role === 'ai'
                                ? `bg-[#1E293B] border border-slate-700/50 text-slate-200 ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-md`
                                : `bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 ${isRTL ? 'rounded-tl-none' : 'rounded-tr-none'}`
                                }`}>

                                {msg.timestamp !== undefined && (
                                    <div className="text-[10px] font-medium mb-2 flex items-center gap-1.5 opacity-60">
                                        <Clock size={12} /> {formatTime(msg.timestamp)}
                                    </div>
                                )}

                                {msg.role === 'ai' ? (
                                    <TypewriterMessage text={msg.text} isNew={msg.isNew} />
                                ) : (
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                )}

                                {msg.isPrompt && (
                                    <motion.div
                                        variants={buttonStagger}
                                        initial="hidden"
                                        animate="visible"
                                        className="mt-4 flex flex-wrap gap-2.5"
                                    >
                                        <motion.button
                                            variants={buttonItem}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSend(null, t('videoPlayer.aiTutor.explainSectionConfirm'))}
                                            className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                                        >
                                            {t('videoPlayer.aiTutor.explainSection')}
                                        </motion.button>
                                        <motion.button
                                            variants={buttonItem}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                                            className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl transition-all cursor-pointer"
                                        >
                                            {t('videoPlayer.aiTutor.skip')}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator — Premium */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.95 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 outline outline-2 outline-indigo-500/30 flex items-center justify-center shadow-lg">
                                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                                    <Sparkles size={18} className="text-white" />
                                </motion.div>
                            </div>
                            <div className={`bg-[#1E293B] border border-slate-700/50 p-4 rounded-2xl shadow-md ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5 items-center">
                                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.15 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{t('videoPlayer.aiTutor.thinking', { defaultValue: 'AI is thinking...' })}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions + Input */}
            <div className="p-5 bg-[#0A0F1C] border-t border-slate-800 shrink-0">
                <div className="mb-4 grid grid-cols-2 gap-2">
                    {quickActions.map((btn, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSend(null, btn.text)}
                            className="group/pill relative text-[11px] font-bold bg-[#1E293B] hover:bg-slate-700 border border-slate-700/50 hover:border-indigo-500/30 text-slate-400 hover:text-white px-3 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
                        >
                            <btn.icon size={14} className={`${btn.color} relative z-10 flex-shrink-0 transition-transform group-hover/pill:scale-110`} />
                            <span className="relative z-10 truncate tracking-wide">{btn.label}</span>
                        </motion.button>
                    ))}
                </div>

                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        placeholder={t('videoPlayer.aiTutor.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`w-full py-3.5 bg-[#0F172A] border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-sm text-white placeholder:text-slate-500 shadow-inner ${isRTL ? 'pr-5 pl-14' : 'pl-5 pr-14'}`}
                    />
                    <motion.button
                        type="submit"
                        disabled={!input.trim()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: -15 }}
                        className={`absolute top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 transition-all disabled:opacity-20 cursor-pointer ${isRTL ? 'left-3' : 'right-3'}`}
                    >
                        <Send size={20} className={isRTL ? 'scale-x-[-1]' : ''} />
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default ContextualAI;
