import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, X, BookX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../../components/features/course/CourseCard';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { CourseCardSkeleton } from '../../components/ui/LoadingSkeleton';
import { courses, categories } from '../../data/mockData';

const CoursesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState('');
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
        return matchesCategory && matchesSearch;
    });

    const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (searchQuery ? 1 : 0);
    const hasActiveFilters = activeFiltersCount > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Courses' }]} />

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore Courses</h1>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">Discover new skills with AI-assisted learning</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by course name..."
                            aria-label="Search courses by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="md:hidden relative"
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
                    <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                                <h3 className="font-semibold text-slate-900">Filters</h3>
                                {hasActiveFilters && (
                                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={() => { handleCategoryChange('All'); setSearchQuery(''); }}
                                    className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Categories</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-primary transition-colors">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === 'All'}
                                            onChange={() => handleCategoryChange('All')}
                                            className="text-primary focus:ring-primary"
                                        />
                                        All Categories
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-primary transition-colors">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat.name}
                                                onChange={() => handleCategoryChange(cat.name)}
                                                className="text-primary focus:ring-primary"
                                            />
                                            {cat.name}
                                            <span className="text-xs text-slate-400 ml-auto">({cat.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-sm font-medium text-slate-700 mb-3">Difficulty</h4>
                                <div className="space-y-2">
                                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                                        <label key={level} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                            <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                                            {level}
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
                            <AnimatePresence>
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
                            className="text-center py-16 md:py-24 bg-slate-50 rounded-xl border border-dashed border-slate-200"
                        >
                            <div className="max-w-md mx-auto px-4">
                                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookX className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    We couldn't find any courses matching your search criteria. Try adjusting your filters or search term.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => { handleCategoryChange('All'); setSearchQuery(''); }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear All Filters
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
