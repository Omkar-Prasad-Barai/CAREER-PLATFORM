import { Briefcase } from 'lucide-react';
import { FOOTER_LINKS } from '../../../data/Footer/footerData';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8">
                    <div>
                            <div className="flex items-center gap-2 mb-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">CareerConnect</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Empowering students and professionals to achieve their career goals through curated opportunities and mentorship.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {FOOTER_LINKS.platform.map((link, idx) => (
                                <li key={idx}><Link to={link.href} className="hover:text-blue-600">{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                         <ul className="space-y-2 text-sm text-gray-600">
                            {FOOTER_LINKS.resources.map((link, idx) => (
                                <li key={idx}><Link to={link.href} className="hover:text-blue-600">{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
                         <ul className="space-y-2 text-sm text-gray-600">
                            {FOOTER_LINKS.connect.map((link, idx) => (
                                <li key={idx}><Link to={link.href} className="hover:text-blue-600">{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 CareerConnect. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gray-900">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
