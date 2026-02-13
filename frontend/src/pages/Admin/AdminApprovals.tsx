import { AlertCircle, ShieldAlert, Check, X, Clock, Mail, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getPendingRequests, updateConnectionStatus } from '../../services/apiService';
import type { ConnectionRequest } from '../../services/apiService';

const AdminApprovals = () => {
    const [approvals, setApprovals] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<{ name: string; type: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch pending requests on mount
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPendingRequests();
                setApprovals(data);
            } catch (err: unknown) {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message || 'Failed to load pending requests.'
                    : 'An unexpected error occurred.';
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // Approve or Reject a request
    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        setActionLoadingId(id);
        try {
            await updateConnectionStatus(id, action);
            setApprovals(prev => prev.filter(req => req._id !== id));
            toast.success(`Request ${action} successfully!`);
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message || `Failed to ${action} request.`
                : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Helper to extract populated fields safely
    const getSeekerName = (req: ConnectionRequest) =>
        typeof req.seekerId === 'object' ? req.seekerId.fullName : 'N/A';
    const getSeekerEmail = (req: ConnectionRequest) =>
        typeof req.seekerId === 'object' ? req.seekerId.email : 'N/A';
    const getFacilitatorName = (req: ConnectionRequest) =>
        typeof req.facilitatorId === 'object' ? req.facilitatorId.fullName : 'N/A';
    const getOpportunityTitle = (req: ConnectionRequest) =>
        typeof req.opportunityId === 'object' && req.opportunityId ? req.opportunityId.title : '—';

    // Search filter
    const filteredApprovals = approvals.filter(req => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            req._id.toLowerCase().includes(q) ||
            getSeekerName(req).toLowerCase().includes(q) ||
            getSeekerEmail(req).toLowerCase().includes(q) ||
            getFacilitatorName(req).toLowerCase().includes(q) ||
            getOpportunityTitle(req).toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Connection Approvals</h2>
                <p className="text-slate-500 text-sm mt-1">Review and manage platform connections to prevent bypassing.</p>
            </div>

            {/* Sticky Anti-Bypass Banner */}
            <div className="sticky top-[80px] z-20 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="text-amber-800 font-bold text-sm">Anti-Bypass Mode Active</h4>
                    <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                        Organizations and Students cannot communicate directly. Contact information remains masked to both parties until you explicitly approve the connection below.
                    </p>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200">
                            <AlertCircle className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Pending Requests ({filteredApprovals.length})</h3>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                        <input 
                            type="text" 
                            placeholder="Search by name, email, opportunity..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full sm:w-64"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <span className="ml-3 text-slate-500 font-medium">Loading pending requests...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                        <p className="font-medium">{error}</p>
                    </div>
                ) : filteredApprovals.length === 0 ? (
                    <div className="py-16 text-center">
                        <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <p className="text-emerald-600 font-semibold text-lg">No pending requests — all clear!</p>
                        <p className="text-slate-400 text-sm mt-1">New connection requests will appear here automatically.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Seeker (Applicant)</th>
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </div>
                                    </th>
                                    <th className="px-6 py-4">Facilitator</th>
                                    <th className="px-6 py-4">Opportunity</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredApprovals.map((req) => (
                                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-slate-600 text-xs font-medium">
                                                {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">
                                                {new Date(req.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p 
                                                onClick={() => setSelectedUser({ name: getSeekerName(req), type: 'Seeker' })}
                                                className="font-medium text-indigo-600 cursor-pointer hover:underline"
                                            >
                                                {getSeekerName(req)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                {getSeekerEmail(req)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p 
                                                onClick={() => setSelectedUser({ name: getFacilitatorName(req), type: 'Facilitator' })}
                                                className="font-medium text-indigo-600 cursor-pointer hover:underline"
                                            >
                                                {getFacilitatorName(req)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-normal line-clamp-2">
                                                {getOpportunityTitle(req)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-50 text-amber-600 border-amber-200">
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button 
                                                    onClick={() => handleAction(req._id, 'approved')}
                                                    disabled={actionLoadingId === req._id}
                                                    className="p-2 text-emerald-700 bg-emerald-100 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors border border-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                                                    title="Approve Connection"
                                                >
                                                    {actionLoadingId === req._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req._id, 'rejected')}
                                                    disabled={actionLoadingId === req._id}
                                                    className="p-2 text-rose-700 bg-rose-100 hover:bg-rose-600 hover:text-white rounded-lg transition-colors border border-rose-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                                                    title="Reject Request"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Profile Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center relative">
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-50 shadow-sm bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{selectedUser.name}</h3>
                            <p className="text-sm font-medium text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-full mt-2">{selectedUser.type}</p>
                            <div className="mt-6 border-t border-slate-100 pt-6">
                                <p className="text-sm text-slate-500 mb-6">This is a quick admin profile snapshot. Full profile details are available in the expanded view.</p>
                                <button 
                                    onClick={() => setSelectedUser(null)}
                                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                                >
                                    Close Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApprovals;
