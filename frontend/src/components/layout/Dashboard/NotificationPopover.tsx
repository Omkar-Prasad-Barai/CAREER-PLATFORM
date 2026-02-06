import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Link2, UserPlus, ClipboardList, Settings, CheckCheck, Inbox } from 'lucide-react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../../services/apiService';
import type { NotificationItem } from '../../../services/apiService';

/* ── Relative time helper (no external deps) ── */
const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
};

/* ── Icon per notification type ── */
const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
    connection_approved: { icon: Link2, color: 'text-teal-600', bg: 'bg-teal-50' },
    new_applicant:       { icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    application_update:  { icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
    system:              { icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100' },
};

const NotificationPopover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lazy fetch on dropdown open
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch {
            // silently fail — show empty state
            setNotifications([]);
        } finally {
            setLoading(false);
            setHasFetched(true);
        }
    }, []);

    const handleToggle = () => {
        const opening = !isOpen;
        setIsOpen(opening);
        if (opening && !hasFetched) {
            fetchNotifications();
        }
    };

    // Mark all as read
    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch { /* silently fail */ }
    };

    // Mark single as read + navigate
    const handleNotificationClick = async (notif: NotificationItem) => {
        if (!notif.isRead) {
            try {
                await markNotificationRead(notif._id);
                setNotifications(prev =>
                    prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch { /* continue navigation */ }
        }
        if (notif.link) {
            window.location.href = notif.link;
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={popoverRef}>
            {/* Bell Button */}
            <button
                onClick={handleToggle}
                className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center
                        bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl shadow-slate-200/60
                    border border-slate-100 overflow-hidden z-50 animate-slideDown origin-top-right">

                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-indigo-50/30">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            /* Skeleton Loading */
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="p-4 border-b border-slate-50 flex gap-4 animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-slate-200 rounded w-3/4" />
                                        <div className="h-3 bg-slate-100 rounded w-full" />
                                        <div className="h-2 bg-slate-100 rounded w-1/4" />
                                    </div>
                                </div>
                            ))
                        ) : notifications.length === 0 ? (
                            /* Empty State */
                            <div className="py-12 px-6 flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <Inbox className="w-7 h-7 text-slate-400" />
                                </div>
                                <p className="text-sm font-semibold text-slate-700">You're all caught up!</p>
                                <p className="text-xs text-slate-400 mt-1">No new notifications right now.</p>
                            </div>
                        ) : (
                            /* Notification List */
                            notifications.map((notif) => {
                                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
                                const IconComp = config.icon;
                                return (
                                    <div
                                        key={notif._id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-4 border-b border-slate-50 cursor-pointer group transition-colors
                                            ${!notif.isRead
                                                ? 'bg-indigo-50/40 border-l-4 border-l-indigo-500 hover:bg-indigo-50/60'
                                                : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                                            }`}
                                    >
                                        <div className="flex gap-3.5">
                                            <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                                ${config.bg} ${config.color} group-hover:scale-105 transition-transform`}>
                                                <IconComp className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-snug ${!notif.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                                    {notif.message}
                                                </p>
                                                <span className="text-xs text-slate-400 font-medium mt-1.5 block">
                                                    {timeAgo(notif.createdAt)}
                                                </span>
                                            </div>
                                            {!notif.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                            <button
                                onClick={handleMarkAllRead}
                                disabled={unreadCount === 0}
                                className="flex items-center justify-center gap-1.5 mx-auto text-sm font-semibold
                                    text-indigo-600 hover:text-indigo-800 transition-colors
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPopover;
