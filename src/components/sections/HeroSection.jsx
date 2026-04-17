import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Zap, Star, BookOpen, X, ThumbsUp, Heart, Lightbulb, Telescope, Calculator, MessagesSquare, Users } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { cn } from '../../utils';

// ─── DemoModal ─────────────────────────────────────────────────────────────────
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.button
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[100] w-10 h-10 rounded-full bg-black/40 sm:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
                <X className="w-5 h-5" />
            </motion.button>
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="absolute top-6 left-6 z-50 hidden sm:flex items-center gap-3"
            >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">Nexora AI Demo</span>
                </div>
            </motion.div>
            <motion.div
                ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.7, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 30 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative group cursor-pointer w-full max-w-[560px]"
            >
                <div className="relative z-10 rounded-3xl overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative bg-[#0c1224]/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-700/30">
                        <div className="flex items-center justify-between mb-5">
                            <div className="hidden sm:flex items-center gap-2">
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
                        <div className="space-y-3 mb-5">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-900/15 rounded-lg border border-green-800/30 w-fit">
                                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=40&q=80" alt="Student" className="w-5 h-5 rounded-full object-cover ring-2 ring-green-400" />
                                <span className="text-[11px] font-medium text-green-400">Ahmed {t('home.hero.isLearning', { defaultValue: "is learning right now" })}</span>
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex gap-3 items-start">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/30">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] border border-slate-700/40">
                                        <p className="text-[10px] font-semibold text-indigo-400 mb-1">Nexora AI</p>
                                        
                                        {/* Typing animation indicator */}
                                        <motion.div animate={{ opacity: [1, 1, 0], display: ['flex', 'flex', 'none'] }} transition={{ duration: 1.5, times: [0, 0.8, 1] }} className="flex gap-1 py-1 h-5 items-center">
                                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                        </motion.div>
                                        
                                        {/* Actual AI Message */}
                                        <motion.p initial={{ opacity: 0, display: 'none' }} animate={{ opacity: 1, display: 'block' }} transition={{ delay: 1.4 }} className="text-[13px] text-slate-300 leading-relaxed">
                                            {t('home.hero.aiMessage', { defaultValue: "Great question! 👍 Neural networks learn through backpropagation — they make predictions, measure errors, and adjust. Think of it like practicing until you get better! 🧠" })}
                                        </motion.p>
                                    </div>
                                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, type: "spring" }} className="flex items-center gap-1.5 ml-2 mt-1">
                                        <span className="text-[11px] bg-slate-800/80 px-2 py-1 rounded-full border border-slate-700/50 flex items-center gap-1 shadow-sm"><ThumbsUp className="w-3 h-3 text-yellow-500" /> 2</span>
                                        <span className="text-[11px] bg-slate-800/80 px-1.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1 shadow-sm"><Heart className="w-3 h-3 text-red-500" /></span>
                                        <span className="text-[11px] bg-slate-800/80 px-1.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1 shadow-sm"><Lightbulb className="w-3 h-3 text-yellow-400" /></span>
                                    </motion.div>
                                </div>
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="flex gap-3 items-start justify-end">
                                <div className="flex flex-col items-end gap-1">
                                    <div className="bg-indigo-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-lg shadow-indigo-500/20">
                                        <p className="text-[10px] font-semibold text-indigo-200 mb-1">Ahmed</p>
                                        <p className="text-[13px] text-white leading-relaxed">{t('home.hero.userMessage', { defaultValue: "Can you show me a code example? 💻" })}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-600 mr-1">{t('home.hero.justNow', { defaultValue: "Just now" })}</span>
                                </div>
                                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80" alt="Ahmed" className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-indigo-400/40 shadow-md" />
                            </motion.div>

                            {/* Ongoing AI Typing (The 3rd message) */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="flex gap-3 items-end pt-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                                    <Zap className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex gap-1.5 py-2.5 px-4 bg-slate-800/50 rounded-3xl rounded-bl-sm border border-slate-700/30 items-center">
                                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Prompt Ideas */}
                        <div className="pt-3 border-t border-slate-700/50 mt-4 flex flex-wrap gap-2">
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors shadow-sm">
                                <Telescope className="w-3.5 h-3.5 text-indigo-400" />
                                {t('home.hero.promptIdea1', { defaultValue: "Explain quantum computing" })}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 cursor-pointer transition-colors shadow-sm">
                                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                                {t('home.hero.promptIdea2', { defaultValue: "Help me with Calculus" })}
                            </div>
                        </div>

                        {/* Bottom Stats Grid */}
                        <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-slate-800/30 border border-slate-700/20">
                                <MessagesSquare className="w-4 h-4 text-indigo-400 mb-1" />
                                <span className="text-[10px] text-slate-400">50K+ Chats</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-slate-800/30 border border-slate-700/20">
                                <Star className="w-4 h-4 text-yellow-400 mb-1" />
                                <span className="text-[10px] text-slate-400">4.9 Rating</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl bg-slate-800/30 border border-slate-700/20">
                                <Users className="w-4 h-4 text-emerald-400 mb-1" />
                                <span className="text-[10px] text-slate-400">20K Students</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Cards Data & Component ──────────────────────────────────────────────────
