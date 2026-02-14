import { useState, useEffect } from 'react';
import { Users, User, PlusCircle, FileText, Pencil, Briefcase, Code, Phone, Globe, Linkedin, Building2, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/Dashboard/DashboardLayout';
import type { SidebarItem } from '../../components/layout/Dashboard/Sidebar';
import PostGigForm from './components/PostGigForm';
import SharedAccountSettings from '../../components/layout/Dashboard/SharedAccountSettings';
import SharedApplicationsList from '../../components/layout/Dashboard/SharedApplicationsList';
import ManageOurPosts from '../../components/layout/Dashboard/ManageOurPosts';
import InitialsAvatar from '../../components/ui/InitialsAvatar';
import ResumeDragDrop from '../../components/profile/ResumeDragDrop';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { updateUserProfile, uploadResume } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const ProfessionalDashboard = () => {
    const { user, updateUser } = useAuth();
    const [activeView, setActiveView] = useState('post-gig');

    // Profile state

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [tagline, setTagline] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [keySkills, setKeySkills] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields
    const [professionTitle, setProfessionTitle] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [experience, setExperience] = useState('');

    useEffect(() => {
        if (user) {
            if (Array.isArray((user as any).keySkills)) setKeySkills((user as any).keySkills);
            setProfessionTitle((user as any).professionTitle || '');
            setOrganizationName((user as any).organizationName || '');
            setContactNumber((user as any).contactNumber || '');
            setExperience((user as any).experience || '');
            setBio((user as any).bio || '');
            setTagline((user as any).tagline || '');
        }
    }, [user]);

    const addKeySkill = () => {
        const trimmed = newSkill.trim();
        if (trimmed && !keySkills.includes(trimmed)) {
            setKeySkills(prev => [...prev, trimmed]);
        }
        setNewSkill('');
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            let resumeData: Record<string, unknown> = {};
            if (resumeFile) { const res = await uploadResume(resumeFile); resumeData = { resume: res.resumeUrl }; setResumeFile(null); }
            const profileData: Record<string, unknown> = { tagline, bio, keySkills, professionTitle, organizationName, contactNumber, experience };
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

    // Applications state
    const [helpersData, setHelpersData] = useState<any[]>([]);

    const handleStatusChange = (id: number, newStatus: string) => {
        setHelpersData(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    const sidebarItems: SidebarItem[] = [
        { icon: PlusCircle, label: 'Post a Gig / Task', href: '#', onClick: () => setActiveView('post-gig') },
        { icon: PlusCircle, label: 'Manage Our Posts', href: '#', onClick: () => setActiveView('manage-posts') },
        { icon: Users, label: 'View Helpers Applied', href: '#', onClick: () => setActiveView('view-helpers') },
        { icon: User, label: 'Our Professional Profile', href: '#', onClick: () => setActiveView('profile') },
    ];

    const VIEW_TO_LABEL: Record<string, string> = {
        'post-gig': 'Post a Gig / Task', 'manage-posts': 'Manage Our Posts',
        'view-helpers': 'View Helpers Applied', profile: 'Our Professional Profile', settings: 'Account Settings',
    };
    const activeViewLabel = VIEW_TO_LABEL[activeView] || 'Post a Gig / Task';

    return (
        <DashboardLayout sidebarItems={sidebarItems} role="professional" onSettingsClick={() => setActiveView('settings')} activeViewLabel={activeViewLabel} onOverviewClick={() => setActiveView('post-gig')}>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeView === 'post-gig' && <PostGigForm />}
                {activeView === 'manage-posts' && <ManageOurPosts />}
                {activeView === 'view-helpers' && (
                    <SharedApplicationsList 
                        title="Helpers Applied"
                        data={helpersData}
                        columns={[
                            { header: "Helper Name", accessor: "name", className: "font-semibold text-gray-900" },
                            { header: "Skills", accessor: "skills", className: "text-gray-600" },
                            { header: "Rate", accessor: "rate", className: "text-gray-500" },
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
                                <InitialsAvatar fullName={user?.fullName || 'Professional'} size="lg" />
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{user?.fullName || 'Professional'}</h2>
                                    <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold capitalize mb-2">
                                        Professional
                                    </span>
                                    <p className="text-slate-500 text-sm mb-3">{user?.email || ''}</p>
                                    <input
                                        type="text"
                                        value={tagline}
                                        onChange={(e) => setTagline(e.target.value)}
                                        placeholder="Write a short tagline about your expertise..."
                                        className="w-full max-w-md px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2 — Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Card 1 — Professional Details */}
                            <div className="bg-gradient-to-br from-white to-sky-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'details' ? null : 'details')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Professional Details</h3>
                                </div>
                                <p className="text-slate-600 text-sm">{(user as any)?.professionTitle || 'Title not specified'}</p>
                                <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> {(user as any)?.organizationName || 'Organization not specified'}
                                </p>
                                <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {(user as any)?.contactNumber || 'No phone'}
                                </p>
                            </div>

                            {/* Card 2 — Key Skills */}
                            <div className="bg-gradient-to-br from-white to-indigo-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'skills' ? null : 'skills')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <Code className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Key Skills</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {keySkills.map((skill, i) => (
                                        <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs shadow-sm shadow-indigo-100/50">
                                            {skill}
                                            {editingField === 'skills' && (
                                                <button
                                                    onClick={() => setKeySkills(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="ml-1.5 text-indigo-400 hover:text-indigo-700"
                                                >×</button>
                                            )}
                                        </span>
                                    ))}
                                    {keySkills.length === 0 && (
                                        <span className="text-slate-500 text-xs">No skills added yet</span>
                                    )}
                                </div>
                                {editingField === 'skills' && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeySkill(); } }}
                                            placeholder="+ Add Skill"
                                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Card 3 — Experience (Placeholder) */}
                            <div className="bg-gradient-to-br from-white to-violet-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'experience' ? null : 'experience')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Experience</h3>
                                </div>
                                <p className="text-slate-500 text-sm">Professional in {(user as any)?.professionTitle || 'their field'} with expertise across multiple domains.</p>
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
                                            placeholder="Write something about yourself and your professional journey..."
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

export default ProfessionalDashboard;
