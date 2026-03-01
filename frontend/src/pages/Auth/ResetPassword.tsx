import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Validation rules
    const rules = [
        { label: 'At least 8 characters', test: password.length >= 8 },
        { label: 'Contains uppercase letter', test: /[A-Z]/.test(password) },
        { label: 'Contains a number', test: /\d/.test(password) },
        { label: 'Contains special character', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        { label: 'Passwords match', test: password.length > 0 && password === confirmPassword },
    ];

    const allValid = rules.every((r) => r.test);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!allValid) return;
        setError('');
        setIsLoading(true);

        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-[#F5F4F0] border border-[#1A1D23]/20 shadow-lg rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <ShieldCheck className="w-8 h-8 text-teal-600" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1A1D23] mb-3">
                            Password Reset Successful!
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">
                            Your password has been updated. You can now log in with your new password.
                        </p>
                        <Link
                            to="/auth?role=student"
                            className="inline-block w-full py-3 rounded-xl bg-indigo-600 text-white 
                                font-semibold hover:bg-indigo-700 transition-all text-center"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-[#F5F4F0] border border-[#1A1D23]/20 shadow-lg rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#1A1D23] mb-2">
                            Set New Password
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Create a strong password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1A1D23]">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 
                                        bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                        outline-none transition-all text-[#1A1D23]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                                        hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1A1D23]">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 
                                        bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                        outline-none transition-all text-[#1A1D23]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                                        hover:text-slate-600 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Validation Checklist */}
                        <div className="space-y-2 bg-white/60 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Password Requirements
                            </p>
                            {rules.map((rule, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    {rule.test ? (
                                        <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                                    )}
                                    <span className={rule.test ? 'text-teal-700' : 'text-slate-400'}>
                                        {rule.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p>{error}</p>
                                    {error.includes('expired') && (
                                        <Link
                                            to="/forgot-password"
                                            className="inline-block mt-2 font-semibold text-indigo-600 
                                                hover:text-indigo-800 transition-colors"
                                        >
                                            Request a new link →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !allValid}
                            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold 
                                hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 
                                disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
