import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.post('/auth/forgot-password', { email });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#F5F4F0] border border-[#1A1D23]/20 shadow-lg rounded-2xl p-8">
                    {!isSuccess ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-7 h-7 text-indigo-600" />
                                </div>
                                <h1 className="text-2xl font-bold text-[#1A1D23] mb-2">
                                    Forgot your password?
                                </h1>
                                <p className="text-slate-500 text-sm">
                                    Enter your email and we'll send you a reset link.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A1D23]">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 
                                                bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                                outline-none transition-all text-[#1A1D23]"
                                        />
                                    </div>
                                </div>

                                {/* Error Alert */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold 
                                        hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 
                                        disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-8 h-8 text-teal-600" />
                            </div>
                            <h2 className="text-xl font-bold text-[#1A1D23] mb-3">
                                Check your inbox!
                            </h2>
                            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                A reset link has been sent to{' '}
                                <span className="font-semibold text-[#1A1D23]">{email}</span>.
                                <br />
                                Link expires in 15 minutes.
                            </p>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/auth?role=student"
                            className="inline-flex items-center gap-1.5 text-sm text-indigo-600 
                                hover:text-indigo-800 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
