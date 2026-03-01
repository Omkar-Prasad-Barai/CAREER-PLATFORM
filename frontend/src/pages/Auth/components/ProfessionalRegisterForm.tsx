import { User, Mail, Briefcase, Award, Phone, Building } from 'lucide-react';
import PasswordField from "../../../components/common/PasswordField"
import { localNames, localEmails, passwordPlaceholder } from "../../../data/placeholderData"

const ProfessionalRegisterForm = () => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text"
                        name="fullName"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder={localNames[4]} required />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="email"
                        name="email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder={localEmails[4]} required />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Contact Number <span className="text-red-500 ml-0.5">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input type="tel"
                            name="contactNumber"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder="+91 98765 43210" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Organization Name <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                    <div className="relative">
                        <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input type="text"
                            name="organizationName"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            placeholder="Current Company" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Profession Title <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text"
                        name="professionTitle"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="e.g. Senior Software Engineer" required />
                </div>
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Key Skills <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <Award className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text"
                        name="skills"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="e.g. React, Node.js, Python" required />
                </div>
            </div>

             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-indigo-500" />
            </div>
        </div>
    );
};

export default ProfessionalRegisterForm;
