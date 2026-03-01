import { useEffect } from 'react';

interface AdminExitModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLogout: () => void;
}

const AdminExitModal = ({ isOpen, onStay, onLogout }: AdminExitModalProps) => {
  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Backdrop: dark overlay with fade-in
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onStay}
    >
      {/* Modal card — stop propagation so clicks inside don't close it */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl p-8 flex flex-col items-center gap-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Text content */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Admin Session Active
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            You must log out to leave the Admin panel.<br />
            Force-navigating away will leave your admin token active and may cause access conflicts across other roles.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onStay}
            className="flex-1 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/10 transition-all duration-200"
          >
            Stay in Admin
          </button>
          <button
            onClick={onLogout}
            className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-900/30 transition-all duration-200"
          >
            Logout Securely
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminExitModal;
