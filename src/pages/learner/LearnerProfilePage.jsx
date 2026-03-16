import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { User, Mail, Camera, Lock, Save, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';

const LearnerProfilePage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [avatar, setAvatar] = useState(user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=random");

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setTimeout(() => {
            setIsSavingProfile(false);
            toast.success(t('profile.successUpdate'));
        }, 1000);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t('profile.errorPasswordMatch'));
            return;
        }
        setIsSavingPassword(true);
        setTimeout(() => {
            setIsSavingPassword(false);
            toast.success(t('profile.successPassword'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('profile.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">{t('profile.subtitle')}</p>
            </motion.div>

            <div className="space-y-6">
                {/* Profile Picture Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="text-primary w-5 h-5" /> {t('profile.updatePhoto')}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('learner-avatar-upload').click()}>
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 transition-opacity group-hover:opacity-75"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                <Camera size={24} className="text-white drop-shadow-md" />
                            </div>
                            <input type="file" id="learner-avatar-upload" className="hidden" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => setAvatar(event.target.result);
                                    reader.readAsDataURL(e.target.files[0]);
                                    toast.success(t('profile.photoUpdated'));
                                }
                            }} />
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-3 mb-3">
                                <Button size="sm" onClick={() => document.getElementById('learner-avatar-upload').click()}>{t('profile.uploadPhoto')}</Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 dark:border-red-900/30 dark:hover:border-red-800/50"
                                    onClick={() => {
                                        setAvatar("https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=random&size=128");
                                        toast.success(t('profile.photoRemoved'));
                                    }}
                                >
                                    {t('profile.removePhoto')}
                                </Button>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Recommended size: 400x400px. JPG, PNG or GIF up to 5MB.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Personal Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Mail className="text-primary w-5 h-5" /> {t('profile.personalInfo')}
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.fullName')}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.email')}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.bio')}</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows="3"
                                    placeholder={t('profile.bioPlaceholder')}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSavingProfile}>
                                {isSavingProfile ? t('profile.saving') : <><Save size={16} className="mr-2" /> {t('profile.saveChanges')}</>}
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {/* Password & Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Shield className="text-primary w-5 h-5" /> {t('profile.security')}
                    </h2>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.currentPassword')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.newPassword')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.confirmPassword')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}>
                                {isSavingPassword ? t('profile.updating') : t('profile.updatePassword')}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default LearnerProfilePage;
