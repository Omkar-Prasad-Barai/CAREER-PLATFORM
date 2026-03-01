import { User, Mail, HelpCircle } from 'lucide-react';
import PasswordField from "../../../components/common/PasswordField"
import { localNames, localEmails, passwordPlaceholder } from "../../../data/placeholderData"

const OthersRegisterForm = () => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text"
                        name="fullName"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                        placeholder={localNames[3]} required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="email"
                        name="email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                        placeholder={localEmails[3]} required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">What are you looking for? <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <HelpCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text"
                        name="lookingFor"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                        placeholder="Exploring opportunities..." required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-gray-500" />
            </div>
        </div>
    );
};

export default OthersRegisterForm;
