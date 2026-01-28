
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Building2, UserCheck, ChevronRight, ArrowLeft } from 'lucide-react';


const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back to Home page
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
          Choose Your Path
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Select your role to get started with CareerConnect.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl w-full">
          {/* Student Role */}
          <div 
              onClick={() => handleRoleSelect('student')}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group border border-gray-100"
          >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Student</h2>
              <p className="text-gray-500 mb-6">Find internships, jobs, and mentorship opportunities.</p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
              </div>
          </div>

          {/* Organization Role */}
          <div 
              onClick={() => handleRoleSelect('organization')}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group border border-gray-100"
          >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors">
                  <Building2 className="w-7 h-7 md:w-8 md:h-8 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Organization</h2>
              <p className="text-gray-500 mb-6">Post jobs, hire talent, and manage applications.</p>
              <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
              </div>
          </div>

          {/* Professor Role */}
          <div 
              onClick={() => handleRoleSelect('professor')}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group border border-gray-100"
          >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                  <UserCheck className="w-7 h-7 md:w-8 md:h-8 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Professor</h2>
              <p className="text-gray-500 mb-6">Mentor students and post research projects.</p>
              <div className="flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
              </div>
          </div>
      </div>
    </div>
  );
};

export default RoleSelection;
