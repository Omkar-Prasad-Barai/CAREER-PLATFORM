import React, { useState } from 'react';
import Footer from '../../components/layout/Footer/Footer';
import { ArrowLeft, Send, Mail, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Your message has been sent successfully!');
            // Reset form could go here
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <div className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
                <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 font-bold mb-8 hover:text-blue-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Left Sidebar Info */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl font-extrabold mb-4 font-display tracking-tight">Get in Touch</h1>
                            <p className="text-blue-100 mb-12 font-medium">We'd love to hear from you. Our friendly team is always here to chat.</p>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-full">
                                        <Mail className="w-5 h-5 text-blue-100" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-200">Chat to us</p>
                                        <p className="font-bold">support@careerconnect.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-10 md:w-3/5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-400" /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="John Doe"
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300 bg-slate-50" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400" /> Email Address
                                </label>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="john@example.com"
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300 bg-slate-50" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-slate-400" /> Message
                                </label>
                                <textarea 
                                    rows={5}
                                    required
                                    placeholder="How can we help you?"
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-blue-300 bg-slate-50 resize-none" 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md shadow-blue-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" /> Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
