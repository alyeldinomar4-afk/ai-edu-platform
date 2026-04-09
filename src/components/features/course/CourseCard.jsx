import { Star, Clock, BookOpen } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import { instructors } from '../../../data/mockData';
import { cn } from '../../../utils';

const CourseCard = ({ course, layout = 'grid' }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const cardRef = useRef(null);

    // 2. 3D Tilt & Magnetic Springs
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

    // 3. Transform Mapping - Stronger Magnetic Feel
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-12px", "12px"]);
    const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-12px", "12px"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        
        // Tilt/Translation position (-0.5 to 0.5)
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div style={{ perspective: "1200px" }} className="h-full">
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: translateY,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
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
                <div className="relative h-32 sm:h-52 w-full overflow-hidden shrink-0 z-30">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-primary shadow-sm z-40">
                        {t(`courses.categories.${course.category.charAt(0).toLowerCase() + course.category.slice(1).replace(/\s+/g, '')}`)}
                    </div>

                    {/* Preview Overlay - NO BLUR as requested */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-50">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2"
                        >
                            <BookOpen size={16} className="text-primary" />
                            {t('courses.viewCourse', { defaultValue: 'Preview Course' })}
                        </motion.div>
                    </div>
                </div>

                {/* Content Section with Refined Hierarchy */}
                <div className="p-3 sm:p-6 md:p-8 flex flex-col relative flex-grow min-w-0 z-30">
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
                    <h3 className="font-extrabold text-base sm:text-lg md:text-xl text-slate-900 dark:text-white mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>

                    {/* 3. Instructor - Restored for all sizes */}
                    <button
                        className="flex items-center gap-2 mb-4 sm:mb-6 group/ins w-fit px-2 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/instructor/user/${encodeURIComponent(course.instructor.replace(/\s+/g, '-').toLowerCase())}`);
                        }}
                    >
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white dark:border-slate-700 shadow-sm transition-transform group-hover/ins:scale-110">
                            <img 
                                src={instructors.find(ins => ins.name === course.instructor)?.avatar || `https://ui-avatars.com/api/?name=${course.instructor}&background=random`} 
                                alt={course.instructor}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-[10px] md:text-[11px] font-extrabold text-slate-600 dark:text-slate-400 group-hover/ins:text-primary transition-colors pr-1">{course.instructor}</span>
                    </button>

                    {/* 4. Course Details - Clean Grid */}
                    <div className="flex items-center gap-3 sm:gap-5 text-[9px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 sm:mb-6">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <BookOpen size={12} className="text-primary/60" />
                            <span>{course.lessons} <span className="hidden xs:inline">{t('courses.lessons')}</span></span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <Clock size={12} className="text-secondary/60" />
                            <span>{course.duration}</span>
                        </div>
                    </div>

                    {/* 5. Price & CTA - Premium Alignment */}
                    <div className="mt-auto pt-2 sm:pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="font-black text-sm sm:text-2xl text-slate-900 dark:text-white">
                                    {course.price === 0 ? t('home.cta.free') : `$${course.discount ? (course.price * (1 - course.discount / 100)).toFixed(2) : course.price}`}
                                </span>
                            </div>
                        </div>
                        
                        <Link to={`/courses/${course.id}`} className="shrink-0">
                            <Button 
                                className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40"
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
