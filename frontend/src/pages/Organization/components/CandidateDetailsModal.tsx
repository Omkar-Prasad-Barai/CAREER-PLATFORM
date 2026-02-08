import { X, Github, Linkedin, Globe } from 'lucide-react';

interface CandidateDetailsModalProps {
    candidate: any;
    onClose: () => void;
    onShortlist: (id: number) => void;
}

const CandidateDetailsModal = ({ candidate, onClose, onShortlist }: CandidateDetailsModalProps) => {
    if (!candidate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                        <p className="text-gray-500 font-medium">{candidate.role} • {candidate.experience}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-8 bg-white max-h-[70vh] overflow-y-auto">
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Top Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills?.map((skill: string) => (
                                <span key={skill} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100">{skill}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Education</h3>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900">{candidate.education?.split(',')[0]}</h4>
                            <p className="text-gray-600 text-sm mt-1">Class of {candidate.education?.split(',')[1]?.trim()}</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Links</h3>
                         <div className="flex flex-wrap gap-6">
                            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:underline font-semibold text-sm transition-colors">
                                <Github className="w-5 h-5" /> GitHub
                            </a>
                            <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-semibold text-sm transition-colors">
                                <Linkedin className="w-5 h-5" /> LinkedIn
                            </a>
                            <a href="#" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline font-semibold text-sm transition-colors">
                                <Globe className="w-5 h-5" /> Portfolio
                            </a>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">
                        Close
                    </button>
                    <button onClick={() => { onShortlist(candidate.id); onClose(); }} className="px-6 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-200 rounded-xl transition-all">
                        Shortlist Candidate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailsModal;
