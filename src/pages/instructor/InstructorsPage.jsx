import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { instructors } from '../../data/mockData';
import Button from '../../components/ui/Button';
import Breadcrumb from '../../components/ui/Breadcrumb';

const InstructorsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 min-h-screen">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('nav.instructors') }]} />

            {/* Header */}
            <div className="mb-12 text-center md:text-start">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    {t('instructorsPage.title', 'Our Expert Instructors')}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                    {t('instructorsPage.subtitle', 'Learn from industry professionals with years of real-world experience and a passion for teaching.')}
                </p>
            </div>

            {/* Instructors Grid */}
            <div className="grid md:grid-cols-2 gap-8 text-start max-w-4xl mx-auto">
                {instructors.map((instructor, idx) => (
                    <motion.div
                        key={instructor.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all">
                                    <img src={instructor.avatar} alt={instructor.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{instructor.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{instructor.role}</p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                            {instructor.bio}
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 dark:border-slate-800 mb-6">
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{instructor.coursesCount}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t('instructors.courses', 'Courses')}</p>
                            </div>
                            <div className="text-center border-x border-slate-50 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{instructor.rating}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t('instructors.rating', 'Rating')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{instructor.studentsCount}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t('instructors.students', 'Students')}</p>
                            </div>
                        </div>

                        <Link to={`/instructor/user/${encodeURIComponent(instructor.name.replace(/\s+/g, '-').toLowerCase())}`}>
                            <Button className="w-full justify-center text-sm rounded-xl py-2.5 opacity-90 hover:opacity-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700" variant="outline">
                                {t('instructors.viewProfile', 'View Profile')}
                            </Button>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default InstructorsPage;
