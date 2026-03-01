import { Eye, FileText } from 'lucide-react';

const ViewCandidates = () => {
    const candidates: any[] = [];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Shortlisted': return 'bg-green-100 text-green-700';
            case 'Interview': return 'bg-blue-100 text-blue-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Sourced Candidates</h2>

            <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="p-5">Candidate Name</th>
                            <th className="p-5">Role & Client</th>
                            <th className="p-5">ATS Match</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {candidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-5 font-medium text-gray-900">{candidate.name}</td>
                                <td className="p-5">
                                    <div className="text-sm font-medium text-gray-900">{candidate.role}</div>
                                    <div className="text-xs text-gray-500">{candidate.client}</div>
                                </td>
                                <td className="p-5">
                                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold">
                                        {candidate.match}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(candidate.status)}`}>
                                        {candidate.status}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Resume">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Profile">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewCandidates;
