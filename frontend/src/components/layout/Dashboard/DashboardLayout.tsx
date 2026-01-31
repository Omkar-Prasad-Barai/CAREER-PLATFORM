import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Sidebar, { type SidebarItem } from './Sidebar';
import GlobalDisclaimer from './GlobalDisclaimer';
import NotificationPopover from './NotificationPopover';

interface DashboardLayoutProps {
    children: ReactNode;
    sidebarItems: SidebarItem[];
    role: string;
    onSettingsClick?: () => void;
    activeViewLabel?: string;
    /** Called when user clicks the "[Role] Dashboard" breadcrumb — should reset to overview */
    onOverviewClick?: () => void;
}

/* ──────────────────────────────────────────────
   Role display helpers
   ────────────────────────────────────────────── */

const ROLE_DISPLAY: Record<string, { title: string; path: string }> = {
    student:       { title: 'Student Dashboard',       path: '/student/dashboard' },
    aspirant:      { title: 'Aspirant Dashboard',      path: '/aspirant/dashboard' },
    organization:  { title: 'Organization Dashboard',  path: '/organization/dashboard' },
    professor:     { title: 'Professor Dashboard',     path: '/professor/dashboard' },
    professional:  { title: 'Professional Dashboard',  path: '/professional/dashboard' },
    recruiter:     { title: 'Recruiter Dashboard',     path: '/recruiter/dashboard' },
    others:        { title: 'Community Dashboard',     path: '/others/dashboard' },
    admin:         { title: 'Admin Dashboard',         path: '/admin' },
};

/* ──────────────────────────────────────────────
   SVG Breadcrumb Separator
   ────────────────────────────────────────────── */

const BreadcrumbCaret = () => (
    <svg
        className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mx-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 5l7 7-7 7" />
    </svg>
);

/* ──────────────────────────────────────────────
   Layout
   ────────────────────────────────────────────── */

const DashboardLayout = ({
    children,
    sidebarItems,
    role,
    onSettingsClick,
    activeViewLabel,
    onOverviewClick,
}: DashboardLayoutProps) => {
    const roleInfo = ROLE_DISPLAY[role] || { title: 'Dashboard', path: '/' };

    // Determine dynamic H1
    // If on overview or no label, show full "[Role] Dashboard"
    // Otherwise show the active view label as the page title
    const isOverview = !activeViewLabel || activeViewLabel === 'Overview';
    const pageTitle = isOverview ? roleInfo.title : activeViewLabel;

    // Subtitle helper
    const pageSubtitle = isOverview
        ? 'Welcome back! Here\'s an overview of your activity.'
        : undefined;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 font-sans">
            <Sidebar items={sidebarItems} role={role} onSettingsClick={onSettingsClick} activeLabel={activeViewLabel} />
            
            <div className="lg:pl-64 transition-all duration-300">
                {/* ── Premium Breadcrumb Bar ── */}
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-3.5 px-4 md:px-8 flex justify-between items-center">
                    <nav className="flex items-center text-[13px] overflow-x-auto whitespace-nowrap hide-scrollbar">
                        {/* 1. Home */}
                        <Link
                            to="/"
                            className="text-slate-400 hover:text-indigo-600 transition-colors duration-200 font-medium"
                        >
                            Home
                        </Link>

                        <BreadcrumbCaret />

                        {/* 2. [Role] Dashboard — routes back to overview */}
                        {activeViewLabel && !isOverview ? (
                            <>
                                <button
                                    onClick={onOverviewClick}
                                    className="text-slate-500 hover:text-indigo-600 transition-colors duration-200 font-medium cursor-pointer bg-transparent border-none p-0"
                                >
                                    {roleInfo.title}
                                </button>
                                <BreadcrumbCaret />
                                {/* 3. Current page — static, non-clickable */}
                                <span className="text-slate-800 font-semibold">
                                    {activeViewLabel}
                                </span>
                            </>
                        ) : (
                            /* If on overview, the dashboard title is the final crumb */
                            <span className="text-slate-800 font-semibold">
                                {roleInfo.title}
                            </span>
                        )}
                    </nav>

                    <div className="flex items-center pl-4 border-l border-slate-200/60 ml-4 shrink-0">
                        <NotificationPopover />
                    </div>
                </div>

                {/* ── Dynamic Page Header ── */}
                <div className="px-4 md:px-8 pt-6 pb-2 max-w-7xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        {pageTitle}
                    </h1>
                    {pageSubtitle && (
                        <p className="text-slate-500 text-sm mt-1">{pageSubtitle}</p>
                    )}
                </div>

                <main className="p-4 md:px-8 md:pb-8 md:pt-4 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)]">
                    <div className="flex-1">
                        {/* Keyed wrapper: re-triggers animation on every view change */}
                        <div key={activeViewLabel || 'default'} className="view-transition">
                            {children}
                        </div>
                    </div>
                    <GlobalDisclaimer />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
