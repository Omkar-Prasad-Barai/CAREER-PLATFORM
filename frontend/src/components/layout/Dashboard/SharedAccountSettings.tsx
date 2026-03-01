import { useState } from 'react';
import { Lock, Trash2, Mail, Phone, MapPin, User, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import InitialsAvatar from '../../ui/InitialsAvatar';


const SharedAccountSettings = () => {
    const { user } = useAuth();
    const [email] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);


    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Settings saved successfully!');
        }, 1000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile Information', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold mb-2">Account Settings</h2>
                    <p className="text-blue-100 max-w-lg">Manage your private account details, security preferences, and personalize your experience.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Tabs Sidebar */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-row md:flex-col overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-blue-50 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <tab.icon className={clsx("w-5 h-5", activeTab === tab.id ? "text-blue-600" : "text-gray-400")} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Tab Content */}
                <div className="flex-1 space-y-6">
                    {/* Profile Information Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Avatar Section — CSS Initials */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <InitialsAvatar fullName={user?.fullName || 'User'} size="lg" className="w-20 h-20 text-2xl" />
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{user?.fullName || 'User'}</h3>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                    <span className="inline-block mt-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-400" />
                                    Personal Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" /> Official Email
                                        </label>
                                        <input 
                                            type="email" 
                                            disabled 
                                            value={email}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" 
                                        />
                                        <p className="text-xs text-gray-500">Email cannot be changed directly. Contact support.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                                        </label>
                                        <input 
                                            type="tel" 
                                            placeholder="+1 (555) 000-0000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300" 
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" /> Address
                                        </label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Full address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300 resize-none" 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-gray-100 pt-6">
                                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 flex items-center gap-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm disabled:opacity-75 disabled:cursor-not-allowed">
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                    Change Password
                                </h3>
                                
                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Current Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">New Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300" 
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-start border-t border-gray-100 pt-6">
                                    <button 
                                        onClick={() => {
                                            if (!currentPassword || !newPassword || !confirmPassword) {
                                                toast.error('Please fill in all password fields.');
                                                return;
                                            }
                                            if (newPassword !== confirmPassword) {
                                                toast.error('New passwords do not match.');
                                                return;
                                            }
                                            setIsSaving(true);
                                            setTimeout(() => {
                                                setCurrentPassword('');
                                                setNewPassword('');
                                                setConfirmPassword('');
                                                setIsSaving(false);
                                                toast.success('Password updated successfully!');
                                            }, 1000);
                                        }} 
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isSaving ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-indigo-500" />
                                    Two-Factor Authentication (2FA)
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                                <button onClick={() => toast.success('2FA Setup initiated')} className="px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all font-semibold shadow-sm">
                                    Enable 2FA
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 p-6 md:p-8 rounded-2xl border border-red-100 space-y-4 mt-8">
                                <h3 className="text-xl font-bold text-red-900 flex items-center gap-2">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                    Danger Zone
                                </h3>
                                <p className="text-red-700 text-sm">
                                    Once you delete your account, there is no going back. Please be certain. All your data, applications, and settings will be permanently removed.
                                </p>
                                <button onClick={() => toast.error('Account deletion requested')} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold shadow-sm shadow-red-200">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedAccountSettings;
