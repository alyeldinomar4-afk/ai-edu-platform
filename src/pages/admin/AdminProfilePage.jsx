import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Camera, Lock, Save, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';

const AdminProfilePage = () => {
    const { user } = useAuth();

    // Basic Details
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [avatar, setAvatar] = useState(user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "Admin") + "&background=random");

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setTimeout(() => {
            setIsSavingProfile(false);
            toast.success('Admin profile updated successfully!');
        }, 1000);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }
        setIsSavingPassword(true);
        setTimeout(() => {
            setIsSavingPassword(false);
            toast.success('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your administrator account settings.</p>
                </div>
                <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Changes</>}
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Avatar and Basic Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="relative inline-block mb-4 group cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm transition-opacity group-hover:opacity-75"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                <Camera size={24} className="text-white drop-shadow-md" />
                            </div>
                            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => setAvatar(event.target.result);
                                    reader.readAsDataURL(e.target.files[0]);
                                    toast.success("Photo updated successfully!");
                                }
                            }} />
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <Button variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload').click()} className="w-full justify-center">
                                Update Photo
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-center text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 dark:border-red-900/30 dark:hover:border-red-800/50"
                                onClick={() => {
                                    setAvatar("https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "Admin") + "&background=random&size=128");
                                    toast.success("Photo removed successfully!");
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user?.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">System Administrator</p>
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit mx-auto">
                            <Shield size={12} /> Full Access
                        </div>
                    </div>
                </motion.div>

                {/* Form Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="text-primary" size={18} /> General Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Lock className="text-primary" size={18} /> Security
                        </h2>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}>
                                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
