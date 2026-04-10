import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, SlidersHorizontal, X, Check, BookX, LayoutGrid, List, Eye, Star, Clock, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import CourseCard from '../../components/features/course/CourseCard';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { CourseCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { courses, categories } from '../../data/mockData';
import { cn } from '../../utils';

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.05,
        },
    },
};

const fadeSlideUp = {
    hidden: { opacity: 0, y: 24, filter: 'blur(3px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const CoursesPage = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    // Derivations from URL
    const selectedCategory = searchParams.get('category') || 'All';
    const searchQuery = searchParams.get('q') || '';
    const selectedLevels = searchParams.get('levels') ? searchParams.get('levels').split(',').filter(Boolean) : [];

    // Simulate loading state on mount
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCategoryChange = (category) => {
        setSearchParams(prev => {
            if (category === 'All') {
                prev.delete('category');
            } else {
                prev.set('category', category);
            }
            return prev;
        });
    };

    // Calculate level counts for the current filter set (ignoring level filter itself for better UX)
    const getLevelCount = (level) => {
        return courses.filter(c => 
            (selectedCategory === 'All' || c.category === selectedCategory) &&
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            c.level === level
        ).length;
    };

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
        return matchesCategory && matchesSearch && matchesLevel;
    });

    // Dynamic total count for 'All' based on current search and level
    const totalMatchingCourses = courses.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedLevels.length === 0 || selectedLevels.includes(c.level))
    ).length;

    const handleLevelToggle = (level) => {
        setSearchParams(prev => {
            const current = prev.get('levels') ? prev.get('levels').split(',') : [];
            const next = current.includes(level) 
                ? current.filter(l => l !== level) 
                : [...current, level];
            
            if (next.length === 0) {
                prev.delete('levels');
            } else {
                prev.set('levels', next.join(','));
            }
            return prev;
        });
    };

    const handleClearAll = () => {
        setSearchParams(new URLSearchParams());
    };

    const handleSearchChange = (val) => {
        setSearchParams(prev => {
            if (!val) prev.delete('q');
            else prev.set('q', val);
            return prev;
        }, { replace: true });
    };

    const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (searchQuery ? 1 : 0) + selectedLevels.length;
    const hasActiveFilters = activeFiltersCount > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 min-h-screen">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('nav.courses') }]} />

            {/* Header & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('courses.title')}</h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">{t('courses.subtitle')}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={t('courses.searchPlaceholder')}
                            aria-label={t('courses.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'grid' 
                                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'list' 
                                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                            )}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden relative dark:border-slate-700 dark:text-slate-300"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-4 h-4" />
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Filters Sidebar — Slide In */}
                <motion.aside
                    initial={{ opacity: 0, x: isAr ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
                >
                    <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <h3 className="font-semibold text-slate-900 dark:text-white">{t('courses.filters')}</h3>
                                {hasActiveFilters && (
                                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
                                >
                                    {t('courses.clearAll')}
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t('courses.categoriesLabel')}</h4>
                                <div className="space-y-0.5">
                                    <button
                                        onClick={() => handleCategoryChange('All')}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                                            selectedCategory === 'All'
                                                ? "text-primary font-bold bg-primary/5"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                            selectedCategory === 'All' ? "border-primary" : "border-slate-300 dark:border-slate-700 group-hover:border-slate-400"
                                        )}>
                                            {selectedCategory === 'All' && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                        </div>
                                        <span>{t('courses.allCategories')}</span>
                                        <span className="ml-auto text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                            {totalMatchingCourses}
                                        </span>
                                        {selectedCategory === 'All' && <motion.div layoutId="activeCat" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                                    </button>

                                    {categories.map(cat => {
                                        const isActive = selectedCategory === cat.name;
                                        const count = courses.filter(c => 
                                            c.category === cat.name && 
                                            c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                                            (selectedLevels.length === 0 || selectedLevels.includes(c.level))
                                        ).length;

                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategoryChange(cat.name)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                                                    isActive
                                                        ? "text-primary font-bold bg-primary/5"
                                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                                    isActive ? "border-primary" : "border-slate-300 dark:border-slate-700 group-hover:border-slate-400"
                                                )}>
                                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                                </div>
                                                <span className="truncate">{t(`courses.categories.${cat.name.charAt(0).toLowerCase() + cat.name.slice(1).replace(/\s+/g, '')}`)}</span>
                                                <span className="ml-auto text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                                    {count}
                                                </span>
                                                {isActive && <motion.div layoutId="activeCat" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t('courses.difficulty')}</h4>
                                <div className="space-y-0.5">
                                    {['Beginner', 'Intermediate', 'Advanced'].map(level => {
                                        const isChecked = selectedLevels.includes(level);
                                        const count = courses.filter(c => 
                                            c.level === level && 
                                            c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                                            (selectedCategory === 'All' || c.category === selectedCategory)
                                        ).length;

                                        return (
                                            <button
                                                key={level}
                                                onClick={() => handleLevelToggle(level)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                                                    isChecked
                                                        ? "text-secondary font-bold bg-secondary/5"
                                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-4 h-4 rounded flex items-center justify-center transition-all duration-300 border-2",
                                                    isChecked ? "bg-secondary border-secondary" : "border-slate-300 dark:border-slate-700 group-hover:border-slate-400"
                                                )}>
                                                    {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                                </div>
                                                <span>{t(`courses.levels.${level.toLowerCase()}`)}</span>
                                                <span className="ml-auto text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Course Grid — Stagger */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <CourseCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <AnimatePresence mode="wait">
                            {viewMode === 'grid' ? (
                                <motion.div
                                    key={`grid-${selectedCategory}-${selectedLevels.join('-')}-${searchQuery}`}
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr"
                                >
                                    {filteredCourses.map((course) => (
                                        <motion.div 
                                            layout
                                            key={course.id} 
                                            variants={fadeSlideUp}
                                        >
                                            <CourseCard course={course} layout="grid" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`list-${selectedCategory}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden overflow-x-auto"
                                >
                                    <table className={`w-full min-w-[800px] ${isAr ? 'text-right' : 'text-left'}`}>
                                        <thead>
                                            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                <th className="px-8 py-5">{t('courses.table.details')}</th>
                                                <th className="px-6 py-5 text-center">{t('courses.table.stats')}</th>
                                                <th className="px-6 py-5 text-center">{t('courses.table.level')}</th>
                                                <th className="px-6 py-5 text-center">{t('courses.table.price')}</th>
                                                <th className={`px-8 py-5 ${isAr ? 'text-left' : 'text-right'}`}>{t('courses.table.actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                            {filteredCourses.map((course) => (
                                                <tr key={course.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                                <img src={course.image} className="w-full h-full object-cover" alt={course.title} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-0.5 truncate">{course.title}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                                    {t(`courses.categories.${course.category.charAt(0).toLowerCase() + course.category.slice(1).replace(/\s+/g, '')}`)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                                            <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700/40 shadow-sm">
                                                                <Star size={12} className="text-yellow-400 fill-yellow-400" /> {course.rating}
                                                            </div>
                                                            <div className="flex flex-col items-center gap-1 group/stats">
                                                                <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{course.lessons}</span>
                                                                <BookOpen size={14} className="text-primary/60 transition-transform group-hover/stats:scale-110" />
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-80">{t('courses.lessons')}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={cn(
                                                            "inline-flex px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm",
                                                            course.level === 'Beginner' ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                                                                course.level === 'Intermediate' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                                                                    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                                        )}>
                                                            {t(`courses.levels.${course.level.toLowerCase()}`)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                                            {course.price === 0 ? t('home.cta.free') : `$${course.discount ? (course.price * (1 - course.discount / 100)).toFixed(2) : course.price}`}
                                                        </span>
                                                    </td>
                                                    <td className={`px-8 py-5 ${isAr ? 'text-left' : 'text-right'}`}>
                                                        <Link to={`/courses/${course.id}`}>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="md" 
                                                                className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-primary/5 text-slate-700 dark:text-slate-300 hover:text-primary transition-all font-black text-[12px] shadow-sm uppercase tracking-wider"
                                                                icon={Eye}
                                                                iconOnly
                                                            >
                                                                {t('courses.viewCourse')}
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors"
                        >
                            <div className="max-w-md mx-auto px-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                    className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <BookX className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                </motion.div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('courses.noCoursesFound')}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    {t('courses.noCoursesHint')}
                                </p>
                                <Button
                                    variant="outline"
                                    className="dark:border-slate-700 dark:text-slate-300"
                                    onClick={() => { handleCategoryChange('All'); setSearchQuery(''); }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    {t('courses.clearFilters')}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
