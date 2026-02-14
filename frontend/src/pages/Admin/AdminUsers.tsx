import { useState, useEffect } from 'react';
import { 
    Search, 
    MoreVertical, 
    Eye, 
    Ban, 
    Flag, 
    ShieldCheck, 
    AlertOctagon,
    Loader2
} from 'lucide-react';
import api from '../../services/api';

// ─── Two-category tab structure ───
const TAB_GROUPS = [
    {
        groupLabel: 'Career Seekers',
        groupColor: 'text-blue-600',
        tabs: [
            { label: 'Students',  role: 'student'  },
            { label: 'Aspirants', role: 'aspirant'  },
        ]
    },
    {
        groupLabel: 'Career Facilitators',
        groupColor: 'text-emerald-600',
        tabs: [
            { label: 'Organizations', role: 'organization'  },
            { label: 'Professors',    role: 'professor'     },
            { label: 'Professionals', role: 'professional'  },
            { label: 'Recruiters',    role: 'recruiter'     },
            { label: 'Others',        role: 'others'        },
        ]
    }
];

interface UserRecord {
    _id: string;
    fullName?: string;
    email?: string;
    role?: string;
    createdAt?: string;
    [key: string]: unknown;
}

const AdminUsers = () => {
    const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
    const [activeRole, setActiveRole] = useState('student');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Fetch ALL users once on mount — filter client-side
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users/admin/all');
                setAllUsers(data);
            } catch {
                setError('Failed to load users. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Client-side filter by active role + search
    const filteredUsers = allUsers.filter(user => {
        const matchesRole = user.role === activeRole;
        if (!searchQuery.trim()) return matchesRole;
        const query = searchQuery.toLowerCase();
        return matchesRole && (
            (user.fullName?.toLowerCase().includes(query)) ||
            (user.email?.toLowerCase().includes(query))
        );
    });

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(prev => prev === id ? null : id);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h2>
                <p className="text-slate-500 text-sm mt-1">
                    Monitor accounts across all roles. Showing {allUsers.length} total registered users.
                </p>
            </div>

            {/* Tab Groups + Search */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col gap-5 mb-4">
                    {TAB_GROUPS.map((group) => (
                        <div key={group.groupLabel}>
                            <p className={`text-xs font-semibold uppercase tracking-widest mb-2.5 ${group.groupColor}`}>
                                {group.groupLabel}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {group.tabs.map((tab) => {
                                    const count = allUsers.filter(u => u.role === tab.role).length;
                                    const isActive = activeRole === tab.role;
                                    return (
                                        <button
                                            key={tab.role}
                                            onClick={() => setActiveRole(tab.role)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-2
                                                ${isActive
                                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            {tab.label}
                                            <span className={`text-xs rounded-full px-2 py-0.5 ${
                                                isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500'
                                            }`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${activeRole}s...`}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-slate-400 text-sm">Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <AlertOctagon className="w-8 h-8 text-rose-400" />
                        <p className="text-rose-500 text-sm">{error}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">User Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Account Type</th>
                                    <th className="px-6 py-4">Joined Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            No {activeRole} accounts registered yet.
                                        </td>
                                    </tr>
                                ) : null}
                                
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-700 font-bold text-sm">
                                                    {(user.fullName || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-semibold text-slate-800">{user.fullName ?? '—'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{user.email ?? '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                                                {user.role ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button 
                                                onClick={() => toggleDropdown(user._id)}
                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {openDropdownId === user._id && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={() => setOpenDropdownId(null)}
                                                    ></div>
                                                    <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)] border border-slate-200 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                                            <Eye className="w-4 h-4 text-slate-400" />
                                                            View Full Profile
                                                        </button>
                                                        <div className="h-px bg-slate-100 my-1"></div>
                                                        <button className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 transition-colors">
                                                            <Flag className="w-4 h-4 text-amber-500" />
                                                            Mark as Spam / Fraud
                                                        </button>
                                                        <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors">
                                                            <Ban className="w-4 h-4 text-rose-500" />
                                                            Suspend Account
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
