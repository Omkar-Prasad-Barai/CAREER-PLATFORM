import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <div className="h-20 w-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <FileQuestion className="w-10 h-10 text-amber-400" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-900/20 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
