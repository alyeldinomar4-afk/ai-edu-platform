import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../utils';

const Playlist = ({ sections, currentLecture, onSelect }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden h-full flex flex-col transition-colors">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">{t('videoPlayer.playlist.title')}</h3>
            </div>
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                                            `w-full px-4 py-3 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`,
                                            isActive && `bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 border-primary ${isRTL ? 'border-l-2' : 'border-r-2'}`
                                        )}
                                    >
                                        <div className="mt-0.5 flex-shrink-0 relative">
                                            <div className="w-12 h-8 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden mb-1 shadow-sm border border-slate-200 dark:border-slate-700">
                                                {lecture.thumbnail ? (
                                                    <img src={lecture.thumbnail} className="w-full h-full object-cover transition-transform hover:scale-110 duration-300" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <PlayCircle size={14} />
                                                    </div>
                                                )}
                                                {isLocked && (
                                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[1px]">
                                                        <Lock className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`absolute -bottom-1 z-10 ${isRTL ? '-left-1' : '-right-1'}`}>
                                                {isCompleted ? (
                                                    <div className="bg-white dark:bg-slate-900 rounded-full p-0.5">
                                                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                    </div>
                                                ) : (!isLocked && isActive) ? (
                                                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-sm shadow-primary/50" />
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm transition-colors truncate",
                                                isActive ? "font-bold text-primary" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                                            )}>
                                                {lIdx + 1}. {lecture.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                    <PlayCircle size={10} /> {lecture.duration}
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
