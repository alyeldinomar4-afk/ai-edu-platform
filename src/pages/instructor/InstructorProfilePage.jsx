import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { User, Mail, Camera, Lock, Save, Shield, Link as LinkIcon, Twitter, Linkedin, Globe, Briefcase } from 'lucide-react';
import Button from '../../components/ui/Button';
import { api } from '../../services/api';

const InstructorProfilePage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    // Basic Details
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [headline, setHeadline] = useState(t('profile.defaultHeadline'));
    const [bio, setBio] = useState(t('profile.defaultBio'));

    // Social Links
    const [website, setWebsite] = useState('https://nexora.ai/instructor');
    const [twitter, setTwitter] = useState('https://twitter.com/nexora_instructor');
    const [linkedin, setLinkedin] = useState('https://linkedin.com/in/nexora_instructor');

    // Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [avatar, setAvatar] = useState(user?.avatar || "https://randomuser.me/api/portraits/women/44.jpg");

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            await api.profile.update({
                name,
                email,
                headline,
                bio,
                website,
                twitter,
                linkedin,
                avatar
            });
            toast.success(t('profile.successUpdate'));
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t('profile.errorPasswordMatch'));
            return;
        }
        setIsSavingPassword(true);
        try {
            await api.profile.updatePassword({
                currentPassword,
                newPassword
            });
            toast.success(t('profile.successPassword'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('profile.instructorTitle')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('profile.instructorSubtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="flex-1 sm:flex-none">
                        {isSavingProfile ? t('profile.saving') : <><Save size={16} className="mr-2" /> {t('profile.saveProfile')}</>}
                    </Button>
                </div>
            </motion.div>

            <div className="space-y-6">
                {/* Header & Avatar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                    {/* Cover Photo */}
                    <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-600 to-purple-600 relative group">
                        <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="flex items-center gap-2 text-white font-medium bg-black/50 px-4 py-2 rounded-lg">
                                <Camera size={18} /> {t('profile.updateCover')}
                            </span>
                        </button>
                    </div>

                    <div className="px-6 sm:px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -mt-12 sm:-mt-16 mb-4 flex items-end gap-4">
                            <div className="relative inline-block group cursor-pointer" onClick={() => document.getElementById('instructor-avatar-upload').click()}>
                                <img
                                    src={avatar}
                                    alt="Profile"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-slate-900 bg-white transition-opacity group-hover:opacity-75"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                    <Camera size={24} className="text-white drop-shadow-md" />
                                </div>
                                <input type="file" id="instructor-avatar-upload" className="hidden" accept="image/*" onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => setAvatar(event.target.result);
                                        reader.readAsDataURL(e.target.files[0]);
                                                toast.success(t('profile.photoUpdated'));
                                            }
                                        }} />
                            </div>
                                    <div className="mt-2 mb-4 flex gap-2 flex-wrap">
                                        <Button onClick={() => document.getElementById('instructor-avatar-upload').click()} size="sm">
                                            {t('profile.updatePhoto')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 dark:border-red-900/30 dark:hover:border-red-800/50"
                                            onClick={() => {
                                                setAvatar("https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "Instructor") + "&background=random&size=128");
                                                toast.success(t('profile.photoRemoved'));
                                            }}
                                        >
                                            {t('profile.removePhoto')}
                                        </Button>
                                    </div>
                        </div>

                        {/* Basic Info Quick Edit */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.fullName')}</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.email')}</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.headline')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Briefcase size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        placeholder={t('profile.headlinePlaceholder')}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bio & About Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="text-primary w-5 h-5" /> {t('profile.bio')}
                    </h2>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                            {t('profile.bioHint')}
                        </p>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="5"
                            placeholder={t('profile.bioPlaceholder')}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-y"
                        />
                    </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <LinkIcon className="text-primary w-5 h-5" /> {t('profile.socials')}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.website')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Globe size={16} />
                                </span>
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder={t('profile.website')}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.linkedin')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Linkedin size={16} />
                                </span>
                                <input
                                    type="url"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    placeholder={t('profile.linkedin')}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('profile.twitter')}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Twitter size={16} />
                                </span>
                                <input
                                    type="url"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    placeholder={t('profile.twitter')}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Password & Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Shield className="text-primary w-5 h-5" /> {t('profile.changePassword')}
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
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
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
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
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
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
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

export default InstructorProfilePage;
