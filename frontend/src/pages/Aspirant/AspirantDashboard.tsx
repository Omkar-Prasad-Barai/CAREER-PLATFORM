import { useState, useEffect } from 'react';
import { MapPin, IndianRupee, Clock, FileText, User, Bookmark, Layout, Heart, Github, Linkedin, Globe, Loader2, AlertCircle, CheckCircle2, GraduationCap, Briefcase, Code, Pencil, X, LayoutDashboard } from 'lucide-react';
import SharedAccountSettings from '../../components/layout/Dashboard/SharedAccountSettings';
import SharedApplicationsList from '../../components/layout/Dashboard/SharedApplicationsList';
import DashboardLayout from '../../components/layout/Dashboard/DashboardLayout';
import type { SidebarItem } from '../../components/layout/Dashboard/Sidebar';
import OpportunityDetailsModal from './components/OpportunityDetailsModal';
import InitialsAvatar from '../../components/ui/InitialsAvatar';
import ResumeDragDrop from '../../components/profile/ResumeDragDrop';
import FilterDrawer from '../../components/dashboard/FilterDrawer';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getOpportunities, requestConnection, updateUserProfile, uploadResume } from '../../services/apiService';
import type { Opportunity } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import DashboardOverview from '../../components/dashboard/DashboardOverview';

const OpportunityCard = ({ opportunity, onApply, onViewDetails, isApplied, isApplying }: {
  opportunity: Opportunity;
  onApply: () => void;
  onViewDetails: () => void;
  isApplied: boolean;
  isApplying: boolean;
}) => {
    const facilitator = typeof opportunity.facilitatorId === 'object' ? opportunity.facilitatorId : null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{opportunity.title}</h3>
                    <p className="text-gray-600">{facilitator?.fullName || 'Organization'}</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                    {opportunity.jobType || opportunity.category}
                </span>
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {opportunity.jobType || 'Not specified'}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    {opportunity.stipendOrSalary || 'Not disclosed'}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(opportunity.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            </div>

            {opportunity.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {opportunity.skillsRequired.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs font-medium rounded border border-slate-100">{skill}</span>
                    ))}
                    {opportunity.skillsRequired.length > 4 && (
                        <span className="text-xs text-slate-400 self-center">+{opportunity.skillsRequired.length - 4}</span>
                    )}
                </div>
            )}

            <div className="flex gap-3 mt-4">
                <button 
                    onClick={onApply}
                    disabled={isApplied || isApplying}
                    className={clsx(
                        "flex-1 py-2.5 rounded-xl transition-all font-medium text-sm shadow-sm flex items-center justify-center gap-1.5",
                        isApplied 
                            ? "bg-green-50 text-green-700 border border-green-200 cursor-default" 
                            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    )}
                >
                    {isApplying ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Applying...</>
                    ) : isApplied ? (
                        <><CheckCircle2 className="w-4 h-4" /> Applied (Pending)</>
                    ) : (
                        'Apply Now'
                    )}
                </button>
                <button 
                    onClick={onViewDetails}
                    className="flex-1 border border-blue-600 text-blue-600 py-2.5 rounded-xl hover:bg-blue-50 transition-all font-medium text-sm"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

