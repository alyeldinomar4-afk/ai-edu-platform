import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Star, Code2, BarChart3, Palette, Megaphone, Camera, DollarSign, BookOpen, ArrowRight, Users, Award, Bot, Play, Pause, MessageCircle, Brain, Target, TrendingUp, Shield, Clock, GraduationCap, CheckCircle2, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';
import HeroSection from '../components/sections/HeroSection';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import CourseCard from '../components/features/course/CourseCard';
import { courses, categories, testimonials, instructors } from '../data/mockData';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils';

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
                        <div className="relative aspect-video bg-gradient-to-br from-[#0d0d1a] via-[#141428] to-[#0d0d1a] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-4 sm:inset-8 flex flex-col gap-2 opacity-50" dir="ltr">
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500"><span className="text-pink-400">import</span> <span className="text-cyan-400">React</span> <span className="text-pink-400">from</span> <span className="text-yellow-300">'react'</span>;</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500"><span className="text-pink-400">import</span> {'{'} <span className="text-cyan-400">useState</span>, <span className="text-cyan-400">useEffect</span> {'}'} <span className="text-pink-400">from</span> <span className="text-yellow-300">'react'</span>;</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 mt-2"><span className="text-pink-400">const</span> <span className="text-blue-400">useMemo</span> = (<span className="text-orange-400">factory</span>, <span className="text-orange-400">deps</span>) {'=> {'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4"><span className="text-green-400">{'// Memoize expensive computations'}</span></div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4"><span className="text-pink-400">const</span> <span className="text-cyan-400">ref</span> = <span className="text-blue-400">useRef</span>({'{ deps: undefined, value: undefined }'});</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4"><span className="text-purple-400">if</span> (!<span className="text-blue-400">shallowEqual</span>(<span className="text-cyan-400">ref</span>.current.deps, <span className="text-orange-400">deps</span>)) {'{'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-8"><span className="text-cyan-400">ref</span>.current = {'{'} <span className="text-orange-400">deps</span>, <span className="text-orange-400">value</span>: <span className="text-blue-400">factory</span>() {'}'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4">{'};'}</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500 ml-4"><span className="text-pink-400">return</span> <span className="text-cyan-400">ref</span>.current.value;</div>
                                <div className="text-[10px] sm:text-xs font-mono text-slate-500">{'}'}</div>
                            </div>

                            <AnimatePresence>
                                {isPaused && (
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="w-14 h-14 sm:w-16 sm:h-16 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
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

                            <div className={cn("absolute bottom-12 z-5", isAr ? "right-3 sm:right-4 text-right" : "left-3 sm:left-4 text-left")}>
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

                        <div ref={chatScrollRef} className="flex-1 px-3 py-3 sm:px-4 sm:py-4 space-y-3 overflow-y-auto scrollbar-hide min-h-[200px] lg:min-h-0">
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
    { icon: Brain, title: 'Watches Every Lecture', desc: 'AI follows along with the video content in real-time, tracking concepts and key moments.', color: 'from-violet-500 to-purple-600', glow: 'violet' },
    { icon: Pause, title: 'Explains on Pause', desc: 'Pause anytime and get instant, contextual explanations of what was just covered.', color: 'from-cyan-500 to-blue-600', glow: 'cyan' },
    { icon: Target, title: 'Marks Key Points', desc: 'Important concepts are automatically bookmarked so you never miss critical information.', color: 'from-amber-500 to-orange-600', glow: 'amber' },
    { icon: TrendingUp, title: 'Tracks Your Progress', desc: 'Personalized learning analytics help you understand your strengths and areas to improve.', color: 'from-emerald-500 to-teal-600', glow: 'emerald' },
];

const AnimatedFeatureShowcase = ({ t }) => {
    const [activeFeature, setActiveFeature] = useState(0);

    const glowColors = {
        violet: 'shadow-violet-500/30',
        cyan: 'shadow-cyan-500/30',
        amber: 'shadow-amber-500/30',
        emerald: 'shadow-emerald-500/30',
    };

    const localizedFeatures = FEATURES_DATA.map((f, i) => ({
        ...f,
        title: t(`home.howItWorks.featureTitle${i + 1}`, { defaultValue: f.title }),
        desc: t(`home.howItWorks.featureDesc${i + 1}`, { defaultValue: f.desc }),
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
        <div className="space-y-0 pb-24 overflow-x-hidden transition-colors duration-300">
            {/* Hero Section — Clean & Minimal */}
            <HeroSection getStartedPath={getStartedPath} />

            {/* Stats Section — Unified Style with Categories */}
            <section className="relative py-10 md:py-12 px-4 md:px-8 overflow-hidden">
                {/* Background match Categories in light, transparent in dark */}
                <div className="absolute inset-0 bg-[#F5F3FF] dark:bg-transparent transition-colors duration-500" />
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-0">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {[
                            { label: t('home.stats.learners'), subtitle: t('home.stats.learnersSub'), value: 50, suffix: 'k+' },
                            { label: t('home.stats.courses'), subtitle: t('home.stats.coursesSub'), value: 200, suffix: '+' },
                            { label: t('home.stats.instructors'), subtitle: t('home.stats.instructorsSub'), value: 50, suffix: '+' },
                            { label: t('home.stats.satisfaction'), subtitle: t('home.stats.satisfactionSub'), value: 99, suffix: '%' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeSlideUp}
                                className="relative group"
                            >
                                {/* Stat Card — Floating Square Look */}
                                <div className="flex flex-col items-center justify-center text-center h-full py-2 opacity-90 hover:opacity-100 transition-opacity duration-300">
                                    <div className="relative mb-2">
                                        <h3 className="text-2xl md:text-3xl font-alexandria font-black bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 bg-clip-text text-transparent selection:bg-primary/10">
                                            <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2.5} />
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

            {/* Categories Section — Premium Redesign */}
            <section className="relative py-16 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[#F5F3FF] dark:bg-slate-950 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 text-primary font-semibold tracking-wider uppercase text-xs mb-4"
                        >
                            <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                <Sparkles className="w-3.5 h-3.5" />
                            </motion.span>
                            {t('home.categories.badge')}
                        </motion.span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">{t('home.categories.title')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto text-base leading-relaxed">{t('home.categories.subtitle')}</p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-30px' }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
                    >
                        {categories.map((cat, idx) => {
                            const IconComponent = cat.icon && iconMap[cat.icon] ? iconMap[cat.icon] : null;
                            const isSpecial = idx % 3 === 0; // Simulate some trending categories
                            return (
                                <motion.div
                                    key={cat.id}
                                    variants={fadeScale}
                                    onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}
                                    whileHover={{
                                        y: -10,
                                        transition: { duration: 0.3, ease: 'easeOut' }
                                    }}
                                    className="group cursor-pointer relative"
                                >
                                    {/* Gradient border glow on hover */}
                                    <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />

                                    <div className="relative p-7 rounded-2xl bg-white dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-400 text-center overflow-hidden h-full flex flex-col items-center">
                                        {/* Special Badge (Trending/Popular) */}
                                        {isSpecial && (
                                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-purple-600 text-white text-[9px] font-black px-2.5 py-1 rounded-bl-xl rounded-tr-xl shadow-lg z-20 uppercase tracking-tighter transition-transform group-hover:scale-110">
                                                {idx % 6 === 0 ? t('home.categories.trending', { defaultValue: 'Trending' }) : t('home.categories.hot', { defaultValue: 'Popular' })}
                                            </div>
                                        )}

                                        {/* Subtle radial glow inside card on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-secondary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Icon Container with centered alignment */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                            className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative group-hover:shadow-xl transition-all duration-300",
                                                cat.bgColor || "bg-slate-50 dark:bg-slate-800/80"
                                            )}
                                        >
                                            {IconComponent ? (
                                                <IconComponent className={cn("w-7 h-7 transition-all duration-300 group-hover:scale-110", cat.color || "text-slate-600 dark:text-slate-400")} />
                                            ) : (
                                                <span className="text-2xl transition-all duration-300 group-hover:scale-110">{cat.icon || '📚'}</span>
                                            )}
                                        </motion.div>

                                        {/* Title with improved weight and spacing */}
                                        <h3 className="font-extrabold text-[15px] text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300 mb-2.5 relative z-10 leading-tight">
                                            {t(`courses.categories.${cat.name.charAt(0).toLowerCase() + cat.name.slice(1).replace(/\s+/g, '')}`)}
                                        </h3>

                                        {/* Course count pill (Centered and Styled) */}
                                        <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50/80 dark:bg-slate-800/60 px-3 py-1.5 rounded-full relative z-10 border border-slate-100 dark:border-slate-700/50">
                                            <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                            {cat.count} {t('home.categories.coursesCount')}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Featured Courses — Stagger Grid with Carousel Mobile */}
            <section className="bg-[#F5F3FF] dark:bg-slate-900/50 py-14 md:py-18 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-between items-end mb-12"
                    >
                        <div>
                            <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs mb-3 block">{t('home.featured.badge')}</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter leading-tight">
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
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-6 -mx-6 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:px-0 md:mx-0 md:snap-none md:overflow-visible"
                    >
                        {courses.slice(0, 4).map((course, idx) => (
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

            {/* AI Feature Highlight — Cinematic Entrance */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-visible">
                {/* Enhanced Neon Glow behind the content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-linear-to-r from-primary/20 via-purple-500/10 to-transparent blur-[140px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-[#050505] rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 md:p-20 overflow-hidden relative text-white border border-slate-800 shadow-[0_0_80px_-20px_rgba(138,43,226,0.25)] z-10"
                >
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
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
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">{t('home.aiHighlight.titleHighlight')}</span>
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
                                        <span className="relative z-10">{t('home.aiHighlight.btnTryDemo')}</span>
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
                            {/* Abstract UI representation of chat */}
                            <div className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-700 dark:border-slate-800 shadow-2xl relative z-20">
                                <div className="space-y-4">
                                    <div className="flex gap-3 sm:gap-4 items-start">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="bg-slate-700/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl rounded-tl-none text-slate-300 text-xs sm:text-sm flex-1 min-w-0">
                                            <p>{t('home.aiHighlight.chatUserQuery')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 sm:gap-4 items-start">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="bg-slate-700/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl rounded-tl-none text-slate-300 text-xs sm:text-sm flex-1 min-w-0">
                                            <p className="mb-2">{t('home.aiHighlight.chatAiResponse')}</p>
                                            <div className="bg-[#0a0a0a] rounded-xl p-3 sm:p-4 font-mono text-[10px] sm:text-xs text-slate-300 overflow-x-auto border border-white/5 shadow-inner">
                                                <span className="text-pink-400">const</span> <span className="text-cyan-400">memoizedValue</span> = <span className="text-purple-400">useMemo</span>(() <span className="text-pink-400">=&gt;</span> <span className="text-yellow-300">computeExpensiveValue</span>(a, b), [a, b]);
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative blurred circles behind */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-primary to-purple-600 blur-[80px] opacity-20 -z-10 rounded-full animate-pulse" />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ═══ How It Works — Animated Mockup Demo ═══ */}
            <section className="relative py-14 md:py-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-[#F5F3FF] dark:bg-slate-950 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14 md:mb-18"
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
                        className="text-center mt-14"
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


            {/* Top Instructors Section - Stagger with Alternating Slides */}
            <section className="relative py-14 md:py-18 overflow-hidden bg-[#F5F3FF] dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-slate-800/60 transition-colors duration-500">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[80px] opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 gap-6 text-center md:text-start p-8 rounded-3xl bg-[#F5F3FF] dark:bg-transparent border border-primary/5 dark:border-none"
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
                                {t('home.instructors.viewAll')} <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${document.documentElement.dir === 'rtl' ? 'mr-1.5 rotate-180 group-hover:-translate-x-1' : 'ml-1.5'}`} />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
                    >
                        {instructors.slice(0, 2).map((instructor, idx) => (
                            <motion.div
                                key={instructor.id}
                                variants={idx % 2 === 0 ? slideFromLeft : slideFromRight}
                                whileHover={{ y: -8, transition: { duration: 0.4 } }}
                                className="group relative rounded-[32px] p-[1px] bg-slate-200 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl dark:shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full bg-white dark:bg-[#121212] backdrop-blur-md rounded-[31px] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-start border-[0.5px] border-slate-100 dark:border-slate-700/40 group-hover:border-primary/20 transition-colors">

                                    {/* Avatar with Glow Ring */}
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-125" />
                                        <div className="relative p-1 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-full group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                                            <img src={instructor.avatar} alt={instructor.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-xl z-10" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-2 border border-slate-100 dark:border-slate-700 z-20 shadow-lg">
                                            <Award className="w-4 h-4 text-primary" />
                                        </div>
                                    </div>

                                    {/* Content Reveal on Hover */}
                                    <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start w-full">
                                        <div className="mb-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-0.5 group-hover:text-primary transition-colors">{instructor.name}</h3>
                                            <p className="text-primary dark:text-secondary font-bold text-[10px] uppercase tracking-widest">{instructor.role}</p>
                                        </div>

                                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 line-clamp-2 w-full leading-relaxed">
                                            {instructor.bio}
                                        </p>

                                        {/* Dynamic Stats Row */}
                                        <div className="flex items-center gap-4 mb-6 text-slate-500 dark:text-slate-400 text-xs font-bold w-full justify-center sm:justify-start">
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                <BookOpen className="w-4 h-4 text-primary/80" />
                                                <span>{instructor.coursesCount} Courses</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span>{instructor.rating} Rating</span>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto mt-auto">
                                            <Link to={`/instructor/user/${encodeURIComponent(instructor.name.replace(/\s+/g, '-').toLowerCase())}`}>
                                                <Button size="sm" className="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 hover:bg-primary text-white border-none shadow-lg hover:shadow-primary/30 transition-all duration-300 text-[11px] font-black uppercase tracking-wider px-7 py-3 rounded-xl">
                                                    {t('home.instructors.viewProfile')}
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
            <section className="bg-[#F5F3FF] dark:bg-transparent py-10 md:py-12 transition-colors duration-300">
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
                                        <img src={testimonial.avatar} alt={testimonial.name} className="relative w-12 h-12 rounded-full object-cover ring-2 ring-slate-50 dark:ring-slate-800 shadow-md" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white text-sm">{testimonial.name}</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/80">
                                            {t(`home.testimonials.roles.${testimonial.role.charAt(0).toLowerCase() + testimonial.role.slice(1).replace(/\s+/g, '')}`)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-5">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
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
                    <div className="relative z-10 py-10 md:py-14 px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-sm font-semibold mb-6"
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                    {t('home.cta.badge', { defaultValue: 'Start Your Journey' })}
                                </motion.div>
                                
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                                    {t('home.cta.title')}
                                </h2>
                                <p className="text-white/70 text-xs sm:text-sm mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                    {t('home.cta.subtitle')}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                                    <Link to={getStartedPath}>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                            <Button size="lg" variant="primary" className="bg-white text-indigo-900 hover:bg-slate-100 px-8 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-black/20 border-none flex items-center gap-2 relative overflow-hidden group/cta">
                                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/30 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
                                                <GraduationCap className="w-5 h-5 relative z-10" />
                                                <span className="relative z-10">{isAuthenticated ? t('home.cta.btnContinue', { defaultValue: 'Continue Learning' }) : t('home.cta.getStarted', { defaultValue: 'Get Started Free' })}</span>
                                                <ArrowRight className={cn("w-4 h-4 relative z-10 transition-transform group-hover/cta:translate-x-1", isAr && "rotate-180 group-hover/cta:-translate-x-1")} />
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <Link to="/courses">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold transition-all backdrop-blur-sm">
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
                                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80",
                                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80",
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
                                className="grid grid-cols-2 gap-3 sm:gap-4 flex-1"
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
                                        className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/[0.12] transition-all duration-300 group/stat"
                                    >
                                        <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover/stat:scale-110 transition-transform duration-300`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-lg font-bold text-white mb-0.5 whitespace-nowrap">{stat.value}</p>
                                        <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider">{stat.label}</p>
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
