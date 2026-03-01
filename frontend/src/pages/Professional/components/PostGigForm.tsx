
import { Layers, Zap, MapPin, DollarSign, Clock } from 'lucide-react';

const PostGigForm = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Gig / Task</h2>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Gig Posted!'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Gig Title</label>
                        <input type="text" placeholder="e.g., Need a Video Editor for YouTube Channel" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10">
                                <option>Design & Creative</option>
                                <option>Tech & Development</option>
                                <option>Photography & Video</option>
                                <option>Event Management</option>
                                <option>Content Writing</option>
                                <option>Manual Help / Errands</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Work Type</label>
                         <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10">
                                <option>One-time Task</option>
                                <option>Short-term Contract</option>
                                <option>Part-time</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mode</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10">
                                <option>Remote</option>
                                <option>On-site / Local</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Payment / Stipend</label>
                         <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select className="pl-10">
                                <option>Fixed Amount</option>
                                <option>Hourly Rate</option>
                                <option>Unpaid / Experience Only</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-700">Amount (Estimated)</label>
                         <input type="text" placeholder="e.g., ₹2,000 or ₹500/hr" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Skills Required</label>
                         <div className="relative">
                            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="e.g., Adobe Premiere Pro, Canon Photography, Event Planning" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Gig Description</label>
                    <textarea rows={6} placeholder="Describe the task in detail. What exactly do you need done? What are the deliverables?" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required></textarea>
                </div>

                <div className="pt-4">
                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 w-full md:w-auto transform hover:-translate-y-1">
                        Post Gig
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostGigForm;
