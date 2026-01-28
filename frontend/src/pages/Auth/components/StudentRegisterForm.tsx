import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon } from "lucide-react"
import PasswordField from "../../../components/common/PasswordField"
import { localNames, localEmails, passwordPlaceholder } from "../../../data/placeholderData"

const StudentRegisterForm = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Name & Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="fullName" placeholder={localNames[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500 ml-0.5">*</span></label>
                <input type="email" name="email" placeholder={localEmails[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Password & Confirm */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField name="confirmPassword" placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-blue-500" />
            </div>

            {/* College Name - Full Width */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">College / University / Institution Name <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="college" placeholder="University of Technology" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Degree & Branch */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Degree <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="degree" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Degree" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                        <SelectItem value="BTech">B.Tech</SelectItem>
                        <SelectItem value="MTech">M.Tech</SelectItem>
                        <SelectItem value="BCA">BCA</SelectItem>
                        <SelectItem value="MCA">MCA</SelectItem>
                        <SelectItem value="BSc">B.Sc</SelectItem>
                        <SelectItem value="MSc">M.Sc</SelectItem>
                        <SelectItem value="BA">BA</SelectItem>
                        <SelectItem value="MA">MA</SelectItem>
                        <SelectItem value="BCom">B.Com</SelectItem>
                        <SelectItem value="MCom">M.Com</SelectItem>
                        <SelectItem value="BBA">BBA</SelectItem>
                        <SelectItem value="MBA">MBA</SelectItem>
                        <SelectItem value="BPharm">B.Pharm</SelectItem>
                        <SelectItem value="MPharm">M.Pharm</SelectItem>
                        <SelectItem value="LLB">LLB</SelectItem>
                        <SelectItem value="BALLB">BA LLB</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Branch / Specialization <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="branch" placeholder="Computer Science" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Year of Study & Experience */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year of Study <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="yearOfStudy" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="5">5th Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Experience (in Years)</label>
                <input type="number" name="experience" step="0.5" min="0" placeholder="e.g., 1 or 0.5" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Timeline */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year of Joining <span className="text-red-500 ml-0.5">*</span></label>
                <input type="number" name="yearOfJoining" min="1990" max="2030" placeholder="e.g., 2021" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year of Passing <span className="text-red-500 ml-0.5">*</span></label>
                <input type="number" name="yearOfPassing" min="1990" max="2040" placeholder="e.g., 2025" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Demographics Row 1 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth <span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                    <DatePicker required
                        name="dob"
                        selected={startDate}
                        onChange={(date: Date | null) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        maxDate={new Date()}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 bg-white"
                        wrapperClassName="w-full"
                    />
                    <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="gender" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Demographics Row 2 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Marital Status <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="maritalStatus" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Single">Single / Unmarried</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Language Preferences <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="languages" placeholder="e.g., English, Hindi, Odia" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Skills - Full Width */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Top Skills (Comma separated) <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="skills" placeholder="React, Python, Data Structures..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Career Interest - Full Width */}
            <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Career Interests <span className="text-red-500 ml-0.5">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['Internship', 'Higher Studies', 'Freelancing / Part-Time', 'Full-time Job'].map((interest) => (
                        <label key={interest} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group">
                            <input type="checkbox" name="careerInterests" value={interest} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                            <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium">{interest}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentRegisterForm;
