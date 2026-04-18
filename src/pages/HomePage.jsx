import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Star, Code2, BarChart3, Palette, Megaphone, Camera, DollarSign, BookOpen, ArrowRight, Users, Award, Bot, Play, Pause, MessageCircle, Brain, Target, TrendingUp, Shield, Clock, GraduationCap, CheckCircle2, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';
import HeroSection from '../components/sections/HeroSection';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import CourseCard from '../components/features/course/CourseCard';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { formatCompactNumber } from '../utils/formatters';

/* ─── Shared Framer Motion variants ─── */
const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const fadeSlideUp = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const fadeScale = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const slideFromLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const slideFromRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

/* ═══════════════════════════════════════════════════════
   Animated AI Tutor Mockup — Cinematic Demo Component
═══════════════════════════════════════════════════════ */
const DEMO_PHASES = [
    { id: 'playing', duration: 3500 },
    { id: 'pausing', duration: 800 },
    { id: 'ai-asking', duration: 2200 },
    { id: 'typing', duration: 1800 },
    { id: 'ai-response', duration: 4000 },
    { id: 'reset', duration: 600 },
];

const AnimatedAITutorMockup = ({ isAr, t }) => {
    const [phase, setPhase] = useState(0);
    const [progress, setProgress] = useState(32);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);
    const chatScrollRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.3 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) return;
        const current = DEMO_PHASES[phase];
        const timer = setTimeout(() => {
            setPhase(prev => (prev + 1) % DEMO_PHASES.length);
        }, current.duration);
        return () => clearTimeout(timer);
    }, [phase, isInView]);

    useEffect(() => {
        if (DEMO_PHASES[phase].id !== 'playing' || !isInView) return;
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + 0.5, 48));
        }, 50);
        return () => clearInterval(interval);
    }, [phase, isInView]);

    useEffect(() => {
        if (DEMO_PHASES[phase].id === 'reset') setProgress(32);

        // Auto-scroll chat to bottom smoothly when phase (and content) changes
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTo({
                top: chatScrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [phase]);

    const currentPhase = DEMO_PHASES[phase].id;
    const isPaused = currentPhase !== 'playing' && currentPhase !== 'reset';
    const markers = [18, 35, 62, 78];

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-6xl mx-auto"
            dir={isAr ? 'rtl' : 'ltr'}
        >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 blur-[60px] rounded-3xl opacity-60 dark:opacity-40 -z-10" />

            <div className="bg-[#1a1a2e] rounded-2xl sm:rounded-[20px] overflow-hidden border border-slate-700/50 shadow-[0_0_60px_-15px_rgba(99,102,241,0.3)]">
                {/* Title bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#12121f] border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                        <div className={cn("flex gap-1.5", isAr && "flex-row-reverse")}>
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <div className={cn("px-3 py-1 bg-slate-800/60 rounded-md text-[10px] text-slate-400 font-mono flex items-center gap-1.5", isAr ? "mr-3" : "ml-3")}>
                            <div className="w-3 h-3 bg-primary/30 rounded flex items-center justify-center">
                                <Play className={cn("w-1.5 h-1.5 text-primary fill-primary", isAr && "rotate-180")} />
                            </div>
                            <span dir="ltr">nexora.ai/courses/react-masterclass/learn</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] text-green-400/80 font-medium">{t('home.howItWorks.mockup.active')}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:block relative">
                    {/* Video Player Side */}
                    <div className="w-full lg:w-[calc(100%-380px)] relative">
                        <div className="relative aspect-[4/3] sm:aspect-video bg-gradient-to-br from-[#0d0d1a] via-[#141428] to-[#0d0d1a] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-4 sm:inset-8 flex flex-col gap-1.5 sm:gap-2 opacity-50" dir="ltr">
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 hidden sm:block"><span className="text-pink-400">import</span> <span className="text-cyan-400">React</span> <span className="text-pink-400">from</span> <span className="text-yellow-300">'react'</span>;</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 hidden sm:block"><span className="text-pink-400">import</span> {'{'} <span className="text-cyan-400">useState</span>, <span className="text-cyan-400">useEffect</span> {'}'} <span className="text-pink-400">from</span> <span className="text-yellow-300">'react'</span>;</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 mt-1 sm:mt-2"><span className="text-pink-400">const</span> <span className="text-blue-400">useMemo</span> = (<span className="text-orange-400">factory</span>, <span className="text-orange-400">deps</span>) {'=> {'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4 hidden sm:block"><span className="text-green-400">{'// Memoize expensive computations'}</span></div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4"><span className="text-pink-400">const</span> <span className="text-cyan-400">ref</span> = <span className="text-blue-400">useRef</span>({'{ deps: undefined, value: undefined }'});</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4"><span className="text-purple-400">if</span> (!<span className="text-blue-400">shallowEqual</span>(<span className="text-cyan-400">ref</span>.current.deps, <span className="text-orange-400">deps</span>)) {'{'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-8"><span className="text-cyan-400">ref</span>.current = {'{'} <span className="text-orange-400">deps</span>, <span className="text-orange-400">value</span>: <span className="text-blue-400">factory</span>() {'}'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4">{'};'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4"><span className="text-pink-400">return</span> <span className="text-cyan-400">ref</span>.current.value;</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500">{'}'}</div>
                            </div>

                            <AnimatePresence>
                                {isPaused && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 gap-4">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="w-14 h-14 sm:w-16 sm:h-16 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white translate-x-0.5" />
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex items-center gap-2 bg-purple-600/20 backdrop-blur-md border border-purple-500/30 px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                        >
                                            <div className="flex gap-1.5">
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                                <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                            </div>
                                            <span className="text-xs font-black text-purple-100 uppercase tracking-widest leading-none translate-y-[0.5px]">
                                                {t('home.howItWorks.mockup.aiAnalyzing', { defaultValue: 'AI IS ANALYZING THIS MOMENT' })}
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {currentPhase === 'playing' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 bg-red-500/90 px-2 py-1 rounded-md z-10">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        <span className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-wider">{t('home.howItWorks.mockup.live')}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={cn("absolute bottom-5 sm:bottom-12 z-5", isAr ? "right-3 sm:right-4 text-right" : "left-3 sm:left-4 text-left")}>
                                <div className="text-white/60 text-[10px] sm:text-[11px] font-medium">{t('home.howItWorks.mockup.lectureInfo', { current: 7, total: 12 })}</div>
                                <div className="text-white text-xs sm:text-sm font-bold">{t('home.howItWorks.mockup.lectureTitle')}</div>
                            </div>
                        </div>

                        <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-[#0d0d1a] border-t border-slate-800/40">
                            <div className="relative h-1.5 bg-slate-800 rounded-full mb-2 group cursor-pointer">
                                <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                                {markers.map((pos, i) => (
                                    <div key={i} className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-purple-300 shadow-lg shadow-purple-500/50 z-10" style={{ left: `${pos}%` }} />
                                ))}
                                <motion.div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border-2 border-primary z-20" style={{ left: `${progress}%`, marginLeft: -7 }} />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        {isPaused ? <Play className={cn("w-3.5 h-3.5 text-white fill-white", isAr && "rotate-180")} /> : <Pause className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className="font-mono text-center" dir="ltr">12:{Math.floor(progress * 0.6).toString().padStart(2, '0')} / 28:45</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-purple-400">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                        <span className="text-[9px] font-bold">{t('home.howItWorks.mockup.points', { count: 4 })}</span>
                                    </div>
                                    <span className="text-slate-600">|</span>
                                    <span>1x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Chat Panel */}
                    <div className={cn(
                        "w-full lg:w-[380px] lg:absolute lg:top-0 lg:bottom-0 border-t lg:border-t-0 flex flex-col bg-[#0f0f1e]",
                        isAr ? "lg:left-0 lg:border-r border-slate-800/40" : "lg:right-0 lg:border-l border-slate-800/40"
                    )}>
                        <div className="px-4 py-3 border-b border-slate-800/40 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold text-white">{t('home.howItWorks.mockup.tutorName')}</div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] text-green-400 font-medium">{t('home.howItWorks.mockup.watchingStatus')}</span>
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                animate={isPaused ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className={cn("px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border", isPaused ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30")}
                            >
                                {isPaused ? `⏸ ${t('home.howItWorks.mockup.paused')}` : `▶ ${t('home.howItWorks.mockup.watching')}`}
                            </motion.div>
                        </div>

                        <div ref={chatScrollRef} className="px-3 py-3 sm:px-4 sm:py-4 space-y-3 overflow-y-auto scrollbar-hide h-[240px] sm:h-[280px] lg:h-auto lg:flex-1 lg:min-h-0">
                            <div className="flex gap-2.5 items-start">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-3 h-3 text-primary" /></div>
                                <div className={cn(
                                    "bg-slate-800/60 rounded-xl px-3 py-2 text-[11px] text-slate-300 leading-relaxed border border-slate-700/30 flex-1",
                                    isAr ? "rounded-tr-none text-right" : "rounded-tl-none text-left"
                                )}>
                                    {isAr ? (
                                        <>أرى أن المحاضر يشرح خطاف <span className="text-primary font-semibold">useMemo</span>. أنا أتتبع المفاهيم الأساسية من أجلك… 👀</>
                                    ) : (
                                        <>I see the instructor is explaining <span className="text-primary font-semibold">useMemo</span> hook. I'm tracking the key concepts for you… 👀</>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {(currentPhase === 'ai-asking' || currentPhase === 'typing' || currentPhase === 'ai-response') && (
                                    <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="flex gap-2.5 items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-primary/30"><Bot className="w-3 h-3 text-white" /></div>
                                        <div className={cn(
                                            "bg-primary/10 rounded-xl px-3 py-2 text-[11px] text-slate-200 leading-relaxed border border-primary/20 flex-1",
                                            isAr ? "rounded-tr-none text-right" : "rounded-tl-none text-left"
                                        )}>
                                            <div className={cn("flex items-center gap-1.5 mb-1", isAr && "flex-row-reverse")}><MessageCircle className="w-3 h-3 text-primary" /><span className="text-[9px] text-primary font-bold uppercase tracking-wider">{t('home.howItWorks.mockup.quickCheck')}</span></div>
                                            {isAr ? (
                                                <>لقد أوضح المحاضر للتو لماذا يمنع <span className="text-yellow-300 font-semibold">useMemo</span> إعادة الرندر غير الضرورية. هل تريدني أن أشرح ذلك؟ 🤔</>
                                            ) : (
                                                <>The instructor just explained why <span className="text-yellow-300 font-semibold">useMemo</span> prevents unnecessary re-renders. Want me to break it down? 🤔</>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {(currentPhase === 'typing' || currentPhase === 'ai-response') && (
                                    <motion.div initial={{ opacity: 0, x: isAr ? -20 : 20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className={cn("flex gap-2.5 items-start", isAr ? "flex-row" : "flex-row-reverse")}>
                                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-600"><Users className="w-3 h-3 text-slate-300" /></div>
                                        <div className={cn(
                                            "bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl px-3 py-2 text-[11px] text-white leading-relaxed shadow-lg shadow-indigo-600/20",
                                            isAr ? "rounded-tl-none text-left" : "rounded-tr-none text-right"
                                        )}>{t('home.howItWorks.mockup.userReply')}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {currentPhase === 'typing' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex gap-2.5 items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-3 h-3 text-white" /></motion.div>
                                        </div>
                                        <div className={cn("bg-slate-800/60 rounded-xl px-4 py-2.5 border border-slate-700/30", isAr ? "rounded-tr-none text-right" : "rounded-tl-none text-left")}>
                                            <div className="flex items-center gap-1.5">
                                                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-1.5 h-1.5 bg-secondary rounded-full" />
                                                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                                                <span className={cn("text-[9px] text-slate-500 font-medium", isAr ? "mr-1" : "ml-1")}>{t('home.howItWorks.mockup.thinking')}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {currentPhase === 'ai-response' && (
                                    <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex gap-2.5 items-start">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-3 h-3 text-white" /></div>
                                        <div className={cn(
                                            "bg-slate-800/60 rounded-xl px-3 py-2 text-[11px] text-slate-300 leading-relaxed border border-slate-700/30 flex-1 space-y-2",
                                            isAr ? "rounded-tr-none text-right" : "rounded-tl-none text-left"
                                        )}>
                                            {isAr ? (
                                                <p>بدون <span className="text-yellow-300">useMemo</span>، يتم حساب هذا في كل رندر:</p>
                                            ) : (
                                                <p>Without <span className="text-yellow-300">useMemo</span>, this recalculates every render:</p>
                                            )}
                                            <div className="bg-[#0a0a14] rounded-lg p-2.5 font-mono text-[10px] border border-white/5" dir="ltr">
                                                <div><span className="text-pink-400">const</span> <span className="text-cyan-400">result</span> = <span className="text-purple-400">useMemo</span>{'(() => {'}</div>
                                                <div className="ml-3"><span className="text-pink-400">return</span> <span className="text-blue-400">expensiveCalc</span>(a, b);</div>
                                                <div>{'}'}, [a, b]);</div>
                                            </div>
                                            {isAr ? (
                                                <p>هذا يحفظ النتيجة حتى تتغير <span className="text-cyan-400">[a, b]</span>! ✨</p>
                                            ) : (
                                                <p>This caches the result until <span className="text-cyan-400">[a, b]</span> change! ✨</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-t border-slate-800/40 bg-[#0a0a18]">
                            <div className="relative flex items-center">
                                <div className={cn("w-full py-2.5 px-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-[11px] text-slate-500", isAr ? "text-right" : "text-left")}>{t('home.howItWorks.mockup.inputPlaceholder')}</div>
                                <div className={cn("absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center opacity-50", isAr ? "left-2" : "right-2")}>
                                    <ArrowRight className={cn("w-3.5 h-3.5 text-white", isAr && "rotate-180")} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatedFeatureShowcase t={t} />
        </motion.div>
    );
};


/* ═══════════════════════════════════════════════════════
   Animated Feature Showcase — Interactive Feature Cards
═══════════════════════════════════════════════════════ */
const FEATURES_DATA = [
    { icon: Brain, key: 'feature1', color: 'from-indigo-500 to-violet-600', glow: 'violet' },
    { icon: Pause, key: 'feature2', color: 'from-cyan-500 to-blue-600', glow: 'cyan' },
    { icon: Target, key: 'feature3', color: 'from-purple-500 to-violet-600', glow: 'violet' },
    { icon: TrendingUp, key: 'feature4', color: 'from-emerald-500 to-teal-600', glow: 'emerald' },
];

const AnimatedFeatureShowcase = ({ t }) => {
    const [activeFeature, setActiveFeature] = useState(0);

    const glowColors = {
        pink: 'shadow-pink-500/30',
        violet: 'shadow-violet-500/30',
        cyan: 'shadow-cyan-500/30',
        amber: 'shadow-amber-500/30',
        emerald: 'shadow-emerald-500/30',
    };

    const localizedFeatures = FEATURES_DATA.map((f, i) => ({
        ...f,
        title: t(`home.howItWorks.featureTitle${i + 1}`),
        desc: t(`home.howItWorks.featureDesc${i + 1}`),
    }));

    return (
        <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {localizedFeatures.map((feature, i) => {
                    const isActive = i === activeFeature;
                    const IconComp = feature.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                            onClick={() => setActiveFeature(i)}
                            onMouseEnter={() => setActiveFeature(i)}
                            className={cn(
                                "relative cursor-pointer rounded-xl px-3 py-2 sm:px-4 sm:py-3 border transition-all duration-300 group/feat flex items-center gap-2.5 sm:gap-3",
                                isActive
                                    ? `bg-white dark:bg-slate-900/80 border-slate-300 dark:border-slate-600 shadow-md ${glowColors[feature.glow]}`
                                    : "bg-white/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
                            )}
                        >
                            {/* Active glow */}
                            {isActive && (
                                <motion.div
                                    layoutId="featureGlow"
                                    className={`absolute -inset-[1px] rounded-xl bg-gradient-to-br ${feature.color} opacity-[0.08] dark:opacity-[0.15]`}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 w-full">
                                <motion.div
                                    animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                                >
                                    <IconComp className="w-3.5 h-3.5 text-white" />
                                </motion.div>
                                <span className={cn(
                                    "text-[10px] sm:text-xs font-bold leading-tight transition-colors duration-300",
                                    isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover/feat:text-slate-800 dark:group-hover/feat:text-slate-300"
                                )}>
                                    {feature.title}
                                </span>
                            </div>

                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};


const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [fetchedStats, setFetchedStats] = useState(null);
    const [categoriesList, setCategoriesList] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            setIsLoading(true);
            try {
                const [coursesData, statsData, catsData, instData, testsData] = await Promise.all([
                    api.courses.getAll(),
                    api.stats.getPublicOverview(),
                    api.courses.getCategories(),
                    api.instructors.getAll(),
                    api.testimonials.getAll()
                ]);
                setFeaturedCourses(coursesData.slice(0, 4));
                setFetchedStats(statsData);
                setCategoriesList(catsData);
                setInstructors(instData);
                setTestimonials(testsData);
            } catch (error) {
                console.error('Error loading home data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadHomeData();
    }, []);

    const getStartedPath = !isAuthenticated
        ? '/register'
        : user?.role === 'admin'
            ? '/admin/dashboard'
            : user?.role === 'instructor'
                ? '/instructor/dashboard'
                : '/learner/dashboard';

    const iconMap = {
        Code2,
        BarChart3,
        Palette,
        Megaphone,
        Camera,
        DollarSign,
    };

    return (
        <div className="pb-24 overflow-x-hidden bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300">
            {/* Hero Section — Clean & Minimal */}
            <HeroSection getStartedPath={getStartedPath} />

            {/* Stats Section */}
            <section className="relative py-4 md:py-8 px-4 md:px-8 overflow-hidden bg-slate-50 dark:bg-[#0B1120]">

                <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-0">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {[
                            { label: t('home.stats.learners'), value: fetchedStats?.totalStudents || 52300, suffix: '+' },
                            { label: t('home.stats.courses'), value: fetchedStats?.activeCourses || 240, suffix: '+' },
                            { label: t('home.stats.instructors'), value: fetchedStats?.totalInstructors || 180, suffix: '+' },
                            { label: t('home.stats.satisfaction'), value: 99, suffix: '%' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeSlideUp}
                                className="relative group"
                            >
                                {/* Stat Card — Floating Square Look */}
                                <div className="flex flex-col items-center justify-center text-center h-full py-1 md:py-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                                    <div className="relative mb-1 md:mb-2">
                                        <h3 className="text-xl md:text-3xl font-alexandria font-black bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 bg-clip-text text-transparent selection:bg-primary/10">
                                            <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2.5} locale={i18n.language} compact={stat.value >= 1000} />
                                        </h3>
                                        <div className="mt-1.5 mx-auto w-10 h-[1.5px] bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '100%' }}
                                                transition={{ duration: 2, delay: 0.5 + (idx * 0.2) }}
                                                className="h-full bg-primary/50"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-alexandria font-bold uppercase tracking-[0.1em]">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ Categories / Domains — Editorial Text Layout ═══ */}
            <section className="relative py-14 md:py-20 overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    {(() => {
                        const DOMAIN_ACCENTS = ['#EC4899', '#6366F1', '#84CC16', '#F59E0B', '#8B5CF6', '#14B8A6'];

                        return (
                            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start relative">

                                {/* Left — Header Column */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="lg:sticky lg:top-40 lg:mt-12 relative z-10"
                                >
                                    {/* Decorative Glow */}
                                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                                    
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary font-bold tracking-widest uppercase text-xs mb-6 shadow-sm shadow-primary/5 backdrop-blur-sm"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        {t('home.categories.badge')}
                                    </motion.span>

                                    <div className={cn("flex items-start gap-4 mb-6", isAr && "flex-row-reverse")}>
                                        <div className="w-1.5 h-16 md:h-20 bg-gradient-to-b from-primary via-secondary to-accent rounded-full shrink-0 mt-1.5 shadow-lg shadow-primary/20" />
                                        <div>
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                                                {t('home.categories.titleMain')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent block mt-1 drop-shadow-sm">
                                                    {t('home.categories.titleHighlight')}
                                                </span>
                                            </h2>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-sm font-medium relative">
                                        {t('home.categories.subtitle')}
                                    </p>
                                </motion.div>

                                {/* Right — Domains Grid (2-col staggered, glass cards) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-6">
                                    {categoriesList.map((cat, idx) => {
                                        const accent = DOMAIN_ACCENTS[idx % DOMAIN_ACCENTS.length];
                                        const number = String(idx + 1).padStart(2, '0');
                                        const isRightCol = idx % 2 !== 0;
                                        const Icon = iconMap[cat.icon] || BookOpen;

                                        return (
                                            <motion.div
                                                key={cat.id}
                                                initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                                                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                                viewport={{ once: true, margin: '-40px' }}
                                                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                                                style={{ '--accent-color': accent }}
                                                className={cn(
                                                    "group cursor-pointer",
                                                    isRightCol && "sm:mt-10 md:mt-14"
                                                )}
                                            >
                                                {/* Glass Card */}
                                                <div className={cn(
                                                    "relative rounded-2xl p-4 md:p-7 overflow-hidden transition-all duration-500",
                                                    "bg-white/50 dark:bg-slate-900/30",
                                                    "backdrop-blur-xl",
                                                    "border border-slate-200/60 dark:border-white/[0.08]",
                                                    "shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]",
                                                    "group-hover:shadow-[0_12px_40px_rgba(99,102,241,0.1)] dark:group-hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]",
                                                    "group-hover:border-slate-300/80 dark:group-hover:border-white/15",
                                                    "group-hover:-translate-y-1"
                                                )}>
                                                    {/* Accent Line at top of glass */}
                                                    <motion.div
                                                        initial={{ scaleX: 0 }}
                                                        whileInView={{ scaleX: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.6, delay: 0.3 + idx * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                        className="absolute top-0 left-0 w-16 h-[3px] rounded-br-full origin-left group-hover:w-48 transition-all duration-500"
                                                        style={{ backgroundColor: accent }}
                                                    />

                                                    {/* Category Icon */}
                                                    <div 
                                                        className="w-10 h-10 md:w-12 md:h-12 rounded-2xl mb-4 md:mb-5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                                                        style={{ backgroundColor: `${accent}1A`, color: accent }}
                                                    >
                                                        <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                                                    </div>

                                                    {/* Category Name — Modern Responsive Styling */}
                                                    <h3 className="font-grotesk font-bold text-lg md:text-2xl mb-1 md:mb-2 tracking-tight transition-colors duration-300 text-slate-900 dark:text-white md:group-hover:text-[var(--accent-color)] max-md:text-[var(--accent-color)]">
                                                        {t(`courses.categories.${cat.name.charAt(0).toLowerCase() + cat.name.slice(1).replace(/\s+/g, '')}`)}
                                                    </h3>

                                                    {/* Course Count + Arrow */}
                                                    <div className={cn(
                                                        "flex items-center gap-2 mb-2 md:mb-3",
                                                        isAr && "flex-row-reverse"
                                                    )}>
                                                        <span className="text-[10px] md:text-[11px] font-grotesk font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                                                            {cat.count} {t('home.categories.coursesCount')}
                                                        </span>
                                                        <ArrowRight
                                                            className="w-3 h-3 md:w-3.5 md:h-3.5 transition-all duration-300 group-hover:translate-x-1"
                                                            style={{ color: accent }}
                                                        />
                                                    </div>

                                                    {/* Number — lifts up + glow on hover based on the whole card */}
                                                    <span
                                                        className="block font-grotesk font-bold text-sm md:text-lg tracking-tight opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_var(--accent-color)] transition-all duration-500 group-hover:-translate-y-1"
                                                        style={{ color: 'var(--accent-color)' }}
                                                    >
                                                        {number}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* Subtle Divider */}
            <div className="max-w-5xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            </div>

            {/* Featured Courses - Premium SaaS Stack */}
            <section className="py-16 md:py-20 bg-slate-50 dark:bg-[#0B1120] border-y border-slate-200/50 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-between items-end mb-10"
                    >
                        <div>
                            <span className="text-primary font-bold uppercase tracking-wider text-xs mb-3 block">{t('home.featured.badge')}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {t('home.featured.title')}
                            </h2>
                        </div>
                        <Link to="/courses">
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 hover:text-primary dark:text-slate-300 cursor-pointer">
                                {t('home.featured.btnViewAll')} <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-30px' }}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-6 -mx-6 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:px-0 md:mx-0 md:pb-4 md:snap-none md:overflow-visible"
                    >
                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="flex-none w-[85%] sm:w-[320px] md:w-auto h-[400px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[32px]" />
                            ))
                        ) : featuredCourses.map((course, idx) => (
                            <motion.div
                                key={course.id}
                                variants={fadeSlideUp}
                                className="flex-none w-[85%] sm:w-[320px] md:w-auto snap-start"
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/courses">
                            <Button variant="outline" className="w-full h-12 dark:border-slate-700 dark:text-slate-300">{t('home.featured.btnViewAll')}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* AI Feature Highlight — Premium SaaS Experience */}
            <section className="py-16 md:py-24 relative overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-visible">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-[#0d0d12] dark:bg-[#0d0d12] rounded-[2rem] p-8 sm:p-12 md:p-20 overflow-hidden relative text-white border border-white/[0.07] shadow-[0_0_60px_rgba(0,0,0,0.6)] z-10"
                    >
                        {/* Abstract Glassmorphic Mesh Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8a2be2_1px,transparent_1px),linear-gradient(to_bottom,#8a2be2_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_60%,transparent_100%)] opacity-[0.03] pointer-events-none z-0" />
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/8 blur-[120px] rounded-full pointer-events-none z-0" />
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/6 blur-[140px] rounded-full pointer-events-none z-0" />

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: isAr ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span>{t('home.aiHighlight.badge')}</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {t('home.aiHighlight.titleMain')} <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('home.aiHighlight.titleHighlight')}</span>
                                </h2>
                                <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                    {t('home.aiHighlight.subtitle')}
                                </p>
                                <Link to="/ai-demo">
                                    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-xl shadow-white/10 flex items-center gap-2 relative overflow-hidden group/ai">
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent -translate-x-full group-hover/ai:translate-x-full transition-transform duration-700" />
                                            <motion.span
                                                animate={{ rotate: [0, 15, -15, 0] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                className="relative z-10"
                                            >
                                                <Sparkles className="w-5 h-5 text-primary" />
                                            </motion.span>
                                            <span className="relative z-10 font-bold">{t('home.aiHighlight.btnTryDemo')}</span>
                                            <ArrowRight className={cn("w-5 h-5 relative z-10 transition-transform group-hover/ai:translate-x-1", isAr && "rotate-180 group-hover/ai:-translate-x-1")} />
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="relative"
                            >
                                {/* Refined Floating UI representation of chat */}
                                <div className="relative z-20 py-4">
                                    <div className="space-y-6">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div className="bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 p-4 rounded-2xl rounded-tl-none text-slate-200 dark:text-slate-300 text-sm flex-1 min-w-0 shadow-sm leading-relaxed">
                                                <p>{t('home.aiHighlight.chatUserQuery')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 relative">
                                                <Zap className="w-5 h-5 relative z-10" />
                                                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full -z-10" />
                                            </div>
                                            <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl rounded-tl-none text-slate-200 dark:text-slate-300 text-sm flex-1 min-w-0 shadow-sm leading-relaxed">
                                                <p className="mb-3">
                                                    {t('home.aiHighlight.chatAiResponse').split('`').map((part, i) => (
                                                        i % 2 === 1 ? (
                                                            <span key={i} className="text-purple-400 font-mono font-semibold px-1 py-0.5 bg-purple-400/10 rounded-md">
                                                                {part}
                                                            </span>
                                                        ) : part
                                                    ))}
                                                </p>
                                                <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-white/10 shadow-inner">
                                                    <span className="text-pink-400">const</span> <span className="text-cyan-400">memoizedValue</span> = <span className="text-purple-400">useMemo</span>(() <span className="text-pink-400">=&gt;</span> <span className="text-yellow-300">compute</span>(a, b), [a, b]);
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subtle ambient glow */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 blur-[100px] opacity-60 -z-10 rounded-full" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
            <div className="max-w-5xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            </div>

            {/* ═══ How It Works — Animated Mockup Demo ═══ */}
            <section className="relative py-10 md:py-14 overflow-hidden">

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10 md:mb-12"
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 text-primary font-semibold tracking-wider uppercase text-xs mb-4"
                        >
                            <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                <Zap className="w-3.5 h-3.5" />
                            </motion.span>
                            {t('home.howItWorks.badge', { defaultValue: 'See It in Action' })}
                        </motion.span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
                            {t('home.howItWorks.title', { defaultValue: 'Your AI Tutor,' })}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {t('home.howItWorks.titleHighlight', { defaultValue: 'Always Watching' })}
                            </span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
                            {t('home.howItWorks.subtitle', { defaultValue: 'Pause any video and your AI tutor instantly explains what\'s happening. It\'s like having a personal teacher for every lecture.' })}
                        </p>
                    </motion.div>

                    {/* ─── Animated Mockup ─── */}
                    <AnimatedAITutorMockup isAr={isAr} t={t} />

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-10"
                    >
                        <Link to="/ai-demo">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-purple-700 text-white border-none shadow-xl shadow-primary/25 flex items-center gap-2 relative overflow-hidden group/hiw mx-auto">
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/hiw:translate-x-full transition-transform duration-700" />
                                    <motion.span
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                        className="relative z-10"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.span>
                                    <span className="relative z-10">{t('home.howItWorks.cta', { defaultValue: 'Try It Yourself' })}</span>
                                    <ArrowRight className={cn("w-5 h-5 relative z-10 transition-transform group-hover/hiw:translate-x-1", isAr && "rotate-180 group-hover/hiw:-translate-x-1")} />
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Subtle Divider */}
            <div className="max-w-5xl mx-auto px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            </div>

            {/* Top Instructors Section */}
            <section className="relative py-10 md:py-14 overflow-hidden transition-colors duration-500">

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 gap-6 text-center md:text-start p-8 rounded-3xl bg-transparent dark:bg-transparent"
                    >
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                {t('home.instructors.titleMain')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('home.instructors.titleHighlight')}</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-lg mx-auto md:mx-0">
                                {t('home.instructors.subtitle')}
                            </p>
                        </div>
                        <Link to="/instructors" className="group shrink-0">
                            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:border-primary/50 dark:hover:border-slate-500 bg-white dark:bg-slate-800/30 backdrop-blur-sm rounded-full px-6 transition-all shadow-sm">
                                {t('home.instructors.viewAll')} <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${isAr ? 'mr-1.5 rotate-180 group-hover:-translate-x-1' : 'ml-1.5'}`} />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 px-6 -mx-6 scrollbar-hide md:flex-wrap md:justify-center md:px-0 md:mx-0 md:snap-none md:overflow-visible w-full max-w-7xl mx-auto"
                    >
                        {instructors.slice(0, 4).map((instructor, idx) => (
                            <motion.div
                                key={instructor.id}
                                variants={idx % 2 === 0 ? slideFromLeft : slideFromRight}
                                whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                                className="flex-none relative group w-[85%] sm:w-[500px] md:w-auto lg:w-[calc(50%-1.5rem)] xl:w-[550px] snap-center"
                            >
                                {/* Premium Hover Glow - Animated Gradient Border */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-accent rounded-[32px] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[1px]" />

                                <div className="relative h-full bg-white/70 dark:bg-[#11111e]/80 backdrop-blur-2xl rounded-[31px] p-5 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 text-center sm:text-start border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.2)] transition-all duration-500 overflow-hidden">

                                    {/* Animated Background Pulse */}
                                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors duration-500" />

                                    {/* Avatar with Enhanced Glow Ring */}
                                    <div className="relative shrink-0">
                                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-secondary rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 scale-125" />
                                        <div className="relative p-1 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-full group-hover:from-primary group-hover:to-secondary transition-all duration-700 shadow-inner">
                                            <div className="relative rounded-full overflow-hidden border-2 border-white dark:border-slate-900 shadow-2xl">
                                                <img src={instructor.avatar} alt={instructor.name} className="w-20 h-20 sm:w-28 sm:h-28 object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 15 }}
                                            className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1a1a2e] rounded-full p-2.5 border border-slate-100 dark:border-white/10 z-20 shadow-xl"
                                        >
                                            <Award className="w-4.5 h-4.5 text-primary" />
                                        </motion.div>
                                    </div>

                                    {/* Content with Improved Typography & Spacing */}
                                    <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full relative z-10">
                                        <div className="mb-3">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight group-hover:text-primary transition-colors duration-300">{instructor.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="h-px w-4 bg-primary/40" />
                                                <p className="text-primary dark:text-indigo-400 font-black text-[11px] uppercase tracking-[0.2em]">{instructor.role}</p>
                                            </div>
                                        </div>

                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 w-full leading-relaxed font-medium">
                                            {instructor.bio}
                                        </p>

                                        {/* Dynamic Stats Row - Redesigned Pills */}
                                        <div className="flex flex-wrap items-center gap-3 mb-8 text-slate-600 dark:text-slate-300 text-[11px] font-black w-full justify-center sm:justify-start">
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/10 backdrop-blur-sm group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                                <BookOpen className="w-4 h-4 text-primary" />
                                                <span className="uppercase tracking-wider">{instructor.coursesCount} Courses</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/10 backdrop-blur-sm group-hover:bg-yellow-500/5 group-hover:border-yellow-500/20 transition-all duration-500">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="uppercase tracking-wider">{instructor.rating} Rating</span>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto mt-auto">
                                            <Link to={`/instructor/user/${encodeURIComponent(instructor.name.replace(/\s+/g, '-').toLowerCase())}`} className="block">
                                                <Button
                                                    size="lg"
                                                    className="w-full sm:w-auto bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary dark:hover:text-white text-white border-none shadow-xl hover:shadow-primary/30 transition-all duration-500 text-[11px] font-black uppercase tracking-[0.15em] px-8 py-4 rounded-2xl relative overflow-hidden group/btn"
                                                >
                                                    <span className="relative z-10">{t('home.instructors.viewProfile')}</span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials — Stagger with Scale & Carousel Mobile */}
            <section className="py-10 md:py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10"
                    >
                        <span className="text-primary font-semibold tracking-wider uppercase text-[11px] sm:text-xs">{t('home.testimonials.badge')}</span>
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tighter">{t('home.testimonials.title')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg mx-auto leading-relaxed">{t('home.testimonials.subtitle')}</p>
                    </motion.div>
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 px-6 -mx-6 scrollbar-hide md:grid md:grid-cols-3 md:px-0 md:mx-0 md:snap-none md:overflow-visible relative"
                    >
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={testimonial.id}
                                variants={fadeScale}
                                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                                className="flex-none w-[80%] sm:w-[320px] md:w-auto snap-start p-6 sm:p-7 rounded-[28px] bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05]">
                                    <Users className="w-16 h-16 rotate-12" />
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative group/avatar">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                        <img src={testimonial.image} alt={testimonial.name} className="relative w-12 h-12 rounded-full object-cover ring-2 ring-slate-50 dark:ring-slate-800 shadow-md" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white text-sm">{testimonial.name}</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/80">
                                            {t(`home.testimonials.roles.${testimonial.role.charAt(0).toLowerCase() + testimonial.role.slice(1).replace(/\s+/g, '')}`)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={cn("w-3.5 h-3.5", i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
                                    ))}
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-xs md:text-sm font-medium relative z-10">"{testimonial.content}"</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section — Premium Immersive */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20"
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#1e1b4b_0%,#312e81_30%,#4c1d95_60%,#7c3aed_100%)]" />
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Animated Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    {/* Animated Orbs */}
                    <motion.div
                        animate={{ y: [0, -20, 0], x: [0, 15, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-8 left-[10%] w-32 h-32 bg-cyan-400/15 rounded-full blur-[60px]"
                    />
                    <motion.div
                        animate={{ y: [0, 15, 0], x: [0, -10, 0], scale: [1, 1.3, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-8 right-[15%] w-40 h-40 bg-pink-400/10 rounded-full blur-[60px]"
                    />
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400/10 rounded-full blur-[80px]"
                    />

                    {/* Content */}
                    <div className="relative z-10 py-8 md:py-14 px-4 sm:px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                            {/* Left - Text & CTA */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="text-center lg:text-start"
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs md:text-sm font-semibold mb-4 md:mb-6"
                                >
                                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300" />
                                    {t('home.cta.badge', { defaultValue: 'Start Your Journey' })}
                                </motion.div>

                                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-5 leading-tight">
                                    {t('home.cta.title')}
                                </h2>
                                <p className="text-white/70 text-xs sm:text-sm mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                    {t('home.cta.subtitle')}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center lg:justify-start mb-6 md:mb-8 w-full">
                                    <Link to={getStartedPath} className="w-full sm:w-auto block">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                                            <Button size="lg" variant="primary" className="w-full bg-white text-indigo-900 hover:bg-slate-100 px-4 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-xl font-bold transition-all shadow-xl shadow-black/20 border-none flex justify-center items-center gap-2 relative overflow-hidden group/cta">
                                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/30 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
                                                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                                                <span className="relative z-10">{isAuthenticated ? t('home.cta.btnContinue', { defaultValue: 'Continue Learning' }) : t('home.cta.getStarted', { defaultValue: 'Get Started Free' })}</span>
                                                <ArrowRight className={cn("w-4 h-4 relative z-10 transition-transform group-hover/cta:translate-x-1", isAr && "rotate-180 group-hover/cta:-translate-x-1")} />
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <Link to="/courses" className="w-full sm:w-auto block">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                                            <Button size="lg" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 flex justify-center items-center px-4 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-xl font-bold transition-all backdrop-blur-sm">
                                                {t('home.cta.browseCourses', { defaultValue: 'Browse Courses' })}
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex items-center gap-4 justify-center lg:justify-start">
                                    <div className="flex -space-x-2">
                                        {[
                                            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=60&q=80",
                                            "https://media.istockphoto.com/id/1401962955/photo/smiling-girl-climbing-college-stairs-student-in-university-moving-up-the-staircase-and.jpg?s=2048x2048&w=is&k=20&c=OiK95EE_NLWT0m_0GhXdb0h5T4mNPmiT5vdaGTEA4Vc=",
                                            "https://media.istockphoto.com/id/1587713852/photo/happy-female-student-positive-female-student-brazilian-or-hispanic-nationality-with-a.jpg?s=1024x1024&w=is&k=20&c=wO0ushlFkNSBVQGsuSMMGWo1BZrZrdM9wOlj5pagsKI=",
                                        ].map((src, i) => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-indigo-900 overflow-hidden">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-white/60 text-xs text-center lg:text-left">
                                        <span className="text-white font-bold">10,000+</span> {t('home.cta.learnersJoined', { defaultValue: 'learners joined this month' })}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Right - Stats Grid */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                className="grid grid-cols-2 gap-2 sm:gap-4 flex-1 mt-4 md:mt-0"
                            >
                                {[
                                    { icon: Brain, value: t('home.cta.stat1Value', { defaultValue: 'AI Powered' }), label: t('home.cta.stat1Label', { defaultValue: 'Smart Tutoring' }), color: 'from-cyan-400 to-blue-500', delay: 0 },
                                    { icon: Clock, value: t('home.cta.stat2Value', { defaultValue: '24/7' }), label: t('home.cta.stat2Label', { defaultValue: 'Always Available' }), color: 'from-purple-400 to-pink-500', delay: 0.1 },
                                    { icon: Target, value: t('home.cta.stat3Value', { defaultValue: '99%' }), label: t('home.cta.stat3Label', { defaultValue: 'Satisfaction Rate' }), color: 'from-amber-400 to-orange-500', delay: 0.2 },
                                    { icon: Shield, value: t('home.cta.stat4Value', { defaultValue: '100%' }), label: t('home.cta.stat4Label', { defaultValue: 'Secure & Private' }), color: 'from-emerald-400 to-teal-500', delay: 0.3 },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.5 + stat.delay }}
                                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                        className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-2.5 sm:p-4 text-center hover:bg-white/[0.12] transition-all duration-300 group/stat"
                                    >
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-3 shadow-lg group-hover/stat:scale-110 transition-transform duration-300`}>
                                            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <p className="text-sm md:text-lg font-bold text-white mb-0.5 whitespace-nowrap">{stat.value}</p>
                                        <p className="text-[9px] md:text-[11px] text-white/50 font-medium uppercase tracking-wider">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};


export default HomePage;
