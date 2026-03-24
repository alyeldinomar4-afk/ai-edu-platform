import { useState, useEffect, useRef } from 'react';
import { Send, Zap, Bot, User, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const ContextualAI = ({ videoState, addMarker }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', text: t('videoPlayer.aiTutor.defaultWelcome') }
    ]);

    // Update initial message when language changes
    useEffect(() => {
        setMessages(prev => prev.map(m => {
            if (m.id === 1 && m.role === 'ai') {
                return { ...m, text: t('videoPlayer.aiTutor.defaultWelcome') };
            }
            return m;
        }));
    }, [t]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Refs for logic persistence
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

    // AI Pause Awareness with Cooldown and Debounce
    useEffect(() => {
        // Clear any existing timer when video starts playing or state changes
        if (!isPaused || videoState?.currentTime === 0) {
            if (pauseTimerRef.current) {
                clearTimeout(pauseTimerRef.current);
                pauseTimerRef.current = null;
            }
            return;
        }

        // Debounce: Wait 3 seconds of continuous pause before prompting
        pauseTimerRef.current = setTimeout(() => {
            const now = Date.now();
            const timeSinceLastPrompt = now - lastPromptTimeRef.current;
            const approximateTime = Math.floor(currentTime / 5) * 5; // Group by 5s blocks

            // Check Cooldown (10s) and Duplicates (same 5s block)
            if (timeSinceLastPrompt > 10000 && !promptedTimestampsRef.current.has(approximateTime)) {
                const timestamp = formatTime(currentTime);
                const promptId = `prompt-${Date.now()}`;

                setMessages(prev => [...prev, {
                    id: promptId,
                    role: 'ai',
                    text: t('videoPlayer.aiTutor.pausePrompt', { timestamp }),
                    isPrompt: true,
                    timestamp: currentTime
                }]);

                // Update refs
                lastPromptTimeRef.current = now;
                promptedTimestampsRef.current.add(approximateTime);
                addMarker?.(currentTime);
            }
        }, 3000);

        return () => {
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
        };
    }, [isPaused, currentTime, videoState, addMarker]);

    const handleSend = (e, customText = null) => {
        if (e) e.preventDefault();
        const textToSend = customText || input;
        if (!textToSend.trim()) return;

        // Add visual marker on video
        addMarker?.(currentTime);

        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'user',
            text: textToSend,
            timestamp: currentTime
        }]);

        if (!customText) setInput('');
        setIsTyping(true);

        // Mock AI response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: t('videoPlayer.aiTutor.analyzingResponse', { timestamp: formatTime(currentTime) }),
                timestamp: currentTime
            }]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 transition-colors">
            <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg shadow-inner">
                        <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{t('videoPlayer.aiTutor.title')}</h3>
                </div>
                {videoState?.isPlaying && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 tracking-tight uppercase">{t('videoPlayer.aiTutor.liveSync')}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`group relative p-3 rounded-2xl max-w-[85%] text-sm transition-all duration-200 ${msg.role === 'ai'
                            ? `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'}`
                            : `bg-primary text-white shadow-md shadow-primary/10 ${isRTL ? 'rounded-tl-none' : 'rounded-tr-none'}`
                            }`}>

                            {msg.timestamp !== undefined && (
                                <div className={`text-[9px] font-bold mb-1.5 flex items-center gap-1 ${msg.role === 'ai' ? 'text-primary' : 'text-primary-100/80'}`}>
                                    <Clock size={10} className="opacity-70" /> {formatTime(msg.timestamp)}
                                </div>
                            )}

                            {msg.text}

                            {msg.isPrompt && (
                                <div className="mt-3.5 flex gap-2">
                                    <button
                                        onClick={() => handleSend(null, t('videoPlayer.aiTutor.explainSectionConfirm'))}
                                        className="text-[10px] font-bold bg-primary text-white px-3.5 py-2 rounded-lg hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                                    >
                                        {t('videoPlayer.aiTutor.explainSection')}
                                    </button>
                                    <button
                                        onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                                        className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    >
                                        {t('videoPlayer.aiTutor.skip')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3 animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                            <Bot size={16} />
                        </div>
                        <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl shadow-sm flex gap-1.5 items-center ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { label: t('videoPlayer.aiTutor.summarizePart'), text: t('videoPlayer.aiTutor.summarizePrompt') },
                        { label: t('videoPlayer.aiTutor.explainScene'), text: t('videoPlayer.aiTutor.explainScenePrompt') },
                        { label: t('videoPlayer.aiTutor.createQuiz'), text: t('videoPlayer.aiTutor.createQuizPrompt') }
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(null, btn.text)}
                            className="text-[10px] font-bold bg-white dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary/20 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full whitespace-nowrap transition-all shadow-sm active:scale-95"
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        placeholder={t('videoPlayer.aiTutor.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`w-full py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'}`}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className={`absolute top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent ${isRTL ? 'left-2.5' : 'right-2.5'}`}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContextualAI;
