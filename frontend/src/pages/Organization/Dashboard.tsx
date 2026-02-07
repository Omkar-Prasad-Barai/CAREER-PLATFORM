import { useState, useEffect } from 'react';
import { PlusCircle, Users, User, Search, FileText, Pencil, Building2, MapPin, Phone, Globe, Linkedin, Briefcase, LayoutDashboard, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/Dashboard/DashboardLayout';
import type { SidebarItem } from '../../components/layout/Dashboard/Sidebar';
import PostOpportunityForm from './components/PostOpportunityForm';
import SharedAccountSettings from '../../components/layout/Dashboard/SharedAccountSettings';
import SharedApplicationsList from '../../components/layout/Dashboard/SharedApplicationsList';
import ManageOurPosts from '../../components/layout/Dashboard/ManageOurPosts';
import BrowseTalent from '../../components/layout/Dashboard/BrowseTalent';
import OrgApplicationsList from './components/OrgApplicationsList';
import InitialsAvatar from '../../components/ui/InitialsAvatar';
import ResumeDragDrop from '../../components/profile/ResumeDragDrop';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { updateUserProfile, uploadResume } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const OrganizationDashboard = () => {
    const { user, updateUser } = useAuth();
    const [activeView, setActiveView] = useState('overview');

    // Profile state

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [tagline, setTagline] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [hiringSkills, setHiringSkills] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields for Organization
    const [companyName, setCompanyName] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [industry, setIndustry] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [yearEstablished, setYearEstablished] = useState('');
    const [hqLocation, setHqLocation] = useState('');
    const [address, setAddress] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [hrName, setHrName] = useState('');

    useEffect(() => {
        if (user) {
            if (Array.isArray((user as any).hiringFor)) setHiringSkills((user as any).hiringFor);
            setCompanyName((user as any).companyName || '');
            setCompanyType((user as any).companyType || '');
            setIndustry((user as any).industry || '');
            setCompanySize((user as any).companySize || '');
            setYearEstablished((user as any).yearEstablished || '');
            setHqLocation((user as any).hqLocation || '');
            setAddress((user as any).address || '');
            setContactPhone((user as any).contactPhone || '');
            setHrName((user as any).hrName || '');
            setBio((user as any).bio || '');
            setTagline((user as any).tagline || '');
        }
    }, [user]);

    const addHiringSkill = () => {
        const trimmed = newSkill.trim();
        if (trimmed && !hiringSkills.includes(trimmed)) {
            setHiringSkills(prev => [...prev, trimmed]);
        }
        setNewSkill('');
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            let resumeData: Record<string, unknown> = {};
            if (resumeFile) { const res = await uploadResume(resumeFile); resumeData = { resume: res.resumeUrl }; setResumeFile(null); }
            const profileData: Record<string, unknown> = {
                tagline, bio, hiringFor: hiringSkills,
                companyName, companyType, industry, companySize, yearEstablished,
                hqLocation, address, contactPhone, hrName,
            };
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

    const sidebarItems: SidebarItem[] = [
        { icon: LayoutDashboard, label: 'Overview', href: '#', onClick: () => setActiveView('overview') },
        { icon: PlusCircle, label: 'Post Opportunity', href: '#', onClick: () => setActiveView('post') },
        { icon: PlusCircle, label: 'Manage Our Posts', href: '#', onClick: () => setActiveView('manage-posts') },
        { icon: Users, label: 'Applications', href: '#', onClick: () => setActiveView('applications') },
        { icon: Search, label: 'Browse Talent', href: '#', onClick: () => setActiveView('browse-talent') },
        { icon: User, label: 'Our Profile', href: '#', onClick: () => setActiveView('profile') },
    ];

    const VIEW_TO_LABEL: Record<string, string> = {
        overview: 'Overview', post: 'Post Opportunity', 'manage-posts': 'Manage Our Posts',
        applications: 'Applications', 'browse-talent': 'Browse Talent', profile: 'Our Profile', settings: 'Account Settings',
    };
    const activeViewLabel = VIEW_TO_LABEL[activeView] || 'Overview';

    return (
        <DashboardLayout sidebarItems={sidebarItems} role="organization" onSettingsClick={() => setActiveView('settings')} activeViewLabel={activeViewLabel} onOverviewClick={() => setActiveView('overview')}>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeView === 'overview' && <DashboardOverview />}
                {activeView === 'post' && <PostOpportunityForm />}
                {activeView === 'manage-posts' && <ManageOurPosts />}
                {activeView === 'applications' && <OrgApplicationsList />}
                {activeView === 'browse-talent' && <BrowseTalent />}

                {activeView === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section 1 — Hero Card */}
                        <div className="backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 shadow-glow-indigo">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <InitialsAvatar fullName={(user as any)?.companyName || user?.fullName || 'Organization'} size="lg" />
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{(user as any)?.companyName || user?.fullName || 'Organization'}</h2>
                                    <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold capitalize mb-2">
                                        Organization
                                    </span>
                                    <p className="text-slate-500 text-sm mb-3">{user?.email || ''}</p>
                                    <input
                                        type="text"
                                        value={tagline}
                                        onChange={(e) => setTagline(e.target.value)}
                                        placeholder="Write a short tagline about your organization..."
                                        className="w-full max-w-md px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2 — Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Card 1 — Company Details */}
                            <div className="bg-gradient-to-br from-white to-sky-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'company' ? null : 'company')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Company Details</h3>
                                </div>
                                <p className="text-slate-600 text-sm">{companyName || 'Company name not specified'}</p>
                                <p className="text-slate-500 text-xs mt-1">{companyType || 'Type not specified'} · {industry || 'Industry not specified'}</p>
                                <p className="text-slate-400 text-xs mt-1">Size: {companySize || '—'} · Est. {yearEstablished || '—'}</p>
                            </div>

                            {/* Card 2 — Location & Contact */}
                            <div className="bg-gradient-to-br from-white to-indigo-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'location' ? null : 'location')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Location & Contact</h3>
                                </div>
                                <p className="text-slate-600 text-sm">{hqLocation || 'HQ not specified'}</p>
                                <p className="text-slate-500 text-xs mt-1">{address || 'Address not specified'}</p>
                                <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {contactPhone || 'No phone'}
                                    <span className="mx-1">·</span>
                                    HR: {hrName || '—'}
                                </p>
                            </div>

                            {/* Card 3 — Hiring Interests */}
                            <div className="bg-gradient-to-br from-white to-violet-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                                <button
                                    onClick={() => setEditingField(editingField === 'hiring' ? null : 'hiring')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">Hiring Interests</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {hiringSkills.map((skill, i) => (
                                        <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs shadow-sm shadow-indigo-100/50">
                                            {skill}
                                            {editingField === 'hiring' && (
                                                <button
                                                    onClick={() => setHiringSkills(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="ml-1.5 text-indigo-400 hover:text-indigo-700"
                                                >×</button>
                                            )}
                                        </span>
                                    ))}
                                    {hiringSkills.length === 0 && (
                                        <span className="text-slate-500 text-xs">No hiring interests added yet</span>
                                    )}
                                </div>
                                {editingField === 'hiring' && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHiringSkill(); } }}
                                            placeholder="+ Add Role / Skill"
                                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Card 4 — About Organization (Full Width) */}
                            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group md:col-span-2 lg:col-span-3">
                                <button
                                    onClick={() => setEditingField(editingField === 'about' ? null : 'about')}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-slate-800">About Organization</h3>
                                </div>
                                {editingField === 'about' ? (
                                    <div>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value.slice(0, 300))}
                                            placeholder="Describe your organization, mission, and culture..."
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                                        />
                                        <p className="text-xs text-gray-500 text-right mt-1">{bio.length}/300</p>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm">{bio || 'No description added yet. Click the pencil icon to add one.'}</p>
                                )}
                            </div>
                        </div>

                        {/* Section 3 — Document Upload */}
                        <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-semibold text-slate-800">Company Pitch Deck</h3>
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
                                <a href={(user as any)?.websiteUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors duration-200">
                                    <Globe className="w-5 h-5" /> Company Website
                                </a>
                                <a href="#" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors duration-200">
                                    <Linkedin className="w-5 h-5" /> LinkedIn Page
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

export default OrganizationDashboard;