const CARDS_DATA = [
    { src: '/floating_globe.png',     labelKey: 'home.hero2.card1', fallback: 'Global Reach',   glow: 'rgba(99,102,241,0.55)',  stackRotate: -10, stackX: -6,  stackY:  0  },
    { src: '/student_phone.png',      labelKey: 'home.hero2.card2', fallback: 'AI Learning',    glow: 'rgba(168,85,247,0.5)',   stackRotate:  -4, stackX: -2,  stackY:  6  },
    { src: '/ai_brain.png',           labelKey: 'home.hero2.card3', fallback: 'Smart AI',       glow: 'rgba(34,211,238,0.5)',   stackRotate:   4, stackX:  2,  stackY: 12  },
    { src: '/books_graduation.png',   labelKey: 'home.hero2.card4', fallback: '200+ Courses',   glow: 'rgba(251,191,36,0.45)',  stackRotate:  10, stackX:  6,  stackY: 18  },
];

const DSK_X = [-32, -10.6, 10.6, 32];
const DSK_Y = '20vh'; // Moved down from 8vh so it doesn't overlap text

const MOB_X = [-25, 25, -25, 25];
const MOB_Y = ['4vh', '4vh', '30vh', '30vh']; // Moved entire 2x2 grid down

function AnimCard({ card, idx, scrollYProgress, isMobile, t, isAr }) {
    // Mirror coordinates if Arabic (RTL) mode
    const numX = isMobile ? MOB_X[idx] : DSK_X[idx];
    const targetX = `${isAr ? -numX : numX}vw`;
    const targetY = isMobile ? MOB_Y[idx] : DSK_Y;
    
    // Stack is positioned at the bottom edge of the Hero Image
    // In RTL, the image sits on the left side of the screen, so stackX must be negative
    const deskStartX = isAr ? -10 : 10;
    const startX = isMobile ? '0vw' : `${deskStartX}vw`;
    const startY = isMobile ? '-75vh' : '-80vh';

    // Cards should rotate the opposite way in RTL to look matched to the mirror
    const finalRotate = isAr ? -card.stackRotate : card.stackRotate;

    const x = useTransform(scrollYProgress, [0.05, 0.9], [startX, targetX], { clamp: true });
    const y = useTransform(scrollYProgress, [0.05, 0.9], [startY, targetY], { clamp: true });
    const rotate = useTransform(scrollYProgress, [0.05, 0.7], [finalRotate, 0], { clamp: true });
    const scale = useTransform(scrollYProgress, [0, 0.8], [isMobile ? 0.8 : 0.85, 1], { clamp: true });
    
    const lblOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
    const lblY = useTransform(scrollYProgress, [0.75, 0.95], [10, 0]);

    return (
        <motion.div
            style={{
                x, y, rotate, scale,
                position: 'absolute',
                zIndex: CARDS_DATA.length - idx,
            }}
        >
            <div className="flex flex-col items-center gap-3">
                <div
                    className="w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 xl:w-56 xl:h-56 rounded-3xl overflow-hidden ring-4 ring-slate-200/60 dark:ring-white/10"
                    style={{ boxShadow: `0 10px 45px ${card.glow}, 0 4px 15px rgba(0,0,0,0.4)` }}
                >
                    <img src={card.src} alt={card.fallback} className="w-full h-full object-cover" />
                </div>
                <motion.p
                    style={{ opacity: lblOpacity, y: lblY }}
                    className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-wide text-center bg-white/90 dark:bg-black/40 border border-slate-200/60 dark:border-transparent px-4 py-1.5 rounded-full backdrop-blur-sm"
                >
                    {t(card.labelKey, { defaultValue: card.fallback })}
                </motion.p>
            </div>
        </motion.div>
    );
}

