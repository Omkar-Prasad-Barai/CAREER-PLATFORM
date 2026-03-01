


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import PasswordField from "../../../components/common/PasswordField"
import { professorName, localEmails, passwordPlaceholder } from "../../../data/placeholderData"

const ProfessorRegisterForm = () => {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500 ml-0.5">*</span></label>
                    <input type="text" name="fullName" placeholder={professorName} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500 ml-0.5">*</span></label>
                    <input type="email" name="email" placeholder={localEmails[2]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" required />
                </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-orange-500" />
            </div>

            {/* Institute & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Institute / College <span className="text-red-500 ml-0.5">*</span></label>
                    <input type="text" name="institute" placeholder="National Institute of Technology" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Department <span className="text-red-500 ml-0.5">*</span></label>
                    <input type="text" name="department" placeholder="Computer Science & Engineering" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" required />
                </div>
            </div>

            {/* Expertise */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Domain Expertise <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="domainExpertise" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Domain" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="AI_ML">Artificial Intelligence / ML</SelectItem>
                        <SelectItem value="WebDev">Web Development</SelectItem>
                        <SelectItem value="DataScience">Data Science</SelectItem>
                        <SelectItem value="Electronics">Electronics & VLSI</SelectItem>
                        <SelectItem value="Research">Pure Research</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Opportunities */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Interest in Mentoring For <span className="text-red-500 ml-0.5">*</span></label>
                <div className="flex flex-wrap gap-4">
                    {['Research Internships', 'Project Mentorship', 'Paid Opportunities', 'Unpaid Guidance'].map((item) => (
                        <label key={item} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-orange-50 cursor-pointer transition-colors group">
                            <input type="checkbox" name="mentoringInterests" value={item} className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300" />
                            <span className="text-sm text-gray-700 group-hover:text-orange-700 font-medium">{item}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfessorRegisterForm;
