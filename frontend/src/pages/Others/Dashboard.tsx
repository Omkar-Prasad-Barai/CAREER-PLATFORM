import { useState, useEffect } from 'react';
import { FileText, Users, User, Pencil, Globe, Linkedin, Target, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/Dashboard/DashboardLayout';
import type { SidebarItem } from '../../components/layout/Dashboard/Sidebar';
import PostOpportunityForm from './components/PostOpportunityForm';
import SharedAccountSettings from '../../components/layout/Dashboard/SharedAccountSettings';
import SharedApplicationsList from '../../components/layout/Dashboard/SharedApplicationsList';
import InitialsAvatar from '../../components/ui/InitialsAvatar';
import ResumeDragDrop from '../../components/profile/ResumeDragDrop';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { updateUserProfile, uploadResume } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const OthersDashboard = () => {
    const { user, updateUser } = useAuth();
    const [activeView, setActiveView] = useState('post-form');

    // Profile state

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [tagline, setTagline] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields
    const [lookingFor, setLookingFor] = useState('');

    useEffect(() => {
        if (user) {
            setLookingFor((user as any).lookingFor || '');
            setBio((user as any).bio || '');
            setTagline((user as any).tagline || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            let resumeData: Record<string, unknown> = {};
            if (resumeFile) { const res = await uploadResume(resumeFile); resumeData = { resume: res.resumeUrl }; setResumeFile(null); }
            const profileData: Record<string, unknown> = { tagline, bio, lookingFor };
            const updated = await updateUserProfile(profileData);
            updateUser({ ...updated, ...resumeData });
            setEditingField(null);
            toast.success('Profile saved successfully!');
        } catch {
            toast.error('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Responses state
    const [responsesData, setResponsesData] = useState<any[]>([]);

    const handleStatusChange = (id: number, newStatus: string) => {
        setResponsesData(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    const sidebarItems: SidebarItem[] = [
        { icon: FileText, label: 'Post Forms/Surveys', href: '#', onClick: () => setActiveView('post-form') },
        { icon: Users, label: 'View Responses', href: '#', onClick: () => setActiveView('responses') },
        { icon: User, label: 'Researcher Profile', href: '#', onClick: () => setActiveView('profile') },
    ];

    const VIEW_TO_LABEL: Record<string, string> = {
        'post-form': 'Post Forms/Surveys', responses: 'View Responses', profile: 'Researcher Profile', settings: 'Account Settings',
    };
    const activeViewLabel = VIEW_TO_LABEL[activeView] || 'Post Forms/Surveys';

    return (
        <DashboardLayout sidebarItems={sidebarItems} role="others" onSettingsClick={() => setActiveView('settings')} activeViewLabel={activeViewLabel} onOverviewClick={() => setActiveView('post-form')}>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeView === 'post-form' && <PostOpportunityForm />}
                {activeView === 'responses' && (
                     <SharedApplicationsList 
                        title="Volunteer Responses"
                        data={responsesData}
                        columns={[
                            { header: "Name", accessor: "name", className: "font-semibold text-gray-900" },
                            { header: "Opportunity", accessor: "task", className: "text-gray-600" },
                            { header: "Date", accessor: "date", className: "text-gray-500" },
                            { 
                                header: "Status", 
                                accessor: (item) => (
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-medium",
                                        item.status === 'Selected' ? "bg-green-100 text-green-800" :
                                        item.status === 'Rejected' ? "bg-red-100 text-red-800" :
                                        "bg-yellow-100 text-yellow-800"
                                    )}>
                                        {item.status}
                                    </span>
                                )
                            }
                        ]}
                        actions={(item) => (
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => handleStatusChange(item.id, 'Reviewing')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-50 text-yellow-800 hover:bg-yellow-100 transition-colors">
                                    Review
                                </button>
                                <button onClick={() => handleStatusChange(item.id, 'Selected')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-800 hover:bg-green-100 transition-colors">
                                    Select
                                </button>
                                <button onClick={() => handleStatusChange(item.id, 'Rejected')} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-800 hover:bg-red-100 transition-colors">
                                    Reject
                                </button>
                            </div>
                        )}
                    />
                )}

                {activeView === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section 1 — Hero Card */}
                        <div className="backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 shadow-glow-indigo">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <InitialsAvatar fullName={user?.fullName || 'Researcher'} size="lg" />
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{user?.fullName || 'Researcher'}</h2>
                                    <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold capitalize mb-2">
                                        Researcher / Community
                                    </span>
                                    <p className="text-slate-500 text-sm mb-3">{user?.email || ''}</p>
                                    <input
                                        type="text"
                                        value={tagline}
                                        onChange={(e) => setTagline(e.target.value)}
                                        placeholder="Write a short tagline about your research focus..."
                                        className="w-full max-w-md px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2 — Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Card 1 — Purpose / Looking For */}
                            <div className="bg-gradient-to-br from-white to-sky-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'purpose' ? null : 'purpose')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Purpose</h3>
                                </div>
                                <p className="text-slate-600 text-sm">{(user as any)?.lookingFor || 'Purpose not specified'}</p>
                            </div>

                            {/* Card 2 — Research Focus */}
                            <div className="bg-gradient-to-br from-white to-indigo-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'focus' ? null : 'focus')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Research Focus</h3>
                                </div>
                                <p className="text-slate-500 text-sm">Conducting research and community engagement to drive social impact.</p>
                            </div>

                            {/* Card 3 — Activity Stats */}
                            <div className="bg-gradient-to-br from-white to-violet-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Activity</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-2xl font-bold text-indigo-600">0</p>
                                        <p className="text-slate-400 text-xs">Active Surveys</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-indigo-600">0</p>
                                        <p className="text-slate-400 text-xs">Total Responses</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 — About Me (Full Width) */}
                            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group md:col-span-2 lg:col-span-3">
                                <button
                                    onClick={() => setEditingField(editingField === 'about' ? null : 'about')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">About Me</h3>
                                </div>
                                {editingField === 'about' ? (
                                    <div>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value.slice(0, 300))}
                                            placeholder="Describe your research interests, affiliations, and goals..."
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                                        />
                                        <p className="text-xs text-gray-500 text-right mt-1">{bio.length}/300</p>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm">{bio || 'No bio added yet. Click the pencil icon to add one.'}</p>
                                )}
                            </div>
                        </div>

                        {/* Section 3 — Document Upload */}
                        <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-semibold text-slate-800">Resume / CV</h3>
                            </div>
                            <ResumeDragDrop
                                existingResume={(user as any)?.resume}
                                onFileSelect={setResumeFile}
                            />
                        </div>

                        {/* Links Section */}
                        <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-white to-slate-50 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">Links</h3>
                            <div className="flex flex-wrap gap-6">
                                <a href="#" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors duration-200">
                                    <Linkedin className="w-5 h-5" /> LinkedIn Profile
                                </a>
                                <a href="#" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors duration-200">
                                    <Globe className="w-5 h-5" /> Personal Website
                                </a>
                            </div>
                        </div>

                    {/* Save Profile Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>) : 'Save Profile'}
                        </button>
                    </div>
                </div>
                )}

                {activeView === 'settings' && <SharedAccountSettings />}
            </div>
        </DashboardLayout>
    );
};

export default OthersDashboard;
