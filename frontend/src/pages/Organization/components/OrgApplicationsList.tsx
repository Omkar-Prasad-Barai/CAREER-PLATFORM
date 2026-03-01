import { FileText, Check, X, Mail } from 'lucide-react';

const OrgApplicationsList = () => {
    const applications: any[] = [];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-900">Talent Pool</h2>
                 <div className="flex gap-2">
                    <input type="text" placeholder="Search candidates..." className="px-4 py-2 border rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500" />
                 </div>
            </div>
            
            <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase">
                        <tr>
                            <th className="px-6 py-4">Candidate</th>
                            <th className="px-6 py-4">Applied Role</th>
                            <th className="px-6 py-4">Experience</th>
                            <th className="px-6 py-4">Resume</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{app.name}</div>
                                    <div className="text-xs text-gray-500">{app.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {app.role}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {app.experience}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        <FileText className="w-4 h-4" />
                                        View
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                        ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                          app.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' : 
                                          'bg-red-100 text-red-700'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Contact">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Shortlist">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Reject">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {applications.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No applications found.
                </div>
            )}
        </div>
    );
};

export default OrgApplicationsList;
