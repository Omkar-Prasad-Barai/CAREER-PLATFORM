import { useState, useEffect } from 'react';
import { Briefcase, Users, Star, Clock, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOpportunities, getMyOpportunities } from '../../services/apiService';
import type { Opportunity } from '../../services/apiService';
import TestimonialInput from './TestimonialInput';

/* ── Animated Counter ── */
const AnimatedCount = ({ target }: { target: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (target === 0) return;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(current);
        }, 30);
        return () => clearInterval(timer);
    }, [target]);
    return <span>{count}</span>;
};

/* ── Profile Strength Ring (SVG) ── */
const ProfileStrengthRing = ({ percent }: { percent: number }) => {
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
                <circle
                    cx="60" cy="60" r={radius} fill="none"
                    stroke="url(#ring-gradient)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                    <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">{percent}%</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">complete</span>
            </div>
        </div>
    );
};

/* ── Stat Card (Light Theme) ── */
const StatCard = ({ icon: Icon, label, value, accentColor, borderColor }: {
    icon: typeof Briefcase;
    label: string;
    value: number;
    accentColor: string;
    borderColor: string;
    glowColor?: string;
}) => (
    <div className={`bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6
        border-l-4 ${borderColor} border border-slate-200/80
        shadow-glow-indigo card-premium`}
    >
        <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl ${accentColor} flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-slate-500">{label}</span>
        </div>
        <p className="text-3xl font-extrabold text-slate-800">
            <AnimatedCount target={value} />
        </p>
    </div>
);

/* ── Organization Overview ── */
const OrganizationOverview = () => {
    const [activePosts, setActivePosts] = useState(0);
    const [pendingApplicants, setPendingApplicants] = useState(0);
    const [topPicks, setTopPicks] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const myOpps = await getMyOpportunities();
                const active = myOpps.filter(o => o.isActive).length;
                setActivePosts(active);
                setPendingApplicants(0);
                setTopPicks(Math.min(active, 5));
            } catch { /* graceful fallback */ }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard icon={Briefcase} label="Active Posts" value={activePosts}
                    accentColor="bg-indigo-600" borderColor="border-l-indigo-500" />
                <StatCard icon={Users} label="Pending Applicants" value={pendingApplicants}
                    accentColor="bg-amber-500" borderColor="border-l-amber-500" />
                <StatCard icon={Star} label="Top Talent Picks" value={topPicks}
                    accentColor="bg-teal-500" borderColor="border-l-teal-500" />
            </div>

            {/* Top Talent Table */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-slate-200/80
                shadow-glow-indigo overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" /> Top Talent Picks
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-indigo-50/60">
                                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-indigo-600">Applicant</th>
                                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-indigo-600">Applied For</th>
                                <th className="text-left py-3 px-5 text-xs font-semibold uppercase tracking-wider text-indigo-600">Match</th>
                                <th className="text-right py-3 px-5 text-xs font-semibold uppercase tracking-wider text-indigo-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">
                                    No talent picks yet. Applicants will appear here as they apply.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <TestimonialInput />
        </div>
    );
};

/* ── Student / Aspirant Overview ── */
const SeekerOverview = () => {
    const { user } = useAuth();
    const [recommended, setRecommended] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    // Profile strength calculation
    const profileStrength = (() => {
        if (!user) return 0;
        const u = user as any;
        let score = 0;
        if (u.fullName) score += 20;
        if (u.bio || u.about) score += 20;
        if (Array.isArray(u.skills) && u.skills.length > 0) score += 20;
        if (u.resume) score += 20;
        if (u.education || u.collegeName || u.degree) score += 20;
        return score;
    })();

    const missingFields = (() => {
        if (!user) return [];
        const u = user as any;
        const missing: string[] = [];
        if (!u.fullName) missing.push('Full Name');
        if (!u.bio && !u.about) missing.push('Bio / About');
        if (!Array.isArray(u.skills) || u.skills.length === 0) missing.push('Skills');
        if (!u.resume) missing.push('Resume');
        if (!u.education && !u.collegeName && !u.degree) missing.push('Education');
        return missing;
    })();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const opps = await getOpportunities();
                setRecommended(opps.slice(0, 4));
            } catch { /* silently fail */ }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const recentApplications: { title: string; company: string; status: 'Pending' | 'Accepted' | 'Rejected' }[] = [];

    const STATUS_STYLES = {
        Pending:  'bg-amber-50 text-amber-700 border-amber-200',
        Accepted: 'bg-teal-50 text-teal-700 border-teal-200',
        Rejected: 'bg-red-50 text-red-700 border-red-200',
    };

    const STATUS_ICONS = {
        Pending:  Clock,
        Accepted: CheckCircle,
        Rejected: XCircle,
    };

    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 — Application Status */}
            <div className="bg-gradient-to-br from-white to-indigo-50/40 rounded-2xl p-5
                border border-indigo-200/60 hover:border-indigo-300
                shadow-glow-indigo card-premium">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                        <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.05em]">Application Status</h3>
                </div>
                <div className="space-y-3">
                    {recentApplications.length === 0 ? (
                        <p className="text-sm text-slate-400 py-4 text-center">No applications yet. Browse opportunities to get started.</p>
                    ) : recentApplications.map((app, i) => {
                        const StatusIcon = STATUS_ICONS[app.status];
                        return (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{app.title}</p>
                                    <p className="text-xs text-slate-500">{app.company}</p>
                                </div>
                                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[app.status]}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {app.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Card 2 — Recommended for You */}
            <div className="bg-gradient-to-br from-white to-teal-50/40 rounded-2xl p-5
                border border-teal-200/60 hover:border-teal-300
                shadow-glow-teal card-premium">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.05em]">Recommended for You</h3>
                </div>
                {loading ? (
                    <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-16 rounded-lg bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {recommended.map((opp) => {
                            const facilitator = typeof opp.facilitatorId === 'object' ? opp.facilitatorId : null;
                            return (
                                <div key={opp._id} className="p-3 rounded-xl bg-white border border-slate-100 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group">
                                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-teal-600 transition-colors">{opp.title}</p>
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{facilitator?.companyName || facilitator?.fullName || 'Company'}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
                <button className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors py-1.5">
                    View All <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            {/* Card 3 — Profile Strength */}
            <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl p-5
                border border-amber-200/60 hover:border-amber-300
                shadow-glow-amber card-premium flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 w-full">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm">
                        <Star className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.05em]">Profile Strength</h3>
                </div>
                <ProfileStrengthRing percent={profileStrength} />
                {missingFields.length > 0 && (
                    <div className="mt-4 w-full">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Complete to boost:</p>
                        <div className="space-y-1.5">
                            {missingFields.map(field => (
                                <div key={field} className="flex items-center gap-2 text-xs text-amber-600">
                                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                                    {field}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <TestimonialInput />
        </>
    );
};

/* ── Root Export ── */
const DashboardOverview = () => {
    const { user } = useAuth();
    const role = user?.role;

    if (role === 'organization') return <OrganizationOverview />;
    if (role === 'student' || role === 'aspirant') return <SeekerOverview />;

    // Fallback for other roles — show seeker overview
    return <SeekerOverview />;
};

export default DashboardOverview;
