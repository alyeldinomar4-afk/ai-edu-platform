import { useState, useEffect, useRef } from 'react';
import { Send, Zap, Bot, User, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TypewriterMessage from './TypewriterMessage';

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

    const handleSend = (e, customText = null) => {
        if (e) e.preventDefault();
        const textToSend = customText || input;
        if (!textToSend.trim()) return;

        addMarker?.(currentTime);

        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'user',
            text: textToSend,
            timestamp: currentTime
        }]);

        if (!customText) setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            
            let responseText = t('videoPlayer.aiTutor.analyzingResponse', { timestamp: formatTime(currentTime) });

            // Premium AI Behavior Triggers
            if (textToSend === t('videoPlayer.aiTutor.explainScenePrompt')) {
                responseText = isRTL 
                    ? "أرى شرحًا لبنية الـ React Context تظهر على الشاشة. يتحدث المعلم في هذه اللحظة عن كيفية تمرير البيانات عبر شجرة المكونات دون الحاجة لاستخدام الـ Props يدوياً."
                    : "I see a structural diagram showing React Context architecture. The instructor is explaining how data is passed through the component tree without manually passing props at every level.";
            } 
            else if (textToSend === t('videoPlayer.aiTutor.showCodePrompt')) {
                // Code Formatting & Typewriter Feature
                responseText = isRTL
                    ? "بالتأكيد! إليك كود برمجي يوضح المفهوم الذي يتم شرحه في الفيديو:\n\n```javascript\nimport { useState, useEffect } from 'react';\n\nexport const useDebounce = (value, delay) => {\n  const [val, setVal] = useState(value);\n  useEffect(() => {\n    const h = setTimeout(() => setVal(value), delay);\n    return () => clearTimeout(h);\n  }, [value, delay]);\n  return val;\n};\n```\n\nويمكنك نسخه مباشرة وتجربته في مشروعك! 🚀"
                    : "Certainly! Here's a clean implementation of the Custom Hook discussed in the video:\n\n```javascript\nimport { useState, useEffect } from 'react';\n\nexport const useDebounce = (value, delay) => {\n  const [val, setVal] = useState(value);\n  useEffect(() => {\n    const h = setTimeout(() => setVal(value), delay);\n    return () => clearTimeout(h);\n  }, [value, delay]);\n  return val;\n};\n```\n\nYou can copy this directly into your project! 🚀";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: responseText,
                timestamp: currentTime,
                isNew: true
            }]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[#0F172A] border-l border-slate-800 overflow-hidden text-slate-200 font-sans">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#131C31]">
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-white tracking-wide">{t('videoPlayer.aiTutor.title')}</h3>
                </div>
                {videoState?.isPlaying && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                        <span className="text-[10px] font-bold text-green-400 tracking-widest uppercase">{t('videoPlayer.aiTutor.liveSync')}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'ai' ? 'bg-indigo-600 outline outline-2 outline-indigo-500/30' : 'bg-slate-700'}`}>
                            {msg.role === 'ai' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-slate-300" />}
                        </div>
                        
                        <div className={`group relative p-4 rounded-2xl max-w-[80%] min-w-[30%] text-[15px] leading-relaxed transition-all duration-300 ${msg.role === 'ai'
                            ? `bg-[#1E293B] border border-slate-700/50 text-slate-300 ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-md`
                            : `bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 ${isRTL ? 'rounded-tl-none' : 'rounded-tr-none'}`
                            }`}>

                            {msg.timestamp !== undefined && (
                                <div className={`text-xs font-medium mb-2 flex items-center gap-1.5 opacity-70`}>
                                    <Clock size={12} /> {formatTime(msg.timestamp)}
                                </div>
                            )}

                            {msg.role === 'ai' ? (
                                <TypewriterMessage text={msg.text} isNew={msg.isNew} />
                            ) : (
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                            )}

                            {msg.isPrompt && (
                                <div className="mt-4 flex flex-wrap gap-2.5">
                                    <button
                                        onClick={() => handleSend(null, t('videoPlayer.aiTutor.explainSectionConfirm'))}
                                        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-md"
                                    >
                                        {t('videoPlayer.aiTutor.explainSection')}
                                    </button>
                                    <button
                                        onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
                                        className="text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-xl transition-all"
                                    >
                                        {t('videoPlayer.aiTutor.skip')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-4 animate-in fade-in duration-300">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 outline outline-2 outline-indigo-500/30 flex items-center justify-center shadow-lg">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div className={`bg-[#1E293B] border border-slate-700/50 p-4 rounded-2xl shadow-md flex gap-1.5 items-center h-[52px] ${isRTL ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-indigo-500/70 rounded-full animate-bounce [animation-delay:-0.2s]" />
                            <div className="w-2 h-2 bg-indigo-500/40 rounded-full animate-bounce [animation-delay:-0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-[#0A0F1C] border-t border-slate-800 shrink-0">
                <div className="mb-4 flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { label: t('videoPlayer.aiTutor.summarizePart'), text: t('videoPlayer.aiTutor.summarizePrompt') },
                        { label: t('videoPlayer.aiTutor.explainScene'), text: t('videoPlayer.aiTutor.explainScenePrompt') },
                        { label: t('videoPlayer.aiTutor.createQuiz'), text: t('videoPlayer.aiTutor.createQuizPrompt') },
                        { label: t('videoPlayer.aiTutor.showCode'), text: t('videoPlayer.aiTutor.showCodePrompt') }
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(null, btn.text)}
                            className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-400 hover:text-white px-4 py-2 rounded-full whitespace-nowrap transition-all shadow-sm active:scale-95"
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
                        className={`w-full py-4 bg-[#0F172A] border border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm text-white placeholder:text-slate-500 shadow-inner ${isRTL ? 'pr-5 pl-14' : 'pl-5 pr-14'}`}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className={`absolute top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent ${isRTL ? 'left-3' : 'right-3'}`}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContextualAI;
