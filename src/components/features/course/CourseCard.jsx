import { Star, Clock, BookOpen, Play } from 'lucide-react';
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
                    y: -4,
                    transition: { duration: 0.2, ease: 'easeOut' }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "bg-white dark:bg-[#11111a] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 group relative shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] dark:hover:border-primary/30 transition-all duration-300",
                    "flex flex-col h-full"
                )}
            >
                {/* 3. Inner Border Glow (Glassmorphism) */}
                <div className="absolute inset-0 rounded-xl border border-white/20 dark:border-white/5 pointer-events-none z-20" />

                {/* Image Section */}
                <Link to={`/courses/${course.id}`} className="relative h-36 sm:h-44 w-full overflow-hidden shrink-0 z-30 block group/img">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Dark Overlay for Hover */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center">
                        <div className="bg-gradient-to-r from-primary to-secondary p-3.5 rounded-full transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 shadow-[0_4px_20px_rgba(99,102,241,0.6)]">
                            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide text-primary dark:text-white shadow-sm z-40">
                        {t(`courses.categories.${course.category.charAt(0).toLowerCase() + course.category.slice(1).replace(/\s+/g, '')}`)}
                    </div>
                </Link>

                {/* Content Section with Premium Clean Look */}
                <div className="p-4 sm:p-5 flex flex-col relative flex-grow min-w-0 z-30">
                    
                    {/* 2. Title */}
                    <Link to={`/courses/${course.id}`} className="mt-1 mb-1 block">
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {course.title}
                        </h3>
                    </Link>

                    {/* Instructor */}
                    <Link
                        to={`/instructor/user/${encodeURIComponent(course.instructor.replace(/\s+/g, '-').toLowerCase())}`}
                        className="text-xs text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary mb-2 font-medium transition-colors w-fit block z-40 relative"
                    >
                        {course.instructor}
                    </Link>

                    {/* 1. Rating Row */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-sm font-bold text-amber-700 dark:text-amber-500">{course.rating}</span>
                        <div className="flex gap-0.5">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <Star size={12} className="fill-amber-400 text-amber-400 opacity-30" />
                        </div>
                        <span className="text-[11px] text-slate-400">({course.reviews || 120})</span>
                    </div>

                    {/* 4. Course Meta Info */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mb-4 font-medium">
                        <div className="flex items-center gap-1.5">
                            <BookOpen size={13} />
                            <span>{course.lessons} {t('courses.lessons', { defaultValue: 'Lectures' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={13} />
                            <span>{formatDuration(course.duration)}</span>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1.5 uppercase tracking-wide text-[9px] font-bold",
                            course.level === 'Beginner' ? "text-green-600 dark:text-green-400" :
                            course.level === 'Intermediate' ? "text-amber-600 dark:text-amber-400" :
                            "text-red-600 dark:text-red-400"
                        )}>
                            {t(`courses.levels.${course.level.toLowerCase()}`)}
                        </div>
                    </div>

                    {/* 5. Price */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
                        <div className="flex flex-col">
                            {course.price > 0 && course.discount > 0 && (
                                <span className="text-[11px] text-slate-400 line-through leading-none mb-1">
                                    {formatCurrency(course.price, i18n.language)}
                                </span>
                            )}
                            <span className="font-bold text-lg text-slate-900 dark:text-white">
                                {course.price === 0 ? t('home.cta.free') : formatCurrency(course.discount ? (course.price * (1 - course.discount / 100)) : course.price, i18n.language)}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseCard;
