
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    LogOut, 
    Menu, 
    X, 
    ChevronRight,
    Settings
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import InitialsAvatar from '../../ui/InitialsAvatar';

import clsx from 'clsx';

export interface SidebarItem {
    icon: any;
    label: string;
    href: string;
    onClick?: () => void;
}

interface SidebarProps {
    items: SidebarItem[];
    role: string;
    onSettingsClick?: () => void;
    activeLabel?: string;
}

const Sidebar = ({ items, role, onSettingsClick, activeLabel }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Navigate to home first to unmount protected routes
        navigate('/', { replace: true });
        
        // innovative fix: 
        // Delay clearing auth state to ensure we are already on the public route
        // This prevents ProtectedRoute from seeing "unauthenticated" while still on /dashboard
        // and redirecting to /auth
        setTimeout(() => {
            logout();
        }, 50);
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
            >
                {isOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>

            {/* Sidebar Container */}
            <aside className={clsx(
                "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-20 flex items-center px-8 border-b border-gray-100">
                        <div className={clsx("p-2 rounded-lg mr-3 shadow-md", `bg-indigo-600`)}>
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">CareerConnect</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu</p>
                        {items.map((item) => {
                            const isActive = activeLabel === item.label;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (item.onClick) {
                                            item.onClick();
                                        }
                                    }}
                                    className={clsx(
                                        "w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                                        isActive 
                                            ? "bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600 shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800 border-l-4 border-transparent"
                                    )}
                                >
                                    <item.icon className={clsx(
                                        "w-5 h-5 mr-3 transition-colors",
                                        isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                    )} />
                                    <span className="truncate">{item.label}</span>
                                    {/* Active indicator dot */}
                                    {isActive ? (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <div 
                            onClick={() => {
                                setIsOpen(false);
                                onSettingsClick?.();
                            }}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-xl mb-3 cursor-pointer hover:bg-slate-100 transition-colors group"
                        >
                            <div className="flex items-center">
                                <InitialsAvatar fullName={user?.fullName || role || 'U'} size="md" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 capitalize leading-tight">Update Account</p>
                                    <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700 transition-colors">Account Settings</p>
                                </div>
                            </div>
                            <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
