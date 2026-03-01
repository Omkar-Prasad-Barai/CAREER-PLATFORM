import { useState } from 'react';
import { ShieldCheck, Flag, AlertOctagon, Ban, CheckCircle2, Search, X } from 'lucide-react';
import clsx from 'clsx';

const INITIAL_SPAM_REPORTS: any[] = [];

const AdminSpam = () => {
    const [reports, setReports] = useState(INITIAL_SPAM_REPORTS);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAction = (id: string, action: 'Warned' | 'Suspended' | 'Dismissed') => {
        setReports(prev => prev.map(report => 
            report.id === id ? { ...report, status: action } : report
        ));
    };

    const filteredReports = reports.filter(r => 
        r.reportedUser.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <AlertOctagon className="w-6 h-6 text-rose-500" />
                    Spam & Fraud Control
                </h2>
                <p className="text-slate-500 text-sm mt-1">Review reported users and system-flagged risky accounts.</p>
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">Pending Reports ({reports.filter(r => r.status === 'Pending').length})</h3>
                    </div>
                    
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Reported User</th>
                                <th className="px-6 py-4">Reported By</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={report.reportedUser.avatar} alt="" className="w-10 h-10 rounded-lg border border-slate-200 object-cover" />
                                            <div>
                                                <p className="font-medium text-indigo-600 cursor-pointer hover:underline">{report.reportedUser.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 px-1.5 rounded">{report.reportedUser.type}</span>
                                                    <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]" title={report.reportedUser.email}>{report.reportedUser.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{report.reportedBy.name}</div>
                                        <div className="text-xs text-slate-500">{report.reportedBy.type}</div>
                                    </td>
                                    <td className="px-6 py-4 w-64">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-800 font-medium whitespace-normal line-clamp-2 max-w-xs" title={report.reason}>
                                                {report.reason}
                                            </span>
                                            <span className="text-xs text-slate-400">{report.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                                            report.status === 'Pending' && "bg-amber-50 text-amber-700 border-amber-200",
                                            report.status === 'Suspended' && "bg-rose-50 text-rose-700 border-rose-200",
                                            report.status === 'Warned' && "bg-orange-50 text-orange-700 border-orange-200",
                                            report.status === 'Dismissed' && "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            {report.status === 'Pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}
                                            {report.status === 'Suspended' && <Ban className="w-3 h-3" />}
                                            {report.status === 'Dismissed' && <CheckCircle2 className="w-3 h-3" />}
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleAction(report.id, 'Warned')}
                                                disabled={report.status !== 'Pending'}
                                                className="px-3 py-1.5 text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Send Warning Email"
                                            >
                                                <Flag className="w-3.5 h-3.5" />
                                                Warn
                                            </button>
                                            <button 
                                                onClick={() => handleAction(report.id, 'Suspended')}
                                                disabled={report.status !== 'Pending'}
                                                className="px-3 py-1.5 text-white bg-rose-600 hover:bg-rose-700 border border-rose-700 shadow-sm rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Suspend Account Immediately"
                                            >
                                                <Ban className="w-3.5 h-3.5" />
                                                Suspend
                                            </button>
                                            <button 
                                                onClick={() => handleAction(report.id, 'Dismissed')}
                                                disabled={report.status !== 'Pending'}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Dismiss Report"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredReports.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-50" />
                                        <p>No active spam reports found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSpam;
