import { Star, Clock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import { cn } from '../../../utils';
import { formatDuration, formatCurrency } from '../../../utils/formatters';

const CourseCard = ({ course, layout = 'grid' }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const cardRef = useRef(null);



    return (
        <div style={{ perspective: "1200px" }} className="h-full">
            <motion.div
                ref={cardRef}
                whileHover={{ 
                    y: -8,
                    scale: 1.01,
                    transition: { duration: 0.3, ease: 'easeOut' }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800/80 group cursor-pointer relative shadow-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500",
                    "flex flex-col h-full"
                )}
            >
                {/* 3. Inner Border Glow (Glassmorphism) */}
                <div className="absolute inset-0 rounded-[32px] border border-white/20 dark:border-slate-400/10 pointer-events-none z-20" />

                {/* Image Section with Preview Overlay */}
                <div className="relative h-28 sm:h-44 w-full overflow-hidden shrink-0 z-30">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-primary dark:text-white shadow-sm z-40">
                        {t(`courses.categories.${course.category.charAt(0).toLowerCase() + course.category.slice(1).replace(/\s+/g, '')}`)}
                    </div>

                    {/* Preview Overlay - NO BLUR as requested */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-50">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            className="bg-white text-slate-900 px-8 py-3.5 rounded-full text-sm sm:text-base font-black shadow-2xl flex items-center gap-2"
                        >
                            <BookOpen size={18} className="text-primary" />
                            {t('courses.viewCourse', { defaultValue: 'Preview Course' })}
                        </motion.div>
                    </div>
                </div>

                {/* Content Section with Refined Hierarchy */}
                <div className="p-3 sm:p-5 md:p-6 flex flex-col relative flex-grow min-w-0 z-30">
                    {/* 1. Rating & Level Row */}
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-slate-100 dark:border-slate-700/50">
                            <Star size={10} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200">{course.rating}</span>
                        </div>
                        <span className={cn(
                            "text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                            course.level === 'Beginner' ? "bg-green-100/50 dark:bg-green-900/20 text-green-600 dark:text-green-400" :
                            course.level === 'Intermediate' ? "bg-amber-100/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" :
                            "bg-red-100/50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        )}>
                            {t(`courses.levels.${course.level.toLowerCase()}`)}
                        </span>
                    </div>

                    {/* 2. Title */}
                    <h3 className="font-extrabold text-base sm:text-md md:text-lg text-slate-900 dark:text-white mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>

                    {/* 3. Instructor - Restored for all sizes */}
                    <button
                        className="flex items-center gap-2 mb-3 sm:mb-4 group/ins w-fit px-2 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/instructor/user/${encodeURIComponent(course.instructor.replace(/\s+/g, '-').toLowerCase())}`);
                        }}
                    >
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white dark:border-slate-700 shadow-sm transition-transform group-hover/ins:scale-110 bg-slate-200">
                            <img 
                                src={course.instructorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=random`} 
                                alt={course.instructor}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-[10px] md:text-[11px] font-extrabold text-slate-600 dark:text-slate-400 group-hover/ins:text-primary transition-colors pr-1">{course.instructor}</span>
                    </button>

                    {/* 4. Course Details - Clean Grid */}
                    <div className="flex items-center gap-3 sm:gap-5 text-[9px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 sm:mb-4">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <BookOpen size={12} className="text-primary/60" />
                            <span>{course.lessons} <span className="hidden xs:inline">{t('courses.lessons')}</span></span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <Clock size={12} className="text-secondary/60" />
                            <span>{formatDuration(course.duration)}</span>
                        </div>
                    </div>

                    {/* 5. Price & CTA - Premium Alignment */}
                    <div className="mt-auto pt-2 sm:pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="font-black text-sm sm:text-xl text-slate-900 dark:text-white">
                                    {course.price === 0 ? t('home.cta.free') : formatCurrency(course.discount ? (course.price * (1 - course.discount / 100)) : course.price, i18n.language)}
                                </span>
                                {course.price > 0 && course.discount > 0 && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 line-through leading-none decoration-slate-400/50">
                                            {formatCurrency(course.price, i18n.language)}
                                        </span>
                                        <span className="text-[9px] font-bold text-green-600 dark:text-green-400">
                                            -{course.discount}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <Link to={`/courses/${course.id}`} className="shrink-0">
                            <Button 
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[12px] transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 uppercase tracking-wider"
                            >
                                {t('courses.viewCourse')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseCard;
