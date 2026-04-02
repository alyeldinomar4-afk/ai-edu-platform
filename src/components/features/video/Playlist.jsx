import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils';

const Playlist = ({ sections, currentLecture, onSelect }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    return (
        <div className="flex flex-col h-full bg-[#0F172A] border-l border-slate-800 overflow-hidden text-slate-200 font-sans">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#131C31]">
                <h3 className="font-bold text-white tracking-wide">{t('videoPlayer.playlist.title')}</h3>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="border-b border-slate-800 last:border-0">
                        {/* Section Title */}
                        <div className="bg-[#1E293B] px-5 py-3.5 text-xs font-bold text-slate-300 uppercase tracking-widest shadow-inner border-y border-slate-700/50">
                            {t('videoPlayer.playlist.section', { number: sIdx + 1 })}: {section.title}
                        </div>

                        <div>
                            {section.lectures.map((lecture, lIdx) => {
                                const isActive = currentLecture === lecture.id;
                                const isCompleted = lecture.completed;
                                const isLocked = lecture.locked;

                                return (
                                    <button
                                        key={lecture.id}
                                        onClick={() => !isLocked && onSelect(lecture)}
                                        disabled={isLocked}
                                        className={cn(
                                            `w-full px-5 py-4 flex items-center gap-4 transition-all hover:bg-slate-800/80 cursor-pointer border-b border-slate-800/50 last:border-0 ${isRTL ? 'text-right' : 'text-left'}`,
                                            isActive && `bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500 ${isRTL ? 'border-r-[3px]' : 'border-l-[3px]'}`
                                        )}
                                    >
                                        <div className="flex-shrink-0 relative">
                                            <div className={`w-[80px] h-[50px] rounded-lg bg-slate-800 overflow-hidden shadow-md border ${isActive ? 'border-indigo-500/50' : 'border-slate-700'}`}>
                                                {lecture.thumbnail ? (
                                                    <img src={lecture.thumbnail} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                        <PlayCircle size={16} />
                                                    </div>
                                                )}
                                                {isLocked && (
                                                    <div className="absolute inset-0 bg-[#0F172A]/80 flex items-center justify-center backdrop-blur-sm">
                                                        <Lock className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`absolute -bottom-1 z-10 ${isRTL ? '-right-2' : '-left-2'}`}>
                                                {isCompleted ? (
                                                    <div className="bg-[#0F172A] rounded-full p-0.5 shadow-sm">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                ) : (!isLocked && isActive) ? (
                                                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)] border border-[#0F172A]" />
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className={cn(
                                                "text-[14px] transition-colors leading-snug line-clamp-2",
                                                isActive ? "font-bold text-white" : "text-slate-300 font-medium group-hover:text-white"
                                            )}>
                                                {lIdx + 1}. {lecture.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5 opacity-80">
                                                <span className={`text-[11px] font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                                                    <PlayCircle size={12} /> {lecture.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Playlist;
