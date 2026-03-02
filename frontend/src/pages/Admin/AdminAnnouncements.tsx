import { useState, useEffect, useCallback } from 'react';
import {
    Megaphone, Plus, Pencil, Trash2, Check, X,
    Loader2, AlertCircle, ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '../../services/apiService';
import type { AnnouncementData } from '../../services/apiService';

const EMPTY_FORM = { message: '', emoji: '🔥', priority: 0, isActive: true };

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Per-row action loading
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fetchAnnouncements = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllAnnouncements(1, 50);
            setAnnouncements(data);
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Failed to load announcements.'
                : 'An unexpected error occurred.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

    const handleEdit = (a: AnnouncementData) => {
        setEditingId(a._id);
        setForm({ message: a.message, emoji: a.emoji, priority: a.priority, isActive: a.isActive });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.message.trim()) {
            toast.error('Announcement message is required.');
            return;
        }
        setSubmitting(true);
        try {
            if (editingId) {
                const updated = await updateAnnouncement(editingId, form);
                setAnnouncements(prev => prev.map(a => a._id === editingId ? updated : a));
                toast.success('Announcement updated!');
                setEditingId(null);
            } else {
                const created = await createAnnouncement(form);
                setAnnouncements(prev => [created, ...prev]);
                toast.success('Announcement created!');
            }
            setForm(EMPTY_FORM);
        } catch (err: unknown) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message || 'Failed to save announcement.'
                : 'An unexpected error occurred.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleActive = async (a: AnnouncementData) => {
        setActionLoadingId(a._id);
        try {
            const updated = await updateAnnouncement(a._id, { isActive: !a.isActive });
            setAnnouncements(prev => prev.map(x => x._id === a._id ? updated : x));
            toast.success(`Announcement ${updated.isActive ? 'activated' : 'deactivated'}.`);
        } catch {
            toast.error('Failed to toggle status.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (deleteConfirmId !== id) {
            setDeleteConfirmId(id);
            return;
        }
        setActionLoadingId(id);
        setDeleteConfirmId(null);
        try {
            await deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a._id !== id));
            toast.success('Announcement deleted.');
        } catch {
            toast.error('Failed to delete announcement.');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Announcements</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage the platform-wide announcement banner displayed to all users.</p>
                </div>
                <button
                    onClick={fetchAnnouncements}
                    title="Refresh"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Create / Edit Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200">
                        {editingId ? <Pencil className="w-4 h-4 text-indigo-600" /> : <Plus className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <h3 className="font-semibold text-slate-800">
                        {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                                Message <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                placeholder="e.g. Applications are now open for 2025 Summer Internships!"
                                rows={2}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 resize-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Emoji</label>
                            <input
                                type="text"
                                value={form.emoji}
                                onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                                placeholder="🔥"
                                maxLength={4}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Priority</label>
                            <input
                                type="number"
                                value={form.priority}
                                onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))}
                                min={0}
                                max={100}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
                            />
                            <p className="text-xs text-slate-400 mt-1">Higher = shown first (0–100)</p>
                        </div>
                        <div className="flex items-center gap-3 pt-5">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-checked:bg-indigo-600 rounded-full peer transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                                <span className="ml-3 text-sm font-medium text-slate-700">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-60"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {editingId ? 'Save Changes' : 'Create Announcement'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Announcements Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center border border-amber-200">
                        <Megaphone className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">All Announcements ({announcements.length})</h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
                        <span className="ml-3 text-slate-500 font-medium">Loading announcements…</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                        <p className="font-medium">{error}</p>
                        <button onClick={fetchAnnouncements} className="mt-4 text-sm text-indigo-600 hover:underline">Try again</button>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="py-16 text-center">
                        <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-semibold">No announcements yet.</p>
                        <p className="text-slate-400 text-sm mt-1">Use the form above to create the first one.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wide">
                                <tr>
                                    <th className="px-6 py-4">Emoji</th>
                                    <th className="px-6 py-4">Message</th>
                                    <th className="px-6 py-4 text-center">Priority</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {announcements.map((a) => (
                                    <tr key={a._id} className={`hover:bg-slate-50/50 transition-colors ${editingId === a._id ? 'bg-indigo-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <span className="text-2xl">{a.emoji || '📢'}</span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-slate-700 font-medium line-clamp-2">{a.message}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg">
                                                {a.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleActive(a)}
                                                disabled={actionLoadingId === a._id}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
                                                title={a.isActive ? 'Click to deactivate' : 'Click to activate'}
                                            >
                                                {actionLoadingId === a._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                                ) : a.isActive ? (
                                                    <>
                                                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                                                        <span className="text-emerald-600">Active</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                                                        <span className="text-slate-400">Inactive</span>
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleEdit(a)}
                                                    className="p-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors border border-indigo-100"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(a._id)}
                                                    disabled={actionLoadingId === a._id}
                                                    className={`p-2 rounded-lg transition-colors border disabled:opacity-50 ${
                                                        deleteConfirmId === a._id
                                                            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                                                            : 'text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white border-rose-100'
                                                    }`}
                                                    title={deleteConfirmId === a._id ? 'Click again to confirm delete' : 'Delete'}
                                                >
                                                    {actionLoadingId === a._id
                                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                                        : <Trash2 className="w-4 h-4" />
                                                    }
                                                </button>
                                            </div>
                                            {deleteConfirmId === a._id && (
                                                <p className="text-[10px] text-rose-500 text-right mt-1">Click trash again to confirm</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnnouncements;
