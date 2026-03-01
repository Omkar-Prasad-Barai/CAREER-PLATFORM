import { useState } from 'react';
import { Save, KeyRound, Mail, Type, LayoutList, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const AdminSettings = () => {
    // Admin Account State
    const [adminEmail, setAdminEmail] = useState('admin@careerconnect.com');
    const [savedAccount, setSavedAccount] = useState(false);

    // CMS State
    const [bannerEnabled, setBannerEnabled] = useState(true);
    const [bannerText, setBannerText] = useState('Platform Update: New engineering internships just posted for Summer 2026!');
    const [heroHeading, setHeroHeading] = useState('Launch Your Career Forward');
    const [heroSubheding, setHeroSubheding] = useState('Connect with top organizations, find exclusive opportunities, and build your professional network today.');
    
    const [categories, setCategories] = useState([
        { id: 1, name: 'Software Engineering' },
        { id: 2, name: 'Data Science' },
        { id: 3, name: 'Product Management' },
        { id: 4, name: 'Design' }
    ]);
    const [newCategory, setNewCategory] = useState('');
    const [savedContent, setSavedContent] = useState(false);

    // Handlers
    const handleSaveAccount = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedAccount(true);
        setTimeout(() => setSavedAccount(false), 3000);
    };

    const handleSaveContent = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedContent(true);
        setTimeout(() => setSavedContent(false), 3000);
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setCategories([...categories, { id: Date.now(), name: newCategory.trim() }]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (id: number) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Platform Settings</h2>
                <p className="text-slate-500 text-sm mt-1">Manage your admin account and update global platform content.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SECTION A: Admin Account */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-indigo-500" />
                                Admin Credentials
                            </h3>
                        </div>
                        <form onSubmit={handleSaveAccount} className="p-5 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Admin Email</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="email" 
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">New Master Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                {savedAccount ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {savedAccount ? 'Saved!' : 'Update Credentials'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* SECTION B: Content Management (Minor Editing) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center bg-indigo-50/50 border-indigo-100">
                            <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                                <Type className="w-4 h-4 text-indigo-600" />
                                Content Management
                            </h3>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">Live Platform Editing</span>
                        </div>
                        
                        <form onSubmit={handleSaveContent} className="p-6 space-y-8">
                            
                            {/* Global Announcement Banner */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-800">Global Announcement Banner</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={bannerEnabled} onChange={(e) => setBannerEnabled(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        <span className="ml-3 text-sm font-medium text-slate-600">{bannerEnabled ? 'Active' : 'Hidden'}</span>
                                    </label>
                                </div>
                                <textarea 
                                    rows={2}
                                    value={bannerText}
                                    onChange={(e) => setBannerText(e.target.value)}
                                    disabled={!bannerEnabled}
                                    className={clsx(
                                        "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors",
                                        bannerEnabled ? "border-slate-300 text-slate-700" : "border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed"
                                    )}
                                />
                            </div>

                            <hr className="border-slate-100" />

                            {/* Hero Section Text */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-slate-800">Landing Page Hero Text</label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        value={heroHeading}
                                        onChange={(e) => setHeroHeading(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Main Heading"
                                    />
                                    <textarea 
                                        rows={2}
                                        value={heroSubheding}
                                        onChange={(e) => setHeroSubheding(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Subheading paragraph"
                                    />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Manage Categories */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                    <LayoutList className="w-4 h-4 text-slate-500" />
                                    Manage Platform Categories
                                </label>
                                <p className="text-xs text-slate-500 mb-2">Controls global dropdown options for 'Industry' and 'Role Focus'.</p>
                                
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder="Add new category..."
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 max-h-48 overflow-y-auto mt-3">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center justify-between px-3 py-2 hover:bg-white rounded-lg group transition-colors">
                                            <span className="text-sm text-slate-700 font-medium">{cat.name}</span>
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveCategory(cat.id)}
                                                className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {categories.length === 0 && <div className="p-4 text-center text-sm text-slate-500">No categories found.</div>}
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors mt-8"
                            >
                                {savedContent ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                {savedContent ? 'Content Published' : 'Publish Content Changes'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminSettings;
