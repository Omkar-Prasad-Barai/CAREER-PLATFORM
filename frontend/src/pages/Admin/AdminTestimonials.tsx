import { useState, useEffect, useCallback } from 'react';
import {
    MessageSquare, Check, Trash2, Loader2, AlertCircle, Star, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
    getPendingTestimonials,
    approveTestimonial,
    deleteTestimonial,
} from '../../services/apiService';
import type { Testimonial } from '../../services/apiService';

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star
                key={s}
                className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
            />
        ))}
    </div>
);

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const fetchPending = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPendingTestimonials(1, 50);
            setTestimonials(data);
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Failed to load testimonials.'
                : 'An unexpected error occurred.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPending(); }, [fetchPending]);

    const handleApprove = async (id: string) => {
        setActionLoadingId(id + '-approve');
        try {
            await approveTestimonial(id);
            setTestimonials(prev => prev.filter(t => t._id !== id));
            toast.success('Testimonial approved and published!');
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Failed to approve testimonial.'
                : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoadingId(id + '-reject');
        try {
            await deleteTestimonial(id);
            setTestimonials(prev => prev.filter(t => t._id !== id));
            toast.success('Testimonial rejected and removed.');
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Failed to reject testimonial.'
                : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Testimonials Moderation</h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Review user-submitted testimonials. Approved ones appear on the public landing page.
                    </p>
                </div>
                <button
                    onClick={fetchPending}
                    title="Refresh queue"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Info Banner */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-sm flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="text-indigo-800 font-bold text-sm">Moderation Queue</h4>
                    <p className="text-indigo-700 text-sm mt-0.5 leading-relaxed">
                        Testimonials are hidden from the public by default. Approving a card makes it immediately visible on the website's testimonials section. Rejecting permanently deletes it.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center border border-violet-200">
                        <MessageSquare className="w-4 h-4 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">
                        Pending Reviews
                        {!loading && (
                            <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {testimonials.length}
                            </span>
                        )}
                    </h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
                        <span className="ml-3 text-slate-500 font-medium">Loading pending testimonials…</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                        <p className="font-medium">{error}</p>
                        <button onClick={fetchPending} className="mt-4 text-sm text-indigo-600 hover:underline">Try again</button>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-emerald-600 font-semibold text-lg">All caught up!</p>
                        <p className="text-slate-400 text-sm mt-1">No testimonials pending review. New submissions will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                        {testimonials.map(t => (
                            <div
                                key={t._id}
                                className="relative bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 hover:border-indigo-200 transition-colors group"
                            >
                                {/* User info */}
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                                        {t.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm truncate">{t.fullName}</p>
                                        <p className="text-xs text-slate-500 truncate">{t.role} · {t.company}</p>
                                    </div>
                                    <div className="ml-auto flex-shrink-0">
                                        <StarRating rating={t.rating} />
                                    </div>
                                </div>

                                {/* Quote */}
                                <blockquote className="text-slate-600 text-sm leading-relaxed italic border-l-2 border-indigo-200 pl-3 line-clamp-4">
                                    "{t.quote}"
                                </blockquote>

                                {/* Date */}
                                <p className="text-[11px] text-slate-400">
                                    Submitted {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-1 border-t border-slate-200">
                                    <button
                                        onClick={() => handleApprove(t._id)}
                                        disabled={actionLoadingId !== null}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
                                    >
                                        {actionLoadingId === t._id + '-approve'
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <Check className="w-4 h-4" />
                                        }
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(t._id)}
                                        disabled={actionLoadingId !== null}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-400 text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                                    >
                                        {actionLoadingId === t._id + '-reject'
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <Trash2 className="w-4 h-4" />
                                        }
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTestimonials;
