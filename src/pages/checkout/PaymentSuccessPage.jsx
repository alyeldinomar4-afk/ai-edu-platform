import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';

const PaymentSuccessPage = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const location = useLocation();
    const courseId = location.state?.courseId;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center px-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                className="text-center max-w-md w-full"
            >
                {/* Success Icon */}
                <div className="relative mx-auto w-28 h-28 mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="absolute inset-0 bg-green-100 dark:bg-green-500/10 rounded-full"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
                        className="absolute inset-3 bg-green-200 dark:bg-green-500/20 rounded-full"
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <CheckCircle className="w-14 h-14 text-green-500" />
                    </motion.div>

                    {/* Sparkles */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="absolute -top-2 -right-2"
                    >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85 }}
                        className="absolute -bottom-1 -left-3"
                    >
                        <Sparkles className="w-5 h-5 text-primary" />
                    </motion.div>
                </div>

                {/* Text */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-slate-900 dark:text-white mb-3"
                >
                    {t('checkout.success.title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed"
                >
                    {t('checkout.success.subtitle')}
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                >
                    <Link to={courseId ? `/courses/${courseId}/learn` : "/learner/dashboard"}>
                        <Button size="lg" className="w-full shadow-[0_4px_14px_0_rgb(79,70,229,0.39)]" icon={BookOpen}>
                            {courseId ? t('checkout.success.goToCourse', 'Start Learning') : t('checkout.success.myCourses')}
                        </Button>
                    </Link>
                    <Link to="/courses">
                        <Button variant="ghost" size="lg" className="w-full mt-2">
                            {t('checkout.success.browseMore')}
                            <ArrowRight className={`w-4 h-4 transition-transform ${isAr ? 'mr-1 rotate-180' : 'ml-1'}`} />
                        </Button>
                    </Link>
                </motion.div>

                {/* Footer note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xs text-slate-400 dark:text-slate-500 mt-8"
                >
                    {t('checkout.success.emailNote')}
                </motion.p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccessPage;
