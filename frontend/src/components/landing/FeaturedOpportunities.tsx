import { useState, useEffect } from 'react';
import { getOpportunities } from '../../services/apiService';
import type { Opportunity } from '../../services/apiService';
import { MapPin, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

/* ── Initials avatar with gradient ── */
const InitialsAvatar = ({ name }: { name: string }) => {
    const initial = name?.charAt(0)?.toUpperCase() ?? 'C';
    return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 
            flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-indigo-300/50 shrink-0">
            {initial}
        </div>
    );
};

/* ── Type badge colors ── */
const TYPE_BADGES: Record<string, string> = {
    'Internship': 'bg-teal-500/15 text-teal-400 border-teal-500/25',
    'Full-time':  'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
    'Part-time':  'bg-amber-500/15 text-amber-400 border-amber-500/25',
    'Project':    'bg-violet-500/15 text-violet-400 border-violet-500/25',
    'Contract':   'bg-rose-500/15 text-rose-400 border-rose-500/25',
};

/* ── Opportunity Card ── */
const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const facilitator = typeof opportunity.facilitatorId === 'object' ? opportunity.facilitatorId : null;
    const companyName = facilitator?.companyName || facilitator?.fullName || 'Company';
    const badgeClass = TYPE_BADGES[opportunity.type || 'Full-time'] || TYPE_BADGES['Full-time'];

    return (
        <div className="group relative bg-gradient-to-br from-[#1E2128] to-[#252930] rounded-2xl p-5
            border border-indigo-500/20 hover:border-indigo-500/50
            shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.3)]
            hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer">
            
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <InitialsAvatar name={companyName} />
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {opportunity.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm text-slate-400 truncate">{companyName}</span>
                        {opportunity.jobType && (
                            <>
                                <span className="text-slate-600">·</span>
                                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="text-xs text-slate-500 truncate">{opportunity.jobType}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {opportunity.type && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${badgeClass}`}>
                        {opportunity.type}
                    </span>
                )}
                {opportunity.skillsRequired.slice(0, 2).map(skill => (
                    <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
                        {skill}
                    </span>
                ))}
            </div>

            {/* Salary + CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-white/8">
                {opportunity.stipendOrSalary && (
                    <span className="text-sm font-semibold text-teal-400">{opportunity.stipendOrSalary}</span>
                )}
                <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500
                    text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-500/30
                    group-hover:shadow-md group-hover:shadow-indigo-500/40">
                    View Details
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
};

/* ── Shimmer Skeleton ── */
const SkeletonCard = () => (
    <div className="bg-gradient-to-br from-[#1E2128] to-[#252930] rounded-2xl p-5 border border-white/5 animate-pulse">
        <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
        </div>
        <div className="flex gap-2 mb-4">
            <div className="h-6 bg-white/5 rounded-full w-20" />
            <div className="h-6 bg-white/5 rounded-full w-16" />
        </div>
        <div className="h-8 bg-white/5 rounded-lg w-24 ml-auto" />
    </div>
);

/* ── Main Section ── */
const FeaturedOpportunities = () => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getOpportunities();
                // Take latest 6 sorted by createdAt
                const sorted = [...data].sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOpportunities(sorted.slice(0, 6));
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (error) return null; // Gracefully hide on error

    return (
        <section className="w-full py-16 px-4 relative overflow-hidden">
            {/* Animated background accents */}
            <div className="absolute top-10 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-teal-500/5 rounded-full blur-[80px] animate-pulse pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-teal-500/10 border border-indigo-500/20">
                        <TrendingUp className="w-4 h-4 text-teal-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">Trending Now</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
                        Trending Opportunities{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">for You</span>
                    </h2>
                    <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-teal-400 to-indigo-500" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        : opportunities.map(opp => <OpportunityCard key={opp._id} opportunity={opp} />)
                    }
                </div>

                {/* CTA */}
                {!loading && opportunities.length > 0 && (
                    <div className="text-center mt-10">
                        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                            bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm
                            shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40
                            hover:-translate-y-0.5 transition-all duration-300">
                            <Sparkles className="w-4 h-4" />
                            View All Opportunities
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedOpportunities;
