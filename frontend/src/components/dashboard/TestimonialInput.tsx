import { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { createTestimonial } from '../../services/apiService';

const TestimonialInput = () => {
    const { user } = useAuth();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [quote, setQuote] = useState('');
    const [rating, setRating] = useState(5);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async () => {
        if (!company || !role || !quote) {
            toast.error('Please fill in all fields.');
            return;
        }
        setIsSubmitting(true);
        try {
            await createTestimonial({ company, role, quote, rating });
            setCompany('');
            setRole('');
            setQuote('');
            setRating(5);
            setIsExpanded(false);
            toast.success('Your testimonial has been submitted! 🎉', { duration: 4000 });
        } catch {
            toast.error('Failed to submit testimonial. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40 rounded-2xl border border-amber-200/60 shadow-glow-amber p-5 mt-6
            hover:border-amber-300 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                    <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.05em]">Share Your Success Story</h3>
            </div>

            {/* Collapsed — Search-bar style trigger */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
                        bg-white border-2 border-dashed border-amber-200 hover:border-amber-400
                        text-slate-400 text-sm hover:text-slate-600 transition-all duration-200
                        hover:shadow-md group cursor-text"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(user.fullName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="flex-1 text-left">Tell the community about your experience...</span>
                    <Send className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
                </button>
            )}

            {/* Expanded — Full form */}
            {isExpanded && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-500 mr-2 uppercase tracking-wider">Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="focus:outline-none transition-transform hover:scale-125 duration-150"
                            >
                                <Star
                                    className={`w-6 h-6 transition-colors duration-150 ${
                                        star <= (hoveredStar || rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'fill-slate-100 text-slate-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Company + Role inline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Company (e.g., Google)"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                                focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none
                                transition-all hover:border-amber-300 placeholder:text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Role (e.g., Frontend Developer)"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                                focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none
                                transition-all hover:border-amber-300 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Testimonial text */}
                    <textarea
                        rows={3}
                        placeholder="Share your experience — how did the platform help you?"
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        maxLength={500}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm
                            focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none
                            transition-all hover:border-amber-300 resize-none placeholder:text-slate-400"
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{quote.length}/500</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !company || !role || !quote}
                                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold
                                    rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md
                                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialInput;
