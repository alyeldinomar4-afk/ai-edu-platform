import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Zap, Star, BookOpen, Award, X, Crown } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { cn } from '../../utils';

/**
 * DemoModal — Premium video-like popup showing the interactive AI Dashboard.
 * Contains the old HeroImageTilt animation with chat, typing, reactions, floating badges.
 */
const DemoModal = ({ onClose, t }) => {
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    const gridLines = Array.from({ length: 6 }, (_, i) => i);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={onClose}
                className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
                <X className="w-5 h-5" />
            </motion.button>

            {/* "Now Playing" label */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 left-6 z-50 flex items-center gap-3"
            >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">Nexora AI Demo</span>
                </div>
            </motion.div>

            {/* The Interactive Dashboard Card */}
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.7, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 30 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative group cursor-pointer w-full max-w-[560px]"
            >
                {/* Main Glass Card */}
                <div className="relative z-10 rounded-3xl overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
                    {/* Animated border glow */}
                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Inner container */}
                    <div className="relative bg-[#0c1224]/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/30">
                        {/* Window Chrome */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/50">
                                <Zap className="w-3.5 h-3.5 text-purple-500" />
                                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Nexora AI</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-[10px] font-semibold text-green-500">LIVE</span>
                            </div>
                        </div>

                        {/* Neural Grid */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none opacity-[0.06]">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                {gridLines.map((i) => (
                                    <React.Fragment key={`grid-${i}`}>
                                        <line x1="0" y1={`${(i + 1) * 15}%`} x2="100%" y2={`${(i + 1) * 15}%`} stroke="currentColor" strokeWidth="0.5" className="text-indigo-500" />
                                        <line x1={`${(i + 1) * 15}%`} y1="0" x2={`${(i + 1) * 15}%`} y2="100%" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500" />
                                    </React.Fragment>
                                ))}
                            </svg>
                        </div>

                        {/* Chat */}
                        <div className="space-y-3 mb-5">
                            {/* Student Active */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-900/15 rounded-lg border border-green-800/30 w-fit">
                                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=40&q=80" alt="Student" className="w-5 h-5 rounded-full object-cover ring-2 ring-green-400" />
                                <span className="text-[11px] font-medium text-green-400">Ahmed {t('home.hero.isLearning', { defaultValue: "is learning right now" })}</span>
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            </motion.div>

                            {/* AI Message */}
                            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex gap-3 items-start">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/30">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] border border-slate-700/40">
                                        <p className="text-[10px] font-semibold text-indigo-400 mb-1">Nexora AI</p>
                                        <p className="text-[13px] text-slate-300 leading-relaxed">
                                            {t('home.hero.aiMessage', { defaultValue: "Great question! 👍 Neural networks learn through backpropagation — they make predictions, measure errors, and adjust. Think of it like practicing until you get better! 🧠" })}
                                        </p>
                                    </div>
                                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, type: "spring", stiffness: 300 }} className="flex items-center gap-1 ml-2">
                                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 cursor-default hover:scale-110 transition-transform">👍 2</span>
                                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 cursor-default hover:scale-110 transition-transform">🤯</span>
                                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 cursor-default hover:scale-110 transition-transform">❤️</span>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* User Message */}
                            <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="flex gap-3 items-start justify-end">
                                <div className="flex flex-col items-end gap-1">
                                    <div className="bg-indigo-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-lg shadow-indigo-500/20">
                                        <p className="text-[10px] font-semibold text-indigo-200 mb-1">Ahmed</p>
                                        <p className="text-[13px] text-white leading-relaxed">
                                            {t('home.hero.userMessage', { defaultValue: "Can you show me a code example?" })} 💻
                                        </p>
                                    </div>
                                    <span className="text-[9px] text-slate-600 mr-1">{t('home.hero.justNow', { defaultValue: "Just now" })}</span>
                                </div>
                                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80" alt="Ahmed" className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-indigo-400/40 shadow-md" />
                            </motion.div>

                            {/* Typing */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-700/40 flex gap-1.5 items-center">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                                </div>
                            </motion.div>

                            {/* Suggestion Pills */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2.2, duration: 0.4 }}
                                className="flex flex-wrap gap-2 pt-1"
                            >
                                {[
                                    { text: "Show me code 💻", delay: 0 },
                                    { text: "Explain more 📖", delay: 0.1 },
                                    { text: "Quiz me 🎯", delay: 0.2 },
                                ].map((pill, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 2.2 + pill.delay }}
                                        className="text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3.5 py-1.5 rounded-full hover:bg-indigo-500/20 transition-colors cursor-pointer"
                                    >
                                        {pill.text}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: BookOpen, label: "Courses", value: "200+", color: "from-indigo-500 to-blue-500" },
                                { icon: Zap, label: "AI Chats", value: "50k+", color: "from-purple-500 to-pink-500" },
                                { icon: Star, label: "Rating", value: "4.9★", color: "from-amber-500 to-orange-500" },
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 + i * 0.15 }}
                                    className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30 text-center hover:scale-105 transition-transform duration-300">
                                    <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-lg`}>
                                        <stat.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-base font-bold text-white">{stat.value}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Badge — Top Right */}
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
                    className="absolute -top-4 -right-4 md:-right-8 bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-700/60 flex items-center gap-3 animate-float pointer-events-none z-20"
                    style={{ transform: 'translateZ(60px)', animationDelay: '0.5s' }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-500 font-medium">{t('home.hero.courseCompleted', { defaultValue: "Course Completed" })}</p>
                        <p className="text-sm font-bold text-white">{t('home.hero.pythonMastery', { defaultValue: "Python Mastery" })}</p>
                    </div>
                </motion.div>

                {/* Floating Badge — Bottom Left */}
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
                    className="absolute -bottom-3 -left-3 md:-left-6 bg-slate-800 px-4 py-3 rounded-xl shadow-xl border border-slate-700/60 flex items-center gap-3 animate-float pointer-events-none z-20"
                    style={{ transform: 'translateZ(50px)', animationDelay: '1.2s' }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{t('home.hero.rating', { defaultValue: "4.9 out of 5" })}</p>
                        <p className="text-[11px] text-slate-500">AI-Powered</p>
                    </div>
                </motion.div>

                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-cyan-400/20 blur-[60px] -z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
            </motion.div>
        </motion.div>
    );
};


const HeroSection = ({ getStartedPath }) => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const [showDemo, setShowDemo] = useState(false);

    // Mouse tilt effect for the hero image
    const imageRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 60, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 60, damping: 30 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <>
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[linear-gradient(135deg,#F5F3FF_0%,#EDE9FE_50%,#DDD6FE_100%)] dark:bg-none dark:bg-[#090d1a] transition-colors duration-500">
                {/* Glowing Orbs Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="orb orb-primary w-[600px] h-[600px] -top-32 -left-32 opacity-60 dark:opacity-80" />
                    <div className="orb orb-purple w-[500px] h-[500px] -top-20 right-0 opacity-50 dark:opacity-70" />
                    <div className="orb orb-blue w-[400px] h-[400px] bottom-0 left-1/3 opacity-40 dark:opacity-60" />
                    <div
                        className="absolute inset-0 opacity-0 dark:opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left — Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/20 dark:border-slate-700 text-primary font-semibold text-sm mb-6">
                                <Sparkles className="w-4 h-4" />
                                {t('home.heroBadge')}
                            </div>

                            <h1
                                className={`text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight dark:[text-shadow:_0_0_40px_rgba(255,255,255,0.12),_0_2px_10px_rgba(0,0,0,0.4)] ${isAr ? 'leading-[1.4]' : ''}`}
                            >
                                {t('home.heroTitleMain')}
                                {isAr ? ' ' : <br />}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
                                    {t('home.heroTitleHighlight')}
                                </span>
                                {t('home.heroTitleSuffix') && (
                                    <>
                                        <br />
                                        {t('home.heroTitleSuffix')}
                                    </>
                                )}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
                                {t('home.heroSubtitle').split('Nexora AI')[0]}
                                <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Nexora AI</span>
                                {t('home.heroSubtitle').split('Nexora AI')[1]}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link to="/courses">
                                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto flex items-center justify-center gap-2 relative overflow-hidden group/btn">
                                            {/* Shine sweep */}
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                            <span className="relative z-10 flex items-center gap-2">
                                                {t('home.btnStartLearning')}
                                                <ArrowRight className={cn("w-5 h-5 transition-transform group-hover/btn:translate-x-1", isAr && "rotate-180 group-hover/btn:-translate-x-1")} />
                                            </span>
                                        </Button>
                                    </motion.div>
                                </Link>
                                <motion.button
                                    onClick={() => setShowDemo(true)}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="cursor-pointer relative group/demo"
                                >
                                    {/* Animated glow ring */}
                                    <span className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover/demo:opacity-60 blur-[3px] transition-opacity duration-500 animate-pulse" />
                                    <Button variant="outline" size="lg" className="relative h-14 px-8 text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-900 dark:border-slate-700 dark:text-slate-200 w-full sm:w-auto flex items-center justify-center gap-2 pointer-events-none overflow-hidden">
                                        {/* Shine sweep */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/demo:translate-x-full transition-transform duration-700" />
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            className="relative z-10"
                                        >
                                            <Play className="w-5 h-5 fill-current" />
                                        </motion.span>
                                        <span className="relative z-10">{t('home.btnWatchDemo')}</span>
                                    </Button>
                                </motion.button>
                            </div>

                            {/* Social Proof */}
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex -space-x-3">
                                    {[
                                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                    ].map(((src, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                            <img src={src} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    )))}
                                </div>
                                <p>{t('home.trustedBy')} <span className="text-slate-900 dark:text-white font-bold">10,000+</span> {t('home.students')}</p>
                            </div>
                        </motion.div>

                        {/* Right — 3D Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="hidden lg:flex items-center justify-center relative"
                        >
                            <div 
                                className="relative w-full max-w-[620px] h-[520px] flex items-center justify-center mx-auto lg:ml-auto"
                                ref={imageRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{ perspective: "1200px" }}
                            >
                                {/* Ambient Glow Behind Image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-cyan-500/30 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />

                                {/* The Floating Image Frame */}
                                <motion.div
                                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                                    className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-500/40 p-1 bg-gradient-to-br from-white/20 via-white/5 to-white/10 backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_0_80px_rgba(99,102,241,0.4)]"
                                >
                                    <div className="w-full h-full rounded-[36px] overflow-hidden bg-[#0c1224] relative group">
                                        {/* Fallback pattern while image loads or if missing */}
                                        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                        
                                        {/* The Generated Image */}
                                        <img 
                                            src="/cute_ai_group.png" 
                                            alt="Premium AI Companion with University Students" 
                                            className="w-full h-full object-cover rounded-[36px] group-hover:scale-105 transition-all duration-700" 
                                            style={{ filter: 'brightness(1.4) saturate(1.25)' }}
                                        />
                                        
                                        {/* Glossy Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
                                    </div>
                                </motion.div>

                                {/* Orbiting Particles (Premium Style) */}
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute inset-0 pointer-events-none z-20">
                                    <div className="absolute top-[10%] left-[20%] w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                                </motion.div>
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-4 pointer-events-none z-20">
                                    <div className="absolute bottom-[10%] right-[15%] w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
                                </motion.div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 pointer-events-none z-20">
                                    <div className="absolute top-[50%] -right-4 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
                                </motion.div>

                                {/* Floating Tag 1: Top Right */}
                                <motion.div 
                                    initial={{ opacity: 0, x: isAr ? -20 : 20, y: 0 }} 
                                    animate={{ opacity: 1, x: 0, y: [0, -10, 0] }} 
                                    transition={{ 
                                        opacity: { delay: 1, duration: 0.5 },
                                        x: { delay: 1, duration: 0.5 },
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } 
                                    }}
                                    className={`absolute ${isAr ? '-left-6' : '-right-6'} top-[15%] bg-white/90 dark:bg-[#0f1629]/90 backdrop-blur-xl border border-white dark:border-slate-700/40 px-4 py-2.5 rounded-2xl shadow-2xl shadow-purple-500/10 z-30 flex items-center gap-2.5`}
                                    style={{ transform: 'translateZ(40px)' }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">{t('home.hero.aiFeatures', { defaultValue: 'AI Features' })}</p>
                                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">{t('home.hero.smartLearning', { defaultValue: 'Smart Learning' })}</p>
                                    </div>
                                </motion.div>

                                {/* Floating Tag 2: Bottom Left (Simple Rating Badge like the photo) */}
                                <motion.div 
                                    initial={{ opacity: 0, x: isAr ? 20 : -20, scale: 0.8 }} 
                                    animate={{ opacity: 1, x: 0, scale: 1, y: [0, -8, 0] }} 
                                    transition={{ 
                                        opacity: { delay: 1.2, duration: 0.5 },
                                        x: { delay: 1.2, duration: 0.5 },
                                        scale: { delay: 1.2, duration: 0.5 },
                                        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 } 
                                    }}
                                    className={`absolute ${isAr ? '-right-4' : '-left-4'} bottom-12 bg-white/90 dark:bg-[#1a1f3d]/95 backdrop-blur-xl border border-white dark:border-slate-700/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3.5 z-30`}
                                    style={{ transform: 'translateZ(60px)' }}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-[#2a271d] border border-yellow-300 dark:border-yellow-500/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                                        <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 dark:text-white tracking-wide">{t('home.hero.ratingScore', { defaultValue: '4.9/5 Rating' })}</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Demo Modal */}
            <AnimatePresence>
                {showDemo && <DemoModal onClose={() => setShowDemo(false)} t={t} />}
            </AnimatePresence>
        </>
    );
};

export default HeroSection;