// ─── HeroSection Main ────────────────────────────────────────────────────────
const HeroSection = ({ getStartedPath }) => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const [showDemo, setShowDemo] = useState(false);
    
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Scroll ref for Hero 2 (the cards section)
    const hero2Ref = useRef(null);
    const { scrollYProgress } = useScroll({ 
        target: hero2Ref, 
        offset: ['start end', 'center center'] 
    });

    const imageRef = useRef(null);
    const mx = useMotionValue(0), my = useMotionValue(0);
    const mxSpring = useSpring(mx, { stiffness: 60, damping: 30 });
    const mySpring = useSpring(my, { stiffness: 60, damping: 30 });
    const rotateX  = useTransform(mySpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY  = useTransform(mxSpring, [-0.5, 0.5], ["-3deg", "3deg"]);
    
    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { mx.set(0); my.set(0); };

    return (
        <div className="relative overflow-x-clip bg-slate-50 dark:bg-[#0B1120]">
            
            {/* ─── NATIVE SCROLL SECTION 1: HERO ─── */}
            <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-visible">
                {/* Background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="orb orb-primary w-[600px] h-[600px] -top-32 -left-32 opacity-30 dark:opacity-40" />
                    <div className="orb orb-purple w-[500px] h-[500px] -top-20 right-0 opacity-25 dark:opacity-35" />
                    <div className="orb orb-blue w-[400px] h-[400px] bottom-0 left-1/3 opacity-20 dark:opacity-30" />
                    <div className="absolute inset-0 opacity-0 dark:opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left — Text */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/20 dark:border-slate-700 text-primary font-semibold text-sm mb-6">
                                <Sparkles className="w-4 h-4" />
                                {t('home.heroBadge')}
                            </div>
                            <h1 className={`text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight dark:[text-shadow:_0_0_40px_rgba(255,255,255,0.12),_0_2px_10px_rgba(0,0,0,0.4)] ${isAr ? 'leading-[1.4]' : ''}`}>
                                {t('home.heroTitleMain')}
                                {isAr ? ' ' : <br />}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
                                    {t('home.heroTitleHighlight')}
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
                                {t('home.heroSubtitle')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link to="/courses">
                                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto flex items-center justify-center gap-2 relative overflow-hidden group/btn">
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                            <span className="relative z-10 flex items-center gap-2">
                                                {t('home.btnStartLearning')}
                                                <ArrowRight className={cn("w-5 h-5 transition-transform group-hover/btn:translate-x-1", isAr && "rotate-180 group-hover/btn:-translate-x-1")} />
                                            </span>
                                        </Button>
                                    </motion.div>
                                </Link>
                                <motion.div onClick={() => setShowDemo(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="cursor-pointer relative group/demo">
                                    <span className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover/demo:opacity-60 blur-[3px] transition-opacity duration-500 animate-pulse" />
                                    <Button variant="outline" size="lg" className="relative h-14 px-8 text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-900 dark:border-slate-700 dark:text-slate-200 w-full sm:w-auto flex items-center justify-center gap-2 pointer-events-none overflow-hidden">
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover/demo:translate-x-full transition-transform duration-700" />
                                        <span className="relative z-10"><Play className="w-5 h-5 fill-current inline-block mr-2" /> {t('home.btnWatchDemo')}</span>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right — 3D Hero image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center justify-center relative mt-6 lg:mt-0 w-full"
                        >
                            <div
                                className="relative w-full max-w-[620px] h-[340px] sm:h-[420px] lg:h-[540px] flex items-center justify-center mx-auto lg:ml-auto"
                                ref={imageRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: "1200px" }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-[100px] rounded-full animate-pulse" />
                                <motion.div
                                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                                    className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-500/40 p-1 bg-gradient-to-br from-white/20 via-white/5 to-white/10 backdrop-blur-md"
                                >
                                    <div className="w-full h-full rounded-[36px] overflow-hidden bg-[#0c1224] relative">
                                        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                        <img
                                            src="/premium_hero_nexora_subtle_neon_1775433853183.png"
                                            alt="Nexora AI"
                                            className="w-full h-full object-cover rounded-[36px] transition-all duration-700"
                                            style={{ filter: 'brightness(1.1) saturate(1.1) contrast(1.05)' }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── NATIVE SCROLL SECTION 2: FEATURES CARDS ─── */}
            <section ref={hero2Ref} className="relative min-h-screen flex flex-col items-center justify-start pt-20 lg:pt-24 pb-24 overflow-visible bg-slate-50 dark:bg-[#060B14] border-t border-slate-200 dark:border-slate-800/40 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] z-10">
                
                {/* Fixed Premium Background for Section 2 */}
                <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-[#0c1224]/80 to-[#0B1120] pointer-events-none" />
                
                <div className="text-center relative z-10 px-4 w-full mb-10 lg:mb-0">
                    <span className="text-primary font-extrabold tracking-[0.2em] uppercase text-[10px] md:text-xs bg-primary/10 border border-primary/20 px-5 py-2 rounded-full inline-block mb-6 shadow-lg shadow-primary/20">
                        {t('home.hero2.badge', { defaultValue: 'Platform Features' })}
                    </span>
                    <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight ${isAr ? 'leading-[1.4]' : ''}`}>
                        {t('home.hero2.title', { defaultValue: 'Why Choose Nexora AI?' })}
                    </h2>
                    <p className={`text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-6 text-sm md:text-base leading-relaxed ${isAr ? 'leading-[1.8]' : ''}`}>
                        {t('home.hero2.subtitle', { defaultValue: 'Experience the next generation of learning with powerful AI tools designed to enhance your educational journey, seamlessly combining cutting-edge tech with world-class content.' })}
                    </p>
                </div>

                {/* Animated Cards Container - Anchored seamlessly spanning Sec1 & Sec2  */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    {CARDS_DATA.map((card, idx) => (
                        <AnimCard key={idx} card={card} idx={idx} scrollYProgress={scrollYProgress} isMobile={isMobile} t={t} isAr={isAr} />
                    ))}
                </div>

            </section>

            {/* Demo Modal */}
            <AnimatePresence>
                {showDemo && <DemoModal onClose={() => setShowDemo(false)} t={t} />}
            </AnimatePresence>
        </div>
    );
};

export default HeroSection;
