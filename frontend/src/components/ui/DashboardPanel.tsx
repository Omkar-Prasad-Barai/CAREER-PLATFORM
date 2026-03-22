import type { ReactNode } from 'react';

interface DashboardPanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * DashboardPanel — single-source-of-truth container for dashboard cards,
 * tables, and application lists. Dark-mode safe by default.
 *
 * Usage: wrap any table or list container with this component instead of a
 * bare <div className="bg-white ..."> so dark mode is handled globally.
 */
const DashboardPanel = ({ children, className = '' }: DashboardPanelProps) => (
  <div
    className={`bg-white dark:bg-[#16181d] border border-gray-100 dark:border-gray-800/60 rounded-2xl shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

export default DashboardPanel;
