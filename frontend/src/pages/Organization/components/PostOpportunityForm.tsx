import { useState } from 'react';
import { Briefcase, MapPin, IndianRupee, List, ChevronDown, Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { createOpportunity } from '../../../services/apiService';

const PostOpportunityForm = () => {
    const [type, setType] = useState('job'); // job or internship
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const jobType = formData.get('jobType') as string;
        const stipendOrSalary = formData.get('stipendOrSalary') as string;
        const duration = formData.get('duration') as string;
        const eligibility = formData.get('eligibility') as string;
        const skillsRaw = formData.get('skillsRequired') as string;
        const skillsRequired = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

        if (!title || !category) {
            toast.error('Title and Category are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            await createOpportunity({
                title,
                description,
                category,
                type: type === 'internship' ? 'Internship' : 'Full-time',
                jobType: jobType || type,
                stipendOrSalary,
                duration,
                eligibility,
                skillsRequired,
            });
            toast.success(`${type === 'job' ? 'Job' : 'Internship'} posted successfully!`);
            e.currentTarget.reset();
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to create post.' : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Post Current Requirement(s)</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setType('job')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${type === 'job' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Post Job
                    </button>
                    <button 
                         onClick={() => setType('internship')}
                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${type === 'internship' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Post Internship
                    </button>
                </div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" name="title" placeholder={`e.g., ${type === 'job' ? 'Senior React Developer' : 'Frontend Intern'}`} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" required />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <input type="text" name="category" placeholder="e.g., Software Engineering, Digital Marketing" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Work Mode</label>
                        <div className="relative">
                             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <select name="jobType" className="w-full appearance-none pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-slate-700 text-sm cursor-pointer transition-all">
                                <option>On-site / Office</option>
                                <option>Work From Home</option>
                                <option>Hybrid</option>
                                <option>Remote</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Stipend / Salary</label>
                         <div className="relative">
                             <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input type="text" name="stipendOrSalary" placeholder="e.g., ₹5,00,000 - ₹8,00,000/yr or ₹20,000/mo" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Skills Required</label>
                        <div className="relative">
                             <List className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" name="skillsRequired" placeholder="e.g., React, Node.js, TypeScript" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Eligibility Criteria</label>
                        <input type="text" name="eligibility" placeholder="e.g., 2025/2026 Batch" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input type="text" name="duration" placeholder="e.g., 3 Months, 6 Months, 1 Year" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Job Description</label>
                    <textarea rows={6} name="description" placeholder="Describe the role, responsibilities, and perks..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" required></textarea>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Posting...</>
                        ) : (
                            `Post ${type === 'job' ? 'Job' : 'Internship'}`
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostOpportunityForm;
