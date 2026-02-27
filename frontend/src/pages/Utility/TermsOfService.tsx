import Footer from '../../components/layout/Footer/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <div className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
                <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 font-bold mb-8 hover:text-blue-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-6 font-display tracking-tight">Terms of Service</h1>
                    <p className="text-slate-500 mb-8 font-medium">Last Updated: October 2026</p>
                    
                    <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">1. Acceptance of Terms</h2>
                            <p>By accessing and using our platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">2. Provision of Services</h2>
                            <p>We are constantly innovating in order to provide the best possible experience for our users. You acknowledge and agree that the form and nature of the Services which we provide may change from time to time without prior notice to you.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">3. Use of the Services</h2>
                            <p>In order to access certain Services, you may be required to provide information about yourself (such as identification or contact details) as part of the registration process for the Service, or as part of your continued use of the Services. You agree that any registration information you give to us will always be accurate, correct and up to date.</p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">4. Security</h2>
                            <p>You agree and understand that you are responsible for maintaining the confidentiality of passwords associated with any account you use to access the Services. Accordingly, you agree that you will be solely responsible to us for all activities that occur under your account.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsOfService;
