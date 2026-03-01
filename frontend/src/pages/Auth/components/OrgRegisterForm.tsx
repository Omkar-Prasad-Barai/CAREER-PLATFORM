


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import PasswordField from "../../../components/common/PasswordField"
import { localNames, localEmails, passwordPlaceholder } from "../../../data/placeholderData"

const OrgRegisterForm = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Company Name */}
            <div className="space-y-2 md:col-span-6">
                <label className="text-sm font-medium text-gray-700">Company Name <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="fullName" placeholder="Tech Innovators Inc." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Official Email & Contact Phone Number */}
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Official Email <span className="text-red-500 ml-0.5">*</span></label>
                <input type="email" name="email" placeholder={localEmails[1]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Contact Phone Number</label>
                <input type="tel" name="contactPhone" placeholder="e.g., +91 9876543210" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Password & Confirm Password */}
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-teal-500" />
            </div>
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500 ml-0.5">*</span></label>
                <PasswordField name="confirmPassword" placeholder={passwordPlaceholder} className="pl-12" focusRingColor="focus:ring-teal-500" />
            </div>

            {/* HR Name & Headquarters Location */}
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">HR / Point of Contact Name <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="hrName" placeholder={localNames[1]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Headquarters Location <span className="text-red-500 ml-0.5">*</span></label>
                <input type="text" name="hqLocation" placeholder="Bhubaneswar, Odisha" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" required />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-6">
                <label className="text-sm font-medium text-gray-700">Address <span className="text-red-500 ml-0.5">*</span></label>
                <textarea 
                    name="address"
                    rows={3}
                    placeholder="Enter the full registered address of your organization..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-y" 
                    required 
                />
            </div>

            {/* Company Type, Industry / Domain, & Company Size */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Company Type <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="companyType" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Legal & Ownership</SelectLabel>
                            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="LLP">Limited Liability Partnership (LLP)</SelectItem>
                            <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                            <SelectItem value="Private Limited">Private Limited Company</SelectItem>
                            <SelectItem value="Public Limited">Public Limited Company</SelectItem>
                            <SelectItem value="OPC">One Person Company (OPC)</SelectItem>
                            <SelectItem value="C Corp">C Corporation</SelectItem>
                            <SelectItem value="S Corp">S Corporation</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Scale & Reach</SelectLabel>
                            <SelectItem value="Startup">Startup</SelectItem>
                            <SelectItem value="MSME">MSME</SelectItem>
                            <SelectItem value="MNC">Multinational Corporation (MNC)</SelectItem>
                            <SelectItem value="Conglomerate">Conglomerate</SelectItem>
                            <SelectItem value="Holding">Holding Company</SelectItem>
                            <SelectItem value="Subsidiary">Subsidiary</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Purpose & Control</SelectLabel>
                            <SelectItem value="For-Profit">For-Profit</SelectItem>
                            <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                            <SelectItem value="Section 8">Section 8 Company</SelectItem>
                            <SelectItem value="Cooperative">Cooperative</SelectItem>
                            <SelectItem value="Statutory">Statutory Corporation</SelectItem>
                            <SelectItem value="Government">Government Company</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Industry / Domain <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="industry" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="IT & Software">IT & Software</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Marketing & Agency">Marketing & Agency</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Company Size <span className="text-red-500 ml-0.5">*</span></label>
                <Select name="companySize" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1-10">1-10 Employees</SelectItem>
                        <SelectItem value="11-50">11-50 Employees</SelectItem>
                        <SelectItem value="51-200">51-200 Employees</SelectItem>
                        <SelectItem value="201-500">201-500 Employees</SelectItem>
                        <SelectItem value="500+">500+ Employees</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Year Established & Website URL */}
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Year Established <span className="text-red-500 ml-0.5">*</span></label>
                <input type="number" name="yearEstablished" placeholder="e.g., 2015" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" required />
            </div>
            <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Website URL <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span></label>
                <input type="url" name="websiteUrl" placeholder="https://www.example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Hiring For & Please Specify */}
            <div className="space-y-3 md:col-span-6">
                <label className="text-sm font-medium text-gray-700">Currently Hiring For <span className="text-red-500 ml-0.5">*</span></label>
                <div className="flex flex-wrap gap-4 mb-3">
                    {['Internships', 'Full-time Jobs', 'Others'].map((item) => (
                        <label key={item} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-teal-50 cursor-pointer transition-colors group">
                            <input type="checkbox" name="hiringFor" value={item} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300" />
                            <span className="text-sm text-gray-700 group-hover:text-teal-700 font-medium">{item}</span>
                        </label>
                    ))}
                </div>
                <input type="text" name="hiringForOther" placeholder="Please Specify (If Others) e.g., Freelance, Contract roles..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" />
            </div>
        </div>
    );
};

export default OrgRegisterForm;
