import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            You do not have permission to access this page. 
            Please log in with the correct credentials for this role.
          </p>
        </div>
        <Link
          to="/auth"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-900/20 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
