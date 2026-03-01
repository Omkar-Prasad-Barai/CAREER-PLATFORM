import { X, MapPin, DollarSign, Clock, Building } from 'lucide-react';

interface OpportunityDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    opportunity: any;
    onApply: () => void;
}

const OpportunityDetailsModal = ({ isOpen, onClose, opportunity, onApply }: OpportunityDetailsModalProps) => {
    if (!isOpen || !opportunity) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header Section */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 md:p-8 flex justify-between items-start z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{opportunity.title}</h2>
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100 mt-1">
                                {opportunity.category || opportunity.type}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-lg">
                            <Building className="w-5 h-5 mr-2" />
                            {opportunity.company}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-700" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-8 space-y-8">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-sm flex items-center gap-1"><MapPin className="w-4 h-4"/> Location</span>
                            <span className="font-semibold text-gray-900">{opportunity.location}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-sm flex items-center gap-1"><DollarSign className="w-4 h-4"/> Compensation</span>
                            <span className="font-semibold text-gray-900">{opportunity.salary}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-sm flex items-center gap-1"><Clock className="w-4 h-4"/> Type</span>
                            <span className="font-semibold text-gray-900">{opportunity.type}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500 text-sm flex items-center gap-1"><Clock className="w-4 h-4"/> Posted</span>
                            <span className="font-semibold text-gray-900">{opportunity.posted}</span>
                        </div>
                    </div>

                    {/* Role Description */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900">About the Role</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {opportunity.description || "No description provided for this role."}
                        </p>
                    </div>

                    {/* Skills Required */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900">Skills Required</h3>
                        <div className="flex flex-wrap gap-2">
                            {opportunity.skillsRequired?.map((skill: string, idx: number) => (
                                <span key={idx} className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-semibold border border-indigo-100">
                                    {skill}
                                </span>
                            )) || <p className="text-gray-500 italic">Not specified</p>}
                        </div>
                    </div>

                    {/* About Company */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900">About {opportunity.company}</h3>
                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                            <p className="text-blue-900 leading-relaxed">
                                {opportunity.companyAbout || "Learn more about the company on their website."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 md:p-8 flex justify-end">
                    <button 
                        onClick={onApply}
                        className="w-full md:w-auto px-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetailsModal;
