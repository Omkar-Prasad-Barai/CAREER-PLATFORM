import { useState } from 'react';
import { Heart, Clock, MapPin, Gift, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { createOpportunity } from '../../../services/apiService';

const PostOpportunityForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const jobType = formData.get('jobType') as string;
        const stipendOrSalary = formData.get('perks') as string || 'Voluntary';

        if (!title || !category) {
            toast.error('Title and Type are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            await createOpportunity({
                title,
                category,
                jobType: jobType || 'Volunteering',
                stipendOrSalary,
            });
            toast.success('Opportunity posted successfully!');
            e.currentTarget.reset();
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to create post.' : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Volunteering / Research Opportunity</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Opportunity Title</label>
                        <input type="text" name="title" placeholder="e.g., Beach Cleanup Drive or Psychology Survey" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <div className="relative">
                            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select name="category" className="pl-10">
                                <option>Volunteering</option>
                                <option>Survey / Research Participation</option>
                                <option>Event Organization</option>
                                <option>Miscellaneous Impact Work</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Duration / Commitment</label>
                         <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" name="jobType" placeholder="e.g., 2 Weeks, 3 Hours, One Afternoon" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select name="location" className="pl-10">
                                <option>Online / Remote</option>
                                <option>In-Person (Specify City in Desc)</option>
                                <option>Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Perks for Students</label>
                         <div className="relative">
                            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select name="perks" className="pl-10">
                                <option>Certificate of Appreciation</option>
                                <option>Letter of Recommendation</option>
                                <option>Food / Travel Allowance</option>
                                <option>Volunteer Hours Credit</option>
                                <option>None (Purely Voluntary)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea rows={6} name="description" placeholder="Describe the cause, the task, and the impact the student will make..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all" required></textarea>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 w-full md:w-auto transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Posting...</>
                        ) : (
                            'Post Opportunity'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostOpportunityForm;
