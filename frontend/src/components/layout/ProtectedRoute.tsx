
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { user, isAuthenticated, isLoading, isLoggingOut } = useAuth();

  // Phase 1: Auth state not yet resolved — show spinner, never crash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Phase 2: Intentional logout in progress — stand down, do NOT redirect to /auth
  // AuthContext.logout() owns the navigation target during this window
  if (isLoggingOut) {
    return null;
  }

  // Phase 3: Auth resolved but no user — genuine unauthenticated access, redirect to /auth
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Phase 4: User exists but wrong role — redirect to /unauthorized
  if (user?.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Phase 5: Fully authorized — render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
