import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface ApplicationFormProps {
    isOpen: boolean;
    onClose: () => void;
    jobTitle: string;
    onSubmit?: (jobTitle: string) => void;
}

const ApplicationForm = ({ isOpen, onClose, jobTitle, onSubmit }: ApplicationFormProps) => {
    if (!isOpen) return null;

    const [step, setStep] = useState(1); // 1: Personal, 2: Academic, 3: Skills/Extras

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Apply for {jobTitle}</h2>
                        <p className="text-sm text-gray-500">Complete the form to submit your application.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                        ))}
                    </div>

                    <form className="space-y-6" onSubmit={(e) => { 
                        e.preventDefault(); 
                        if (onSubmit) {
                            onSubmit(jobTitle);
                        } else {
                            alert('Application Submitted!'); 
                        }
                        onClose(); 
                    }}>
                        
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <h3 className="font-semibold text-lg">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" required />
                                    <input type="email" placeholder="Email Address" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" required />
                                    <input type="tel" placeholder="Phone Number" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" required />
                                    <input type="text" placeholder="College Name" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" required />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <h3 className="font-semibold text-lg">Academic Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Course (e.g., B.Tech)" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" required />
                                    <input type="text" placeholder="Branch" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" required />
                                    <select>
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                    <input type="number" placeholder="CGPA" step="0.01" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" required />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Skills</h3>
                                    <input type="text" placeholder="Enter skills separated by commas (e.g., React, Node.js)" className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Why are you interested?</h3>
                                    <textarea placeholder="Tell us why you're a good fit..." className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full min-h-[100px]" required></textarea>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Resume</h3>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">Click to upload your resume (PDF)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                                    Back
                                </button>
                            ) : <div></div>}
                            
                            {step < 3 ? (
                                <button type="button" onClick={() => setStep(step + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                    Next
                                </button>
                            ) : (
                                <button type="submit" className="px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                                    Submit Application
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
