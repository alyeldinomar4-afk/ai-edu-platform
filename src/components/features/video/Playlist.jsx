import { CheckCircle, PlayCircle, Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils';

const listStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const listItem = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Playlist = ({ sections, currentLecture, onSelect }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-200 font-sans">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#131C31]">
                <h3 className="font-bold text-slate-900 dark:text-white tracking-wide">{t('videoPlayer.playlist.title')}</h3>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="border-b border-slate-200 dark:border-slate-800 last:border-0">
                        {/* Section Title */}
                        <div className="bg-slate-100 dark:bg-[#1E293B] px-5 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest shadow-inner border-y border-slate-200 dark:border-slate-700/50">
                            {t('videoPlayer.playlist.section', { number: sIdx + 1 })}: {section.title}
                        </div>

                        <motion.div variants={listStagger} initial="hidden" animate="visible">
                            {section.lectures.map((lecture, lIdx) => {
                                const isActive = currentLecture === lecture.id;
                                const isCompleted = lecture.completed;
                                const isLocked = lecture.locked;

                                return (
                                    <motion.button
                                        key={lecture.id}
                                        variants={listItem}
                                        onClick={() => !isLocked && onSelect(lecture)}
                                        disabled={isLocked}
                                        whileHover={!isLocked ? { x: isRTL ? -4 : 4 } : {}}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        className={cn(
                                            `w-full px-5 py-4 flex items-center gap-4 transition-all cursor-pointer border-b border-slate-100 dark:border-slate-800/50 last:border-0 group ${isRTL ? 'text-right' : 'text-left'}`,
                                            isActive
                                                ? `bg-indigo-600/10 hover:bg-indigo-600/20 ${isRTL ? 'border-r-[3px] border-r-indigo-500' : 'border-l-[3px] border-l-indigo-500'}`
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                                        )}
                                    >
                                        <div className="flex-shrink-0 relative">
                                            <div className={`w-[80px] h-[50px] rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-md border transition-all duration-300 ${isActive ? 'border-indigo-500/50 shadow-indigo-500/10' : 'border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600'}`}>
                                                {lecture.thumbnail ? (
                                                    <div className="relative w-full h-full">
                                                        <img src={lecture.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="" />
                                                        {/* Play overlay on hover */}
                                                        {!isLocked && (
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                <Play size={16} className="text-white fill-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                        <PlayCircle size={16} />
                                                    </div>
                                                )}
                                                {isLocked && (
                                                    <div className="absolute inset-0 bg-slate-100/80 dark:bg-[#0F172A]/80 flex items-center justify-center backdrop-blur-sm">
                                                        <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Status indicator */}
                                            <div className={`absolute -bottom-1 z-10 ${isRTL ? '-right-2' : '-left-2'}`}>
                                                {isCompleted ? (
                                                    <div className="bg-[#0F172A] rounded-full p-0.5 shadow-sm">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                ) : (!isLocked && isActive) ? (
                                                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)] border border-[#0F172A]" />
                                                ) : null}
                                            </div>
                                            {/* Mock progress bar */}
                                            {!isLocked && (
                                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: isCompleted ? '100%' : isActive ? '35%' : '0%' }}
                                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                                        className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className={cn(
                                                "text-[14px] transition-colors leading-snug line-clamp-2",
                                                isActive ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white"
                                            )}>
                                                {lIdx + 1}. {lecture.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5 opacity-80">
                                                <span className={`text-[11px] font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`}>
                                                    <PlayCircle size={12} /> {lecture.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Playlist;
