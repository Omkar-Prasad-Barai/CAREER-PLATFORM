import type { ReactNode } from 'react';
import { FolderSearch } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  className?: string;
}

interface EmptyStateProps {
  /** Lucide icon element to display — defaults to FolderSearch */
  icon?: ReactNode;
  /** Bold heading — defaults to "It's a bit empty here!" */
  title?: string;
  /** Descriptive message below the heading */
  message?: string;
  /** Optional call-to-action button */
  action?: EmptyStateAction;
  className?: string;
}

/**
 * EmptyState — single-source-of-truth empty state component used across all
 * dashboard entity tables and lists. Fully dark-mode safe.
 *
 * Usage:
 *   <EmptyState
 *     message="No applications yet. Create your first opportunity!"
 *     action={{ label: 'Post Opportunity', onClick: () => setView('post') }}
 *   />
 */
const EmptyState = ({
  icon,
  title = "It's a bit empty here!",
  message = 'Nothing to show right now.',
  action,
  className = '',
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
  >
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-indigo-200 dark:bg-indigo-900/40 blur-xl opacity-50 rounded-full" />
      <div className="relative z-10 w-20 h-20 bg-gray-50 dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-800/60 rounded-full flex items-center justify-center shadow-inner">
        {icon ?? <FolderSearch className="w-9 h-9 text-gray-400 dark:text-gray-500" />}
      </div>
    </div>

    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>

    {message && (
      <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
        {message}
      </p>
    )}

    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className={
          action.className ??
          'px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-none'
        }
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
