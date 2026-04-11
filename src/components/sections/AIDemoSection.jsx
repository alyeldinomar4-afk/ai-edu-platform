import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AIDemoSection = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);

    // Sequenced animation steps
    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 400),   // Student active
            setTimeout(() => setStep(2), 900),   // User message appears
            setTimeout(() => setStep(3), 1500),  // AI typing dots
            setTimeout(() => setStep(4), 2400),  // AI responds
            setTimeout(() => setStep(5), 3300),  // Reaction appears
            setTimeout(() => setStep(6), 3800),  // Suggestion pills
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <section className="py-24 bg-white dark:bg-[#060a14] transition-colors duration-500 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="orb orb-purple w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-4">
                        <Zap className="w-4 h-4" />
                        {t('home.aiDemo.badge', { defaultValue: "Live AI Demo" })}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('home.aiDemo.title', { defaultValue: "See AI in Action" })}
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        {t('home.aiDemo.subtitle', { defaultValue: "Watch how Nexora AI tutors students in real-time with personalized, intelligent explanations." })}
                    </p>
                </motion.div>

                {/* AI Chat Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative max-w-2xl mx-auto"
                >
                    {/* Glow behind */}
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-cyan-400/15 blur-[50px] dark:opacity-80 opacity-50" />

                    {/* Card */}
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1224] shadow-xl dark:shadow-2xl dark:shadow-indigo-500/5 overflow-hidden">
                        {/* Window Chrome */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#0a0f1e]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                                <Zap className="w-3.5 h-3.5 text-purple-500" />
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Nexora AI Tutor</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-[10px] font-semibold text-green-500">LIVE</span>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="p-6 space-y-5 min-h-[380px]">
                            {/* Student Active */}
                            {step >= 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/20 w-fit"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=40&q=80"
                                        alt="Student"
                                        className="w-5 h-5 rounded-full object-cover ring-2 ring-green-400"
                                    />
                                    <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
                                        Ahmed {t('home.aiDemo.isLearning', { defaultValue: "is learning right now" })}
                                    </span>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                </motion.div>
                            )}

                            {/* User Message */}
                            {step >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex gap-3 items-start justify-end"
                                >
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="bg-indigo-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg shadow-indigo-500/15">
                                            <p className="text-[10px] font-semibold text-indigo-200 mb-1">Ahmed</p>
                                            <p className="text-[14px] text-white leading-relaxed">
                                                {t('home.aiDemo.userMsg', { defaultValue: "How do neural networks actually learn? 🤔" })}
                                            </p>
                                        </div>
                                        <span className="text-[9px] text-slate-400 dark:text-slate-600 mr-1">
                                            {t('home.aiDemo.justNow', { defaultValue: "Just now" })}
                                        </span>
                                    </div>
                                    <img
                                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80"
                                        alt="Ahmed"
                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-indigo-400/40 shadow-md"
                                    />
                                </motion.div>
                            )}

                            {/* AI Typing indicator */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 items-start"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/20">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl rounded-tl-sm px-5 py-3.5 border border-slate-100 dark:border-slate-700/40 flex gap-1.5 items-center">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                                    </div>
                                </motion.div>
                            )}

                            {/* AI Response */}
                            {step >= 4 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex gap-3 items-start"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/20">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col gap-2 max-w-[85%]">
                                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl rounded-tl-sm px-5 py-4 border border-slate-100 dark:border-slate-700/40">
                                            <p className="text-[10px] font-semibold text-indigo-500 mb-1.5">Nexora AI</p>
                                            <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {t('home.aiDemo.aiMsg', { defaultValue: "Great question, Ahmed! 👍 Let me explain it simply..." })}
                                            </p>
                                            <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                                                {t('home.aiDemo.aiMsg2', { defaultValue: "Neural networks learn through a process called backpropagation. Think of it like this: the network makes a prediction, checks how wrong it was, then adjusts its internal weights to be less wrong next time. Over thousands of iterations, it gets really good! 🧠✨" })}
                                            </p>
                                        </div>

                                        {/* Reactions */}
                                        {step >= 5 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="flex items-center gap-1.5 ml-2"
                                            >
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 cursor-default hover:scale-110 transition-transform">👍 2</span>
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 cursor-default hover:scale-110 transition-transform">🤯 1</span>
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 cursor-default hover:scale-110 transition-transform">❤️</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Suggestion Pills */}
                            {step >= 6 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-wrap gap-2 pt-2"
                                >
                                    {[
                                        t('home.aiDemo.pill1', { defaultValue: "Show me code 💻" }),
                                        t('home.aiDemo.pill2', { defaultValue: "Explain more 📖" }),
                                        t('home.aiDemo.pill3', { defaultValue: "Quiz me 🎯" }),
                                    ].map((pill, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 px-4 py-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer"
                                        >
                                            {pill}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AIDemoSection;
