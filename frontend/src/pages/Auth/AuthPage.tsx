
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import axios from 'axios';

// Forms
import StudentRegisterForm from './components/StudentRegisterForm';
import AspirantRegisterForm from './components/AspirantRegisterForm';
import OrgRegisterForm from './components/OrgRegisterForm';
import ProfessorRegisterForm from './components/ProfessorRegisterForm';
import ProfessionalRegisterForm from './components/ProfessionalRegisterForm';
import RecruiterRegisterForm from './components/RecruiterRegisterForm';
import OthersRegisterForm from './components/OthersRegisterForm';
import LoginForm from './components/LoginForm';

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { registerUser, loginUser, isLoading, isAuthenticated, role: currentRole } = useAuth();
    
    // Get initial role from URL
    const roleParam = searchParams.get('role') as UserRole;
    const [activeRole, setActiveRole] = useState<UserRole>(roleParam || 'student');

    useEffect(() => {
        if (!roleParam) {
            navigate('/');
        } else if (roleParam !== activeRole) {
            setActiveRole(roleParam);
        }
    }, [roleParam, navigate, activeRole]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && currentRole !== 'guest') {
            navigate(`/${currentRole}/dashboard`, { replace: true });
        }
    }, [isAuthenticated, currentRole, navigate]);

    // Default to Register mode
    const [isRegistering, setIsRegistering] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const toggleAuthMode = (mode: boolean) => {
        setIsRegistering(mode);
        setSuccessMessage(null); // Clear only on manual toggle
    };

    // Real auth submit handler
    const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            if (isRegistering) {
                const fullName = formData.get('fullName') as string;
                const email = formData.get('email') as string;
                const password = formData.get('password') as string;

                if (!fullName || !email || !password) {
                    toast.error('Please fill in all required fields.');
                    return;
                }

                // Collect ALL form fields into a flat payload
                // The backend controller will whitelist and extract role-specific profileDetails
                const payload: Record<string, unknown> = {
                    fullName,
                    email,
                    password,
                    role: activeRole,
                };

                // Fields to skip (already handled above or not needed on backend)
                const skipFields = new Set(['fullName', 'email', 'password', 'confirmPassword']);

                // Iterate over all FormData entries for role-specific fields
                const entriesMap = new Map<string, string[]>();
                for (const [key, value] of formData.entries()) {
                    if (skipFields.has(key)) continue;
                    if (!entriesMap.has(key)) {
                        entriesMap.set(key, []);
                    }
                    entriesMap.get(key)!.push(value as string);
                }

                // For fields with multiple values (checkboxes), send as array; otherwise single value
                for (const [key, values] of entriesMap.entries()) {
                    payload[key] = values.length > 1 ? values : values[0];
                }

                await registerUser(payload as { fullName: string; email: string; password: string; role: string; [key: string]: unknown });

                toast.success('Registration successful! Please log in to continue.');
                // Switch to login mode so the user can log in
                setIsRegistering(false);
                setSuccessMessage('Registration successful! Please log in with your new credentials.');
            } else {
                const email = formData.get('email') as string;
                const password = formData.get('password') as string;
                const rememberMe = formData.get('rememberMe') === 'true';

                if (!email || !password) {
                    toast.error('Please enter email and password.');
                    return;
                }

                const user = await loginUser(email, password, rememberMe);
                toast.success(`Welcome back, ${user?.fullName}!`);
                navigate(`/${user?.role}/dashboard`);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Something went wrong. Please try again.';
                toast.error(message);
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    // Configuration for styling based on active role (keeping it subtle for tabs)
    const roleConfig: Record<string, { color: string, text: string, border: string, gradient: string, inactive: string }> = {
        student: { color: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', gradient: 'from-blue-600 to-indigo-600', inactive: 'bg-blue-50/50 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300' },
        aspirant: { color: 'bg-fuchsia-600', text: 'text-fuchsia-600', border: 'border-fuchsia-600', gradient: 'from-fuchsia-500 to-purple-600', inactive: 'bg-fuchsia-50/50 border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-300' },
        organization: { color: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-600', gradient: 'from-teal-600 to-emerald-600', inactive: 'bg-teal-50/50 border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300' },
        professor: { color: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-600', gradient: 'from-orange-600 to-red-600', inactive: 'bg-orange-50/50 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300' },
        professional: { color: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', gradient: 'from-indigo-600 to-violet-600', inactive: 'bg-indigo-50/50 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300' },
        recruiter: { color: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', gradient: 'from-emerald-600 to-green-600', inactive: 'bg-emerald-50/50 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300' },
        others: { color: 'bg-gray-700', text: 'text-gray-700', border: 'border-gray-700', gradient: 'from-gray-700 to-slate-800', inactive: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300' },
        guest: { color: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500', gradient: 'from-gray-500 to-slate-600', inactive: 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300' },
    };

    const currentConfig = roleConfig[activeRole] || roleConfig.student;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                
                {/* Header Section */}
                <div className={`p-8 md:p-10 bg-gradient-to-r ${currentConfig.gradient} text-white relative overflow-hidden transition-colors duration-500`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    
                    <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors z-20">
                        <ArrowLeft className="w-4 h-4" />
                        Go back to Home page
                    </Link>

                    <div className="relative z-10 mt-6 text-center capitalize">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            {isRegistering 
                                ? ['organization', 'professor', 'recruiter', 'professional'].includes(activeRole)
                                    ? `Partner with us, ${activeRole}`
                                    : `Welcome, ${activeRole}`
                                : `Welcome Back, ${activeRole}`
                            }
                        </h2>
                        <p className="text-white/90 text-lg">
                            {isRegistering 
                                ? `Create your ${activeRole} account to get started.` 
                                : `Sign in to your ${activeRole} dashboard.`
                            }
                        </p>
                    </div>
                </div>



                {/* Form Section */}
                <div className="p-8 md:p-10">
                    {/* Success Message Alert */}
                    {successMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                             <div className="bg-green-100 p-1.5 rounded-full">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                             </div>
                             <p className="text-sm font-medium">{successMessage}</p>
                        </div>
                    )}

                    <div className="flex justify-center mb-8 bg-gray-100 p-1 rounded-xl max-w-sm mx-auto">
                        <button 
                            onClick={() => toggleAuthMode(true)}
                            className={clsx(
                                "flex flex-col flex-1 items-center justify-center py-2 rounded-lg transition-all duration-200",
                                isRegistering ? "bg-white shadow-sm" : "hover:bg-gray-50/50"
                            )}
                        >
                            <span className={clsx("text-base font-bold", isRegistering ? "text-gray-900" : "text-gray-500")}>Register</span>
                            <span className={clsx("block text-[10px] sm:text-xs font-normal mt-0.5 opacity-80", isRegistering ? "text-gray-500" : "text-gray-400")}>New User</span>
                        </button>
                        <button 
                            onClick={() => toggleAuthMode(false)}
                            className={clsx(
                                "flex flex-col flex-1 items-center justify-center py-2 rounded-lg transition-all duration-200",
                                !isRegistering ? "bg-white shadow-sm" : "hover:bg-gray-50/50"
                            )}
                        >
                            <span className={clsx("text-base font-bold", !isRegistering ? "text-gray-900" : "text-gray-500")}>Login</span>
                            <span className={clsx("block text-[10px] sm:text-xs font-normal mt-0.5 opacity-80", !isRegistering ? "text-gray-500" : "text-gray-400")}>Existing User</span>
                        </button>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-6 max-w-4xl mx-auto w-full">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 key={activeRole}"> 
                             {/* Key added to force re-render animation on role switch */}
                            {isRegistering ? (
                                activeRole === 'student' ? <StudentRegisterForm /> :
                                activeRole === 'aspirant' ? <AspirantRegisterForm /> :
                                activeRole === 'organization' ? <OrgRegisterForm /> :
                                activeRole === 'professor' ? <ProfessorRegisterForm /> :
                                activeRole === 'professional' ? <ProfessionalRegisterForm /> :
                                activeRole === 'recruiter' ? <RecruiterRegisterForm /> :
                                <OthersRegisterForm />
                            ) : (
                                <LoginForm role={activeRole} />
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center group ${currentConfig.color} disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {isRegistering ? 'Creating Account...' : 'Signing In...'}
                                </>
                            ) : (
                                <>
                                    {isRegistering ? 'Create Account' : 'Sign In'}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                         <p className="text-gray-500 text-sm">
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                            <button 
                                onClick={() => setIsRegistering(!isRegistering)}
                                className={`ml-2 font-bold hover:underline ${currentConfig.text}`}
                            >
                                {isRegistering ? 'Login here' : 'Register here'}
                            </button>
                        </p>
                    </div>

                    {/* Admin Access Link */}
                    <div className="mt-12 text-center">
                        <Link to="/admin/login" className="text-[10px] text-gray-300 hover:text-gray-400 transition-colors">
                            Admin Access
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

