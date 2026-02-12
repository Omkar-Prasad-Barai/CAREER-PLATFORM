import { Outlet, NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShieldCheck, 
    Users, 
    AlertOctagon, 
    Settings,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useNavigationBlocker from '../../hooks/useNavigationBlocker';
import AdminExitModal from '../../components/admin/AdminExitModal';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { logout } = useAuth();

    // Navigation blocker returns modal state instead of native confirm
    const { isModalOpen, handleStay, handleProceedLogout } = useNavigationBlocker(!isLoggingOut);

    const navLinks = [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/approvals', label: 'Connection Approvals', icon: ShieldCheck },
        { path: '/admin/users', label: 'User Management', icon: Users },
        { path: '/admin/spam', label: 'Spam Control', icon: AlertOctagon },
        { path: '/admin/settings', label: 'Platform Settings', icon: Settings },
    ];

    // Called by the sidebar Logout button — intentional logout, no blocker
    const handleLogout = () => {
        setIsLoggingOut(true);
        logout();
    };

    // Called by the modal's "Logout Securely" button — exit via blocker
    const handleSecureLogout = () => {
        setIsLoggingOut(true);
        handleProceedLogout();
        logout();
    };

    return (
        <>
            {/* Custom Exit Modal — rendered at the top level */}
            <AdminExitModal
                isOpen={isModalOpen}
                onStay={handleStay}
                onLogout={handleSecureLogout}
            />

            <div className="min-h-screen bg-slate-50 flex">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800
                    transform transition-transform duration-300 ease-in-out z-50 flex flex-col
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xl font-bold text-white tracking-tight">Admin Portal</span>
                        <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setSidebarOpen(false)}
                                    end={link.path === '/admin'}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
                                        ${isActive 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </NavLink>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-slate-800">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Secure Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button 
                                className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">CareerConnect Admin Portal</h1>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-700">System Admin</p>
                                    <p className="text-xs text-slate-500">admin@careerconnect.com</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200 text-indigo-700 font-bold">
                                    SA
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminLayout;
