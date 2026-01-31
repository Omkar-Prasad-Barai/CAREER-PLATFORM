import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import InitialsAvatar from '../../ui/InitialsAvatar';


const ROLE_ROUTES: Record<string, string> = {
    admin:        '/admin',
    student:      '/student/dashboard',
    aspirant:     '/aspirant/dashboard',
    organization: '/organization/dashboard',
    professor:    '/professor/dashboard',
    professional: '/professional/dashboard',
    recruiter:    '/recruiter/dashboard',
    others:       '/others/dashboard',
};

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <nav className="w-full bg-white transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo - Left Side */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-600">CareerConnect</span>
                    </div>

                    {/* Right Side — conditional on auth state */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <>
                                {/* User greeting chip — navigates to role dashboard */}
                                <button
                                    onClick={() => navigate(ROLE_ROUTES[user.role] || '/')}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full
                                        bg-indigo-50 border border-indigo-200 text-indigo-700
                                        text-sm font-medium hover:bg-indigo-100 transition-all duration-200
                                        shadow-sm hover:shadow-md"
                                >
                                    {/* Avatar — CSS initials */}
                                    <InitialsAvatar fullName={user.fullName || 'U'} size="sm" className="border-2 border-indigo-300" />
                                    <span className="hidden sm:block max-w-[140px] truncate">
                                        {user.fullName ?? 'My Account'}
                                    </span>
                                </button>

                                {/* Logout button */}
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-medium
                                        bg-slate-100 border border-slate-200 text-slate-600
                                        hover:bg-red-50 hover:border-red-200 hover:text-red-600
                                        transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            /* Logged-out state — original Login/Register button preserved */
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('roles-section')?.scrollIntoView();
                                }}
                                className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Login / Register
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
