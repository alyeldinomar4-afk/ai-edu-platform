import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { cn } from '../../../utils';

const Playlist = ({ sections, currentLecture, onSelect }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Course Content</h3>
            </div>
            <div className="overflow-y-auto flex-1">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="border-b border-slate-50 last:border-0">
                        <div className="bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-700">
                            Section {sIdx + 1}: {section.title}
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
                                            "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-slate-50 cursor-pointer",
                                            isActive && "bg-primary/5 hover:bg-primary/10 border-r-2 border-primary"
                                        )}
                                    >
                                        <div className="mt-0.5">
                                            {isCompleted ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : isLocked ? (
                                                <Lock className="w-4 h-4 text-slate-300" />
                                            ) : (
                                                <PlayCircle className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400")} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn("text-sm", isActive ? "font-medium text-primary" : "text-slate-600")}>
                                                {lIdx + 1}. {lecture.title}
                                            </p>
                                            <span className="text-xs text-slate-400">{lecture.duration}</span>
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
