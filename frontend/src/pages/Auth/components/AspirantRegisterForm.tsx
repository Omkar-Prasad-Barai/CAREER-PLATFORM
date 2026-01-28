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

const AspirantRegisterForm = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Name & Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="fullName" placeholder={localNames[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500 ml-0.5">*</span></label>
                <input type="email" name="email" placeholder={localEmails[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Password & Confirm */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-fuchsia-500" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField name="confirmPassword" placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-fuchsia-500" />
            </div>

            {/* Qualification */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Highest Qualification <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="highestQualification" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Qualification" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10th">10th Standard</SelectItem>
                        <SelectItem value="12th">12th Standard</SelectItem>
                        <SelectItem value="graduate">Graduate (Degree)</SelectItem>
                        <SelectItem value="postgraduate">Post-Graduate (Master's)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {/* Institution */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Passed From (School/College) <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="passedFrom" placeholder="e.g., BJB Autonomous College" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Timeline */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year of Passing <span className="text-red-500 ml-0.5">*</span></label>
                <input type="number" name="yearOfPassing" min="1990" max="2040" placeholder="e.g., 2022" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Gap Years */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gap Years / Time Since Study</label>
                <input type="number" name="gapYears" min="0" placeholder="e.g., 1 or 2" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Preparation Target - Full Width */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Currently Preparing For <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="preparingFor" placeholder="e.g., Govt Exams (OAS, UPSC), IT / Private Jobs, Skill Learning..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" required />
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-gray-700 bg-white"
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
                <input type="text" name="languages" placeholder="e.g., English, Hindi, Odia" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Skills - Full Width */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Top Skills (Comma separated) <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="skills" placeholder="React, Python, Copywriting..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all" required />
            </div>

        </div>
    );
};

export default AspirantRegisterForm;
