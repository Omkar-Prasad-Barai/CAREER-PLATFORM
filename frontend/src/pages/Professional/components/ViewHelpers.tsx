import { Eye, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const ViewHelpers = () => {
    const helpers: any[] = [];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Accepted': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Helpers Applied</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {helpers.map((helper) => (
                    <div key={helper.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                                    {helper.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{helper.name}</h3>
                                    <p className="text-sm text-gray-500">Applied for: <span className="font-medium text-gray-700">{helper.gig}</span></p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(helper.status)}`}>
                                {helper.status === 'Pending' && <Clock className="w-3 h-3" />}
                                {helper.status === 'Accepted' && <CheckCircle className="w-3 h-3" />}
                                {helper.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                                {helper.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                            <p className="text-xs text-gray-400">Applied {helper.applied}</p>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Resume">
                                    <FileText className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Profile">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        {helper.status === 'Pending' && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <button className="py-2 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">Accept</button>
                                <button className="py-2 text-xs font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewHelpers;
