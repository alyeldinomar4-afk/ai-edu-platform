import { Star, Clock, BookOpen } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const cardRef = useRef(null);

    // 3D Tilt logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 group h-full cursor-pointer card-3d-auto hover-glow-purple"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {t(`courses.categories.${course.category.charAt(0).toLowerCase() + course.category.slice(1).replace(/\s+/g, '')}`)}
                </div>
            </div>

            <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {t(`courses.levels.${course.level.toLowerCase()}`)}
                    </span>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const filled = course.rating >= star;
                            const half = !filled && course.rating >= star - 0.5;
                            return (
                                <svg
                                    key={star}
                                    viewBox="0 0 20 20"
                                    className="w-3.5 h-3.5 flex-shrink-0"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <linearGradient id={`half-${course.id}-${star}`} x1="0" x2="1" y1="0" y2="0">
                                            <stop offset="50%" stopColor="#facc15" />
                                            <stop offset="50%" stopColor="#e2e8f0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        fill={filled ? '#facc15' : half ? `url(#half-${course.id}-${star})` : '#e2e8f0'}
                                        className="dark:opacity-90"
                                    />
                                </svg>
                            );
                        })}
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 ml-0.5">{course.rating}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">({course.reviews} {t('publicInstructor.reviews')})</span>
                    </div>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1 line-clamp-2 leading-snug">{course.title}</h3>
                <button
                    className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-primary/10 dark:bg-slate-700/50 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-light px-2.5 py-1.5 rounded-xl transition-all w-fit mb-4 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 group/instructor"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/instructor/user/${encodeURIComponent(course.instructor.replace(/\s+/g, '-').toLowerCase())}`);
                    }}
                >
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white dark:border-slate-800 shadow-sm shrink-0">
                        <img 
                            src={course.instructor === 'Dr. Laila Hassan' ? 'https://randomuser.me/api/portraits/women/65.jpg' : 'https://randomuser.me/api/portraits/men/46.jpg'} 
                            alt={course.instructor}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-medium group-hover/instructor:underline decoration-primary/30 underline-offset-2">{course.instructor}</span>
                </button>

                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-4 mt-auto">
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{course.lessons} {t('courses.lessons')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {course.price === 0 ? t('home.cta.free') : `$${course.discount ? (course.price * (1 - course.discount / 100)).toFixed(2) : course.price}`}
                        </span>
                        {course.discount > 0 && course.price > 0 && (
                            <>
                                <span className="text-sm text-slate-400 line-through">${course.price}</span>
                                <span className="text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-md">-{course.discount}%</span>
                            </>
                        )}
                    </div>
                    <Link to={`/courses/${course.id}`}>
                        <Button variant="outline" size="sm">{t('courses.viewCourse')}</Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
