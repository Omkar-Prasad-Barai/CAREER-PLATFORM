import { Briefcase, Building2, Clock, Users, GraduationCap, DollarSign } from 'lucide-react';

const PostJobForm = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Job / Internship</h2>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Job Posted!'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Job Title</label>
                         <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="e.g., Junior Java Developer" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Hiring For (Client)</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="e.g., Top FinTech Client (or Confidential)" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Role Type</label>
                         <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10">
                                <option>Full-time</option>
                                <option>Internship</option>
                                <option>Contract</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Experience Level</label>
                         <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10">
                                <option>Fresher (0-1 Years)</option>
                                <option>1-2 Years</option>
                                <option>2-4 Years</option>
                                <option>Senior (5+ Years)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Salary Range / Stipend</label>
                         <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="e.g., 4-6 LPA or 15k/month" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Required Degree / Branch</label>
                         <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="e.g., B.Tech CS/IT, MCA, Any Graduate" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Job Description</label>
                    <textarea rows={6} placeholder="Detailed job description, responsibilities, and selection process..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required></textarea>
                </div>

                <div className="pt-4">
                    <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 w-full md:w-auto transform hover:-translate-y-1">
                        Post Opportunity
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJobForm;
