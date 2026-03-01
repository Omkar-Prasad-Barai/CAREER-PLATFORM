import { User, Mail, Building2 } from 'lucide-react';
import PasswordField from "../../../components/common/PasswordField"
import { localNames, localEmails, passwordPlaceholder } from "../../../data/placeholderData"

const RecruiterRegisterForm = () => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text"
                        name="fullName"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder={localNames[1]} required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Name <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text"
                        name="companyName"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="Tech Innovations India" required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Work Email <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="email"
                        name="email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder={localEmails[1]} required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-emerald-500" />
            </div>
        </div>
    );
};

export default RecruiterRegisterForm;
