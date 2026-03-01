import { Eye, FileText } from 'lucide-react';

const ViewResponses = () => {
    const responses: any[] = [];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Volunteer Responses</h2>

            <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="p-5">Volunteer Name</th>
                            <th className="p-5">Opportunity</th>
                            <th className="p-5">Application Date</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {responses.map((response) => (
                            <tr key={response.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-5 font-medium text-gray-900">{response.name}</td>
                                <td className="p-5 text-gray-600">{response.task}</td>
                                <td className="p-5 text-gray-500 text-sm">{response.date}</td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(response.status)}`}>
                                        {response.status}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Download Response">
                                            <FileText className="w-4 h-4" />
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

export default ViewResponses;
