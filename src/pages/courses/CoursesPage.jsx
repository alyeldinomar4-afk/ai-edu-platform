import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, SlidersHorizontal, X, BookX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../../components/features/course/CourseCard';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { CourseCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { courses, categories } from '../../data/mockData';

const CoursesPage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('All');
        }
    }, [searchParams]);

    // Simulate loading state
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ category });
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
        return matchesCategory && matchesSearch && matchesLevel;
    });

    const handleLevelToggle = (level) => {
        setSelectedLevels(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    const handleClearAll = () => {
        handleCategoryChange('All');
        setSearchQuery('');
        setSelectedLevels([]);
    };

    const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (searchQuery ? 1 : 0) + selectedLevels.length;
    const hasActiveFilters = activeFiltersCount > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 min-h-screen">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('nav.courses') }]} />

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                        />
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
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Filters Sidebar */}
                <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
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
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === 'All'}
                                            onChange={() => handleCategoryChange('All')}
                                            className="text-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                                        />
                                        {t('courses.allCategories')}
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat.name}
                                                onChange={() => handleCategoryChange(cat.name)}
                                                className="text-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                                            />
                                            {t(`courses.categories.${cat.name.charAt(0).toLowerCase() + cat.name.slice(1).replace(/\s+/g, '')}`)}
                                            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">({cat.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">{t('courses.difficulty')}</h4>
                                <div className="space-y-2">
                                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                                        <label key={level} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedLevels.includes(level)}
                                                onChange={() => handleLevelToggle(level)}
                                                className="rounded text-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
                                            />
                                            {t(`courses.levels.${level.toLowerCase()}`)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Course Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <CourseCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredCourses.map((course) => (
                                    <motion.div
                                        key={course.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CourseCard course={course} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors"
                        >
                            <div className="max-w-md mx-auto px-4">
                                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookX className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                </div>
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
