import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Settings,
    Bot,
    Zap,
    Share2,
    Globe,
    Mail,
    Shield,
    ToggleLeft,
    ToggleRight,
    Save,
    LayoutDashboard,
    Key,
    DollarSign,
    AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';

const AdminSettingsPage = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

    // Platform Settings State
    const [settings, setSettings] = useState({
        platformName: '',
        supportEmail: '',
        maintenanceMode: false,
        enableAiTutor: true,
        defaultAiModel: 'gpt-4-turbo',
        feedbackIntensity: 'medium',
        autoApproveCourses: false,
        defaultCurrency: 'USD',
        googleLogin: true,
        githubLogin: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const data = await api.admin.settings.get();
                setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
                toast.error(t('common.error'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [t]);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.admin.settings.update(settings);
            toast.success(t('dashboard.admin.settings.saveSuccess'));
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: t('dashboard.admin.settings.tabs.general'), icon: Globe },
        { id: 'ai', label: t('dashboard.admin.settings.tabs.ai'), icon: Bot },
        { id: 'workflow', label: t('dashboard.admin.settings.tabs.workflow'), icon: Zap },
        { id: 'integrations', label: t('dashboard.admin.settings.tabs.integrations'), icon: Shield },
    ];

    const containerVariants = {
        hidden: { opacity: 0, x: isAr ? 20 : -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isAr ? -20 : 20 }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t('dashboard.admin.settings.title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('dashboard.admin.settings.subtitle')}
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? t('common.loading') : <><Save size={18} className={isAr ? 'ml-2' : 'mr-2'} /> {t('common.save')}</>}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Tabs Navigation */}
                <div className="md:w-64 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${isActive
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm font-semibold'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('common.loading')}</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
                        >
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
                                        {t('dashboard.admin.settings.general.title')}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.admin.settings.general.platformName')}</label>
                                            <div className="relative">
                                                <LayoutDashboard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="platformName"
                                                    value={settings.platformName}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.admin.settings.general.supportEmail')}</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="email"
                                                    name="supportEmail"
                                                    value={settings.supportEmail}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${settings.maintenanceMode
                                            ? 'bg-red-100/40 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                                            : 'bg-green-100/40 dark:bg-green-500/10 border-green-200 dark:border-green-500/20'
                                        }`}>
                                        <div className="space-y-1">
                                            <h3 className={`font-semibold transition-colors ${settings.maintenanceMode ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                                                {t('dashboard.admin.settings.general.maintenanceMode')}
                                            </h3>
                                            <p className={`text-sm transition-colors ${settings.maintenanceMode ? 'text-red-600/70 dark:text-red-400/60' : 'text-green-600/70 dark:text-green-400/60'}`}>
                                                {t('dashboard.admin.settings.general.maintenanceHint')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowMaintenanceModal(true)}
                                            className={`cursor-pointer transition-colors ${settings.maintenanceMode ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                                        >
                                            {settings.maintenanceMode ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ai' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
                                        {t('dashboard.admin.settings.ai.title')}
                                    </h2>
                                    <div className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                        settings.enableAiTutor 
                                        ? 'bg-primary/5 border border-primary/20 shadow-sm shadow-primary/5' 
                                        : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
                                    }`}>
                                        <div className="space-y-1">
                                            <h3 className={`font-semibold transition-colors ${settings.enableAiTutor ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                {t('dashboard.admin.settings.ai.enableTutor')}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.admin.settings.ai.tutorHint')}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('enableAiTutor')}
                                            className={`cursor-pointer transition-colors ${settings.enableAiTutor ? 'text-primary' : 'text-slate-400'}`}
                                        >
                                            {settings.enableAiTutor ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.admin.settings.ai.model')}</label>
                                            <select
                                                name="defaultAiModel"
                                                value={settings.defaultAiModel}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                            >
                                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                                <option value="claude-3-opus">Claude 3 Opus</option>
                                                <option value="gemini-pro">Gemini Pro</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.admin.settings.ai.feedbackIntensity')}</label>
                                            <div className="flex gap-2">
                                                {['low', 'medium', 'high'].map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setSettings(prev => ({ ...prev, feedbackIntensity: level }))}
                                                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${settings.feedbackIntensity === level
                                                                ? 'bg-primary border-primary text-white'
                                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/50'
                                                            }`}
                                                    >
                                                        {t(`dashboard.admin.settings.ai.intensity${level.charAt(0).toUpperCase() + level.slice(1)}`)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'workflow' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
                                        {t('dashboard.admin.settings.workflow.title')}
                                    </h2>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{t('dashboard.admin.settings.workflow.autoApprove')}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Automatically publish new courses from verified instructors.</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('autoApproveCourses')}
                                            className="cursor-pointer text-slate-400 hover:text-primary transition-colors"
                                        >
                                            {settings.autoApproveCourses ? <ToggleRight size={40} className="text-primary" /> : <ToggleLeft size={40} />}
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-w-xs">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.admin.settings.workflow.currency')}</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select
                                                name="defaultCurrency"
                                                value={settings.defaultCurrency}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                                <option value="EGP">EGP (LE)</option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-slate-500">{t('dashboard.admin.settings.workflow.currencyHint')}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'integrations' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
                                        {t('dashboard.admin.settings.integrations.title')}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-[#4285F4]/10 rounded-lg text-[#4285F4]">
                                                    <Globe size={20} />
                                                </div>
                                                <h3 className="font-medium text-slate-900 dark:text-white">{t('dashboard.admin.settings.integrations.googleLogin')}</h3>
                                            </div>
                                            <button
                                                onClick={() => handleToggle('googleLogin')}
                                                className="cursor-pointer"
                                            >
                                                {settings.googleLogin ? <ToggleRight size={32} className="text-primary" /> : <ToggleLeft size={32} className="text-slate-300" />}
                                            </button>
                                        </div>
                                        <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-[#24292e]/10 rounded-lg text-[#24292e] dark:text-white dark:bg-white/10">
                                                    <Key size={20} />
                                                </div>
                                                <h3 className="font-medium text-slate-900 dark:text-white">{t('dashboard.admin.settings.integrations.githubLogin')}</h3>
                                            </div>
                                            <button
                                                onClick={() => handleToggle('githubLogin')}
                                                className="cursor-pointer"
                                            >
                                                {settings.githubLogin ? <ToggleRight size={32} className="text-primary" /> : <ToggleLeft size={32} className="text-slate-300" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl flex gap-3">
                                        <Shield className="text-amber-600 shrink-0" size={20} />
                                        <p className="text-sm text-amber-800 dark:text-amber-500/80">
                                            Changes to social login providers may affect user access immediately. Please verify API credentials before disabling.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Maintenance Mode Confirmation Modal */}
            <AnimatePresence>
                {showMaintenanceModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            onClick={() => setShowMaintenanceModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 border border-slate-100 dark:border-slate-800 text-left rtl:text-right"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0">
                                    <AlertTriangle size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {t('dashboard.admin.settings.general.maintenanceConfirmTitle')}
                                </h2>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                {t('dashboard.admin.settings.general.maintenanceConfirmMessage')}
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowMaintenanceModal(false)}
                                    className="flex-1"
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    variant={settings.maintenanceMode ? 'primary' : 'danger'}
                                    onClick={() => {
                                        handleToggle('maintenanceMode');
                                        setShowMaintenanceModal(false);
                                    }}
                                    className="flex-1"
                                >
                                    {t('common.save')}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSettingsPage;
