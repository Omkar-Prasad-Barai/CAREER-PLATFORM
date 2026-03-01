import { useState, useEffect } from 'react';
import { Edit, RefreshCw, Trash2, Tag, Calendar, X, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getOpportunities } from '../../../services/apiService';
import type { Opportunity } from '../../../services/apiService';
import { useAuth } from '../../../context/AuthContext';

interface Post {
    id: string;
    title: string;
    type: string;
    status: 'Active' | 'Draft' | 'Closed';
    applications: number;
    postedDate: string;
    skills: string[];
}

const ManageOurPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const allOpps = await getOpportunities();
            // Filter to show only the current user's opportunities
            const myOpps = allOpps.filter((opp: Opportunity) => {
                const facId = typeof opp.facilitatorId === 'object' ? opp.facilitatorId._id : opp.facilitatorId;
                return facId === user?._id;
            });

            const mapped: Post[] = myOpps.map((opp) => ({
                id: opp._id,
                title: opp.title,
                type: opp.jobType || opp.category,
                status: opp.isActive ? 'Active' : 'Closed',
                applications: 0, // Backend doesn't track applicant counts yet
                postedDate: new Date(opp.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                skills: opp.skillsRequired,
            }));
            setPosts(mapped);
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to load posts.' : 'An unexpected error occurred.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter(p => p.id !== id));
            toast.success("Post removed from list.");
        }
    };

    const handleUpdateStatus = (id: string) => {
        setPosts(posts.map(p => {
            if (p.id === id) {
                const newStatus: Post['status'] = p.status === 'Active' ? 'Closed' : p.status === 'Closed' ? 'Draft' : 'Active';
                toast.success(`Status updated to ${newStatus}`);
                return { ...p, status: newStatus };
            }
            return p;
        }));
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-slate-500 font-medium">Loading your posts...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-slate-500">
                <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
            {/* Post Details Modal */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-start text-white">
                            <div>
                                <h3 className="text-xl font-bold mb-1">{selectedPost.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-blue-100">
                                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{selectedPost.type}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{selectedPost.postedDate}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPost(null)} className="text-blue-100 hover:text-white transition-colors p-1 bg-white/10 rounded-full hover:bg-white/20">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Skills Required</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedPost.skills.map((skill, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                                <div className="flex gap-2">
                                     <button onClick={() => { setSelectedPost(null); toast.success('Editing post...'); }} className="flex-1 py-2 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors">Edit</button>
                                     <button onClick={() => { setSelectedPost(null); handleUpdateStatus(selectedPost.id); }} className="flex-1 py-2 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors">Change Status</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Manage Our Posts</h2>
                    <p className="text-sm text-gray-500 mt-1">Review and manage your active and past listings.</p>
                </div>
                <button 
                    onClick={() => fetchPosts()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>
            
            {posts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    <p className="font-medium">No posts yet. Create your first opportunity!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Post Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Skills</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <button onClick={() => setSelectedPost(post)} className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-left focus:outline-none focus:underline">{post.title}</button>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
                                                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{post.type}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.postedDate}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                            post.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                                            post.status === 'Draft' ? 'bg-amber-100 text-amber-800' :
                                            'bg-slate-100 text-slate-800'
                                        )}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {post.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs font-medium rounded border border-slate-100">{skill}</span>
                                            ))}
                                            {post.skills.length > 3 && <span className="text-xs text-slate-400 self-center">+{post.skills.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => toast.success('Editing post...')} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit Post">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleUpdateStatus(post.id)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100" title="Update Status">
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Post">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageOurPosts;
