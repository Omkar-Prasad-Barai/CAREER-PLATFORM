
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const role: UserRole = (roleParam === 'student' || roleParam === 'organization' || roleParam === 'professor') 
    ? roleParam 
    : 'student';
    
  const { loginUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      const user = await loginUser(email, password);
      toast.success(`Welcome back, ${user?.fullName}!`);
      navigate(`/${user?.role}/dashboard`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Invalid credentials';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const roleLabels: Record<Exclude<UserRole, 'guest'>, string> = {
    aspirant: 'Aspirant Portal',
    student: 'Student Portal',
    professional: 'Professional Portal',
    professor: 'Professor Portal',
    organization: 'Organization Portal',
    recruiter: 'Recruiter Portal',
    others: 'Others Portal'
  };

  const roleColors: Record<Exclude<UserRole, 'guest'>, string> = {
    aspirant: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    student: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    professional: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
    professor: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500',
    organization: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
    recruiter: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    others: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to {roleLabels[role]}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent sm:text-sm transition-shadow"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent sm:text-sm transition-shadow"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${roleColors[role]} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
            <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-900 underline">
                Back to role selection
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
