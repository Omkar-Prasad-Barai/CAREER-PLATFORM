import Footer from '../../components/layout/Footer/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <div className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
                <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 font-bold mb-8 hover:!text-blue-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-6 font-display tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 mb-8 font-medium">Last Updated: October 2026</p>
                    
                    <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">1. Information We Collect</h2>
                            <p>We collect information that you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">2. How We Use Information</h2>
                            <p>We may use the information we collect about you to:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-600">
                                <li>Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages;</li>
                                <li>Perform internal operations necessary to provide our Services, including to troubleshoot software bugs and operational problems;</li>
                                <li>Send or facilitate communications between you and a Driver, such as estimated times of arrival (ETAs).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">3. Sharing of Information</h2>
                            <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-600">
                                <li>With Drivers to enable them to provide the Services you request.</li>
                                <li>With third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us;</li>
                                <li>With the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our Services that are viewable by the general public.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
