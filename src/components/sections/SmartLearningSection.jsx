import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Brain, Code2, PenTool, Database, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SmartLearningSection = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    return (
        <section className="relative w-full py-24 overflow-hidden bg-slate-50 dark:bg-[#060B14]">

            {/* Animated Background Mesh & Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-indigo-50/50 to-slate-50 dark:from-[#0a0f1c] dark:via-[#0d142b] dark:to-[#0a0f1c] opacity-90" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[120px]" />
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center text-center">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full text-center mb-16 relative z-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        {isAr ? 'تعليم الجيل القادم' : 'Next-Generation Education'}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 [text-shadow:_0_0_30px_rgba(255,255,255,0.1)]">
                        {isAr ? 'مسارات تعلم ' : 'Intelligent '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400">
                            {isAr ? 'ذكية' : 'Learning Paths'}
                        </span>
                    </h2>
                    <p className={`text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto ${isAr ? 'leading-relaxed font-cairo' : ''}`}>
                        {isAr 
                            ? 'جرب منهجاً متكيفاً يتطور مع مهاراتك. محرك الذكاء الاصطناعي الخاص بنا يختار لك المسار المثالي لاحتراف تكنولوجيا المستقبل.' 
                            : 'Experience an adaptive curriculum that evolves with your skills. Our AI engine curates the perfect roadmap to master the technologies of tomorrow.'}
                    </p>
                </motion.div>

                {/* Center Core (AI Sphere) & Floating Cards */}
                <div className="relative w-full max-w-4xl mx-auto h-[450px] sm:h-[500px] mb-8 flex items-center justify-center">
                    
                    {/* Center AI Core (Globe with Orbits) */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-20"
                    >
                        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-indigo-500/20 dark:border-indigo-500/40 bg-white/40 dark:bg-indigo-950/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.15)] dark:shadow-[0_0_80px_rgba(79,70,229,0.4)]">
                            
                            {/* SVG Wireframe Globe */}
                            <svg className="absolute inset-0 w-full h-full text-indigo-500/30 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
                                <ellipse cx="50" cy="50" rx="20" ry="48" fill="none" stroke="currentColor" strokeWidth="1" />
                                <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="currentColor" strokeWidth="1" />
                                <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="1" />
                                <line x1="50" y1="2" x2="50" y2="98" stroke="currentColor" strokeWidth="1" />
                            </svg>

                            {/* Inner animated glow */}
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-2xl" />
                            
                            {/* Core Text */}
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-500 to-purple-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                    AI
                                </span>
                            </div>
                            
                            {/* --- ORBITS & NODES (Coming out of the sphere) --- */}
                            
                            {/* Orbit 1 (Horizontal tilt) */}
                            <motion.div animate={{ rotate: 360, rotateY: 60, rotateX: 20 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-60px] border border-cyan-400/20 rounded-full" style={{ transformStyle: 'preserve-3d' }}>
                                <div className="absolute top-0 left-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotateX(-20deg) rotateY(-60deg)' }} />
                            </motion.div>
                            
                            {/* Orbit 2 (Vertical tilt) */}
                            <motion.div animate={{ rotate: -360, rotateX: 60, rotateY: -20 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-[-90px] border border-purple-400/20 rounded-full" style={{ transformStyle: 'preserve-3d' }}>
                                <div className="absolute top-1/2 right-0 w-5 h-5 bg-purple-400 rounded-full shadow-[0_0_20px_#a855f7] translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ transform: 'rotateX(-60deg) rotateY(20deg)' }}>
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                            </motion.div>

                            {/* Orbit 3 (Diagonal tilt) */}
                            <motion.div animate={{ rotate: 360, rotateX: 45, rotateY: 45 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute inset-[-30px] border border-indigo-400/20 rounded-full" style={{ transformStyle: 'preserve-3d' }}>
                                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8] -translate-x-1/2 translate-y-1/2" style={{ transform: 'rotateX(-45deg) rotateY(-45deg)' }} />
                            </motion.div>

                            {/* Connecting Lines to Cards (Static decorative lines) */}
                            <svg className="absolute inset-[-150px] w-[calc(100%+300px)] h-[calc(100%+300px)] pointer-events-none opacity-30" viewBox="0 0 400 400">
                                <path d="M 200 200 L 80 120" stroke="url(#line-grad-1)" strokeWidth="2" strokeDasharray="4 4" />
                                <path d="M 200 200 L 320 120" stroke="url(#line-grad-2)" strokeWidth="2" strokeDasharray="4 4" />
                                <path d="M 200 200 L 100 300" stroke="url(#line-grad-3)" strokeWidth="2" strokeDasharray="4 4" />
                                <path d="M 200 200 L 300 300" stroke="url(#line-grad-4)" strokeWidth="2" strokeDasharray="4 4" />
                                <defs>
                                    <linearGradient id="line-grad-1" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                                    <linearGradient id="line-grad-2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                                    <linearGradient id="line-grad-3" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                                    <linearGradient id="line-grad-4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f87171"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </motion.div>

                    {/* Floating Card 1: Top Left */}
                    <motion.div 
                        initial={{ x: 50, y: 50, opacity: 0 }}
                        whileInView={{ x: 0, y: 0, opacity: 1, y: [-8, 8, -8] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                        className="absolute top-[5%] left-[-2%] sm:left-[5%] w-40 sm:w-48 p-2 rounded-2xl bg-gradient-to-br from-indigo-500/80 to-blue-600/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-500/30 -rotate-6 z-10 group cursor-pointer"
                    >
                        <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden relative mb-3">
                            <div className="absolute inset-0 bg-indigo-900/40 mix-blend-overlay z-10" />
                            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=300&q=80" alt="AI" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white text-sm sm:text-base font-bold leading-tight px-1 text-start">{isAr ? 'الذكاء الاصطناعي وتعلم الآلة' : 'AI & Machine Learning'}</h3>
                        <div className="flex items-center gap-1 mt-2 mb-1 px-1 text-[10px] text-white/80">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> <span className="font-bold">5.0</span> <span className="opacity-50 mx-1">|</span> {isAr ? '٤٥ وحدة' : '45 Modules'}
                        </div>
                    </motion.div>

                    {/* Floating Card 2: Bottom Left */}
                    <motion.div 
                        initial={{ x: 50, y: -50, opacity: 0 }}
                        whileInView={{ x: 0, y: 0, opacity: 1, y: [8, -8, 8] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
                        className="absolute bottom-[5%] left-[-2%] sm:left-[5%] w-40 sm:w-48 p-2 rounded-2xl bg-gradient-to-br from-blue-600/80 to-cyan-500/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-cyan-500/30 rotate-12 z-10 group cursor-pointer"
                    >
                        <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden relative mb-3">
                            <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay z-10" />
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80" alt="Data" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Database className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white text-sm sm:text-base font-bold leading-tight px-1 text-start">{isAr ? 'أساسيات علم البيانات' : 'Data Science Foundations'}</h3>
                        <div className="flex items-center gap-1 mt-2 mb-1 px-1 text-[10px] text-white/80">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> <span className="font-bold">4.8</span> <span className="opacity-50 mx-1">|</span> {isAr ? '٣٣ وحدة' : '33 Modules'}
                        </div>
                    </motion.div>

                    {/* Floating Card 3: Top Right */}
                    <motion.div 
                        initial={{ x: -50, y: 50, opacity: 0 }}
                        whileInView={{ x: 0, y: 0, opacity: 1, y: [-6, 6, -6] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" } }}
                        className="absolute top-[5%] right-[-2%] sm:right-[5%] w-40 sm:w-48 p-2 rounded-2xl bg-gradient-to-br from-emerald-500/80 to-green-600/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-green-500/30 rotate-6 z-10 group cursor-pointer"
                    >
                        <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden relative mb-3">
                            <div className="absolute inset-0 bg-emerald-900/40 mix-blend-overlay z-10" />
                            <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=300&q=80" alt="Code" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <Code2 className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white text-sm sm:text-base font-bold leading-tight px-1 text-start">{isAr ? 'بايثون للمبتدئين' : 'Python for Beginners'}</h3>
                        <div className="flex items-center gap-1 mt-2 mb-1 px-1 text-[10px] text-white/80">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> <span className="font-bold">4.9</span> <span className="opacity-50 mx-1">|</span> {isAr ? '٢٨ وحدة' : '28 Modules'}
                        </div>
                    </motion.div>

                    {/* Floating Card 4: Bottom Right */}
                    <motion.div 
                        initial={{ x: -50, y: -50, opacity: 0 }}
                        whileInView={{ x: 0, y: 0, opacity: 1, y: [6, -6, 6] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" } }}
                        className="absolute bottom-[5%] right-[-2%] sm:right-[5%] w-40 sm:w-48 p-2 rounded-2xl bg-gradient-to-br from-orange-500/80 to-red-500/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-orange-500/30 -rotate-12 z-10 group cursor-pointer"
                    >
                        <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden relative mb-3">
                            <div className="absolute inset-0 bg-orange-900/40 mix-blend-overlay z-10" />
                            <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80" alt="Design" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <PenTool className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-white text-sm sm:text-base font-bold leading-tight px-1 text-start">{isAr ? 'تصميم واجهة المستخدم UI/UX' : 'Product Design UI/UX'}</h3>
                        <div className="flex items-center gap-1 mt-2 mb-1 px-1 text-[10px] text-white/80">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> <span className="font-bold">4.7</span> <span className="opacity-50 mx-1">|</span> {isAr ? '٥٢ وحدة' : '52 Modules'}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default SmartLearningSection;
