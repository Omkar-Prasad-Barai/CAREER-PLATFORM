import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordField from '../../../components/common/PasswordField';
import { passwordPlaceholder } from '../../../data/placeholderData';

const LoginForm = ({ role }: { role: string }) => {
    const focusColors = {
        student: 'focus:ring-blue-500',
        organization: 'focus:ring-teal-500',
        professor: 'focus:ring-orange-500',
        professional: 'focus:ring-indigo-500',
        others: 'focus:ring-gray-500'
    };

    const activeColor = focusColors[role as keyof typeof focusColors] || 'focus:ring-blue-500';

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="you@example.com" 
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 ${activeColor} focus:border-transparent outline-none transition-all`}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <PasswordField 
                    placeholder={passwordPlaceholder} 
                    focusRingColor={activeColor} 
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            name="rememberMe" 
                            value="true"
                            className="peer sr-only" 
                        />
                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white 
                            peer-checked:bg-indigo-600 peer-checked:border-indigo-600 
                            peer-focus:ring-2 peer-focus:ring-indigo-500/30 
                            transition-all duration-200 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-800 transition-colors">
                        Keep me signed in for 30 days
                    </span>
                </label>
                <Link 
                    to="/forgot-password" 
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
