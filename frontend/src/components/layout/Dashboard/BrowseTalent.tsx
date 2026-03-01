import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, Code, CheckCircle, Shield, Loader2, AlertCircle } from 'lucide-react';
import AdvancedFiltersSidebar from './AdvancedFiltersSidebar';
import toast from 'react-hot-toast';
import { getMaskedTalent, requestConnection } from '../../../services/apiService';
import type { MaskedTalent } from '../../../services/apiService';
import axios from 'axios';

const BrowseTalent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [talent, setTalent] = useState<MaskedTalent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());
    const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchTalent = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getMaskedTalent();
                setTalent(data);
            } catch (err: unknown) {
                const msg = axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to load talent pool.' : 'An unexpected error occurred.';
                setError(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTalent();
    }, []);

    const handleConnect = async (talentId: string) => {
        setConnectingIds(prev => new Set(prev).add(talentId));
        try {
            await requestConnection(talentId);
            toast.success(`Connection request for Talent #${talentId.slice(-4)} sent to Admin!`);
            setConnectedIds(prev => new Set(prev).add(talentId));
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to send request.' : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setConnectingIds(prev => { const next = new Set(prev); next.delete(talentId); return next; });
        }
    };

    // Helper to extract profile detail safely
    const getDetail = (profile: Record<string, unknown> | undefined, key: string): string => {
        if (!profile || !profile[key]) return '—';
        const val = profile[key];
        if (Array.isArray(val)) return val.join(', ');
        return String(val);
    };

    const getSkills = (profile: Record<string, unknown> | undefined): string[] => {
        if (!profile) return [];
        const skills = profile.skills || profile.topSkills || profile.keySkills;
        if (Array.isArray(skills)) return skills.map(String);
        if (typeof skills === 'string') return skills.split(',').map(s => s.trim()).filter(Boolean);
        return [];
    };

    // Filter by search term
    const filtered = talent.filter(t => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const skills = getSkills(t.profileDetails);
        return (
            t.role.toLowerCase().includes(term) ||
            skills.some(s => s.toLowerCase().includes(term))
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse Talent</h2>
                    <p className="text-slate-500 mt-1">Discover verified students and professionals (Anti-Bypass Protection Active).</p>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search skills, roles..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Advanced Filters Sidebar */}
                <AdvancedFiltersSidebar />

                {/* Talent Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="ml-3 text-slate-500 font-medium">Loading talent pool...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                            <p>No talent profiles found{searchTerm ? ' for your search' : ''}.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map((t) => {
                                const skills = getSkills(t.profileDetails);
                                const shortId = t._id.slice(-4).toUpperCase();
                                const isConnecting = connectingIds.has(t._id);
                                const isConnected = connectedIds.has(t._id);

                                return (
                                    <div key={t._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:border-blue-200 hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                                    <Shield className="w-3.5 h-3.5" /> ID: {shortId}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 capitalize">{t.role}</h3>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6 flex-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>{getDetail(t.profileDetails, 'experience') !== '—' ? getDetail(t.profileDetails, 'experience') : 'Experience not specified'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="line-clamp-1">{getDetail(t.profileDetails, 'education') !== '—' ? getDetail(t.profileDetails, 'education') : getDetail(t.profileDetails, 'qualification')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span>{getDetail(t.profileDetails, 'location') !== '—' ? getDetail(t.profileDetails, 'location') : 'Location not specified'}</span>
                                            </div>
                                        </div>

                                        {skills.length > 0 && (
                                            <div className="mb-6">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <Code className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Top Skills</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {skills.slice(0, 5).map((skill, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-100">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-slate-100">
                                            <button 
                                                onClick={() => handleConnect(t._id)}
                                                disabled={isConnecting || isConnected}
                                                className={`w-full py-2.5 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                                                    isConnected 
                                                        ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                                                        : 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed'
                                                }`}
                                            >
                                                {isConnecting ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Requesting...</>
                                                ) : isConnected ? (
                                                    <><CheckCircle className="w-4 h-4" /> Request Sent</>
                                                ) : (
                                                    <><CheckCircle className="w-4 h-4" /> Request Connection</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default BrowseTalent;