const AspirantDashboard = () => {
    const { user, updateUser } = useAuth();
    const [activeView, setActiveView] = useState('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('all');

    // Real API state
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [isLoadingOpps, setIsLoadingOpps] = useState(true);
    const [oppsError, setOppsError] = useState<string | null>(null);
    const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
    const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());

    // Filter drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCompensation, setSelectedCompensation] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Profile state

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [tagline, setTagline] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [profileSkills, setProfileSkills] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Editable field state
    const [collegeName, setCollegeName] = useState('');
    const [degree, setDegree] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [experience, setExperience] = useState('');

    // Initialize from user data
    useEffect(() => {
        if (user) {
            if (Array.isArray((user as any).skills)) setProfileSkills((user as any).skills);
            setCollegeName((user as any).collegeName || '');
            setDegree((user as any).degree || '');
            setGraduationYear((user as any).graduationYear || '');
            setExperience((user as any).experience || '');
            setBio((user as any).bio || '');
            setTagline((user as any).tagline || '');
        }
    }, [user]);

    const sidebarItems: SidebarItem[] = [
        { icon: LayoutDashboard, label: 'Overview', href: '#', onClick: () => setActiveView('overview') },
        { icon: Layout, label: 'Opportunities', href: '#', onClick: () => setActiveView('dashboard') },
        { icon: Bookmark, label: 'My Applications', href: '#', onClick: () => setActiveView('applications') },
        { icon: User, label: 'My Profile', href: '#', onClick: () => setActiveView('profile') },
    ];

    const VIEW_TO_LABEL: Record<string, string> = {
        overview: 'Overview', dashboard: 'Opportunities', applications: 'My Applications', profile: 'My Profile', settings: 'Account Settings',
    };
    const activeViewLabel = VIEW_TO_LABEL[activeView] || 'Overview';

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setIsLoadingOpps(true);
                setOppsError(null);
                const data = await getOpportunities();
                setOpportunities(data);
            } catch (err: unknown) {
                const msg = axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to load opportunities.' : 'An unexpected error occurred.';
                setOppsError(msg);
                toast.error(msg);
            } finally {
                setIsLoadingOpps(false);
            }
        };
        fetchOpportunities();
    }, []);

    const handleApply = async (opportunity: Opportunity) => {
        const facilitator = typeof opportunity.facilitatorId === 'object' ? opportunity.facilitatorId : null;
        const facilitatorId = facilitator?._id || (opportunity.facilitatorId as string);

        setApplyingIds(prev => new Set(prev).add(opportunity._id));
        try {
            await requestConnection(facilitatorId, opportunity._id);
            toast.success('Application sent to Admin for approval!');
            setAppliedIds(prev => new Set(prev).add(opportunity._id));
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to apply.' : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setApplyingIds(prev => { const next = new Set(prev); next.delete(opportunity._id); return next; });
        }
    };

    const handleViewDetails = (opportunity: any) => {
        setSelectedOpportunity(opportunity);
        setIsModalOpen(true);
    };

    const myApplications = opportunities
        .filter(opp => appliedIds.has(opp._id))
        .map(opp => ({
            id: opp._id,
            title: opp.title,
            company: typeof opp.facilitatorId === 'object' ? opp.facilitatorId.fullName : 'Organization',
            status: 'Pending',
            date: 'Just now',
        }));

    const filterByTab = (tab: string) => {
        let filtered = opportunities;

        if (tab !== 'all') {
            filtered = filtered.filter(opp => {
                const jt = (opp.jobType || '').toLowerCase();
                const cat = (opp.category || '').toLowerCase();
                if (tab === 'internship') return jt.includes('intern') || cat.includes('intern');
                if (tab === 'job') return jt.includes('full') || jt.includes('contract') || cat.includes('job') || (!jt.includes('intern') && !jt.includes('part'));
                if (tab === 'part-time') return jt.includes('part') || cat.includes('part');
                return true;
            });
        }

        // Apply drawer filters
        if (selectedTypes.length > 0) {
            filtered = filtered.filter(opp => {
                const jt = (opp.jobType || '').toLowerCase();
                return selectedTypes.some(t => jt.includes(t.toLowerCase()));
            });
        }

        if (selectedSkills.length > 0) {
            filtered = filtered.filter(opp =>
                selectedSkills.some(skill =>
                    opp.skillsRequired.some(s => s.toLowerCase().includes(skill.toLowerCase()))
                )
            );
        }

        return filtered;
    };

    // Build active filters for display
    const activeFilters = [...selectedTypes, ...selectedCompensation, ...selectedSkills];

    const removeFilter = (filter: string) => {
        setSelectedTypes(prev => prev.filter(f => f !== filter));
        setSelectedCompensation(prev => prev.filter(f => f !== filter));
        setSelectedSkills(prev => prev.filter(f => f !== filter));
    };

    const clearAllFilters = () => {
        setSelectedTypes([]);
        setSelectedCompensation([]);
        setSelectedSkills([]);
    };

    const filteredOpportunities = filterByTab(activeTab);

    const addProfileSkill = () => {
        const trimmed = newSkill.trim();
        if (trimmed && !profileSkills.includes(trimmed)) {
            setProfileSkills(prev => [...prev, trimmed]);
        }
        setNewSkill('');
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            let resumeData: Record<string, unknown> = {};
            if (resumeFile) { const res = await uploadResume(resumeFile); resumeData = { resume: res.resumeUrl }; setResumeFile(null); }
            const profileData: Record<string, unknown> = { tagline, bio, skills: profileSkills, collegeName, degree, graduationYear, experience };
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

    return (
        <DashboardLayout sidebarItems={sidebarItems} role="aspirant" onSettingsClick={() => setActiveView('settings')} activeViewLabel={activeViewLabel} onOverviewClick={() => setActiveView('overview')}>

            {activeView === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <DashboardOverview />
                </div>
            )}

            {activeView === 'dashboard' && (
                <>
                    <div className="flex overflow-x-auto pb-4 gap-4 mb-6 no-scrollbar">
                        {[
                            { id: 'all', label: 'All Opportunities' },
                            { id: 'internship', label: 'Internships' },
                            { id: 'job', label: 'Jobs' },
                            { id: 'part-time', label: 'Part-Time' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border-2",
                                    activeTab === tab.id 
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" 
                                        : "bg-white text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Filter Trigger Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                        <p className="text-sm text-gray-400">
                            Showing <span className="text-gray-900 font-semibold">{filteredOpportunities.length}</span> opportunities
                        </p>

                        <div className="flex items-center gap-3 flex-wrap justify-end">
                            {activeFilters.map((filter) => (
                                <span
                                    key={filter}
                                    className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs px-3 py-1 rounded-full"
                                >
                                    {filter}
                                    <button onClick={() => removeFilter(filter)} className="text-indigo-400 hover:text-indigo-700">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}

                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                                </svg>
                                Filters
                                {activeFilters.length > 0 && (
                                    <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Opportunities Grid (full width) */}
                    <div className="w-full">
                        {isLoadingOpps ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <span className="ml-3 text-slate-500 font-medium">Loading opportunities...</span>
                            </div>
                        ) : oppsError ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                                <p className="font-medium">{oppsError}</p>
                            </div>
                        ) : filteredOpportunities.length === 0 ? (
                            <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                <p>No opportunities found for this category.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {filteredOpportunities.map((opp) => (
                                    <OpportunityCard 
                                        key={opp._id}
                                        opportunity={opp}
                                        onApply={() => handleApply(opp)}
                                        onViewDetails={() => handleViewDetails(opp)}
                                        isApplied={appliedIds.has(opp._id)}
                                        isApplying={applyingIds.has(opp._id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter Drawer */}
                    <FilterDrawer
                        isOpen={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        selectedTypes={selectedTypes}
                        setSelectedTypes={setSelectedTypes}
                        selectedCompensation={selectedCompensation}
                        setSelectedCompensation={setSelectedCompensation}
                        selectedSkills={selectedSkills}
                        setSelectedSkills={setSelectedSkills}
                        onApply={() => {}}
                        onClear={clearAllFilters}
                    />
                </>
            )}

            {activeView === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Section 1 — Hero Card */}
                    <div className="backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 shadow-glow-indigo">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <InitialsAvatar fullName={user?.fullName || 'Aspirant'} size="lg" />
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-slate-800 mb-1">{user?.fullName || 'Aspirant'}</h2>
                                <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold capitalize mb-2">
                                    Aspirant
                                </span>
                                <p className="text-slate-500 text-sm mb-3">{user?.email || ''}</p>
                                <input
                                    type="text"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    placeholder="Write a short tagline about yourself..."
                                    className="w-full max-w-md px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2 — Info Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Card 1 — Education */}
                        <div className="bg-gradient-to-br from-white to-sky-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                            <button
                                onClick={() => setEditingField(editingField === 'education' ? null : 'education')}
                                className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-semibold text-slate-800">Education</h3>
                            </div>
                            {editingField === 'education' ? (
                                <div className="space-y-2">
                                    <input type="text" value={collegeName} onChange={e => setCollegeName(e.target.value)} placeholder="College Name" className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                                    <input type="text" value={degree} onChange={e => setDegree(e.target.value)} placeholder="Degree / Course" className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                                    <input type="text" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} placeholder="Graduation Year" className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-600 text-sm">{collegeName || 'College not specified'}</p>
                                    <p className="text-slate-500 text-xs mt-1">{degree || 'Degree not specified'}</p>
                                    <p className="text-slate-400 text-xs mt-1">Graduation: {graduationYear || '—'}</p>
                                </>
                            )}
                        </div>

                        {/* Card 2 — Skills */}
                        <div className="bg-gradient-to-br from-white to-indigo-50/60 border border-slate-200 rounded-xl p-5 shadow-glow-sky card-premium relative group">
                            <button
                                onClick={() => setEditingField(editingField === 'skills' ? null : 'skills')}
                                className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-2 mb-3">
                                <Code className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-semibold text-slate-800">Skills</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profileSkills.map((skill, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs shadow-sm shadow-indigo-100/50">
                                        {skill}
                                        {editingField === 'skills' && (
                                            <button
                                                onClick={() => setProfileSkills(prev => prev.filter((_, idx) => idx !== i))}
                                                className="ml-1.5 text-indigo-400 hover:text-indigo-700"
                                            >×</button>
                                        )}
                                    </span>
                                ))}
                                {profileSkills.length === 0 && (
                                    <span className="text-slate-500 text-xs">No skills added yet</span>
                                )}
                            </div>
                            {editingField === 'skills' && (
                                <div className="mt-3 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addProfileSkill(); } }}
                                        placeholder="+ Add Skill"
                                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Card 3 — Experience */}
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
                            {editingField === 'experience' ? (
                                <textarea value={experience} onChange={e => setExperience(e.target.value)} placeholder="Describe your experience..." rows={2} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                            ) : (
                                <p className="text-slate-500 text-sm">{experience || 'No experience listed yet'}</p>
                            )}
                        </div>

                        {/* Card 4 — About Me */}
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
                                        placeholder="Write something about yourself..."
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

                    {/* Section 3 — Resume Upload */}
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
                            <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:underline font-medium transition-colors duration-200">
                                <Github className="w-5 h-5" /> GitHub Portfolio
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

            {activeView === 'applications' && (
                <SharedApplicationsList 
                    title="My Applications"
                    data={myApplications}
                    columns={[
                        { header: "Role", accessor: "title", className: "font-semibold text-gray-900" },
                        { header: "Company", accessor: "company", className: "text-gray-600" },
                        { 
                            header: "Status", 
                            accessor: (item: any) => (
                                <span className={clsx(
                                    "px-3 py-1 rounded-full text-xs font-medium",
                                    item.status === 'Approved' ? "bg-green-100 text-green-800" :
                                    item.status === 'Rejected' ? "bg-red-100 text-red-800" :
                                    "bg-yellow-100 text-yellow-800"
                                )}>
                                    {item.status}
                                </span>
                            )
                        }
                    ]}
                    actions={() => null}
                />
            )}

            <OpportunityDetailsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                opportunity={selectedOpportunity}
                onApply={() => {
                    if (selectedOpportunity) handleApply(selectedOpportunity);
                }}
            />
        </DashboardLayout>
    );
};

export default AspirantDashboard;
