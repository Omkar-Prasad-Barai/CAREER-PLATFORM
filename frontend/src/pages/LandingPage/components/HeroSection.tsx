import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { HERO_SLIDES } from '../../../data/LandingPage/heroData';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlighter } from '../../../components/ui/highlighter';
import SeekersGrid from './SeekersGrid';
import FacilitatorsGrid from './FacilitatorsGrid';
import { useAuth } from '../../../context/AuthContext';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const isSeeker = isAuthenticated && (user?.role === 'student' || user?.role === 'aspirant');

    const QUESTIONS = [
        { 
            text: <span className="group">Are you a <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">PROFESSIONAL</span> seeking projects and <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">INTERNS</span> ?</span>, 
            type: "fade" 
        },
        { 
            text: <span className="group">Are you a <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">RECRUITER</span> searching for exceptional <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">TALENT</span> ?</span>, 
            type: "slide-up" 
        },
        { 
            text: <span className="group">Are you hiring top <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 magic-underline">YOUNG TALENT</span> for your <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 magic-underline">ORGANIZATION</span>?</span>, 
            type: "typewriter" 
        },
        { 
            text: <span className="group">Are you a <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">PROFESSOR</span> needing projects and <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">SCHOLARS</span> ?</span>, 
            type: "zoom-in" 
        },
        { 
            text: <span className="group">Are you a <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">STUDENT</span> searching for internships & <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">PROJECTS</span> ?</span>, 
            type: "slide-down" 
        },
        { 
            text: <span className="group">Are you an <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">ASPIRANT</span> preparing for competitive <span className="uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">EXAMS</span> ?</span>, 
            type: "zoom-out" 
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isHovered) return; // Pause on hover, wait to tick again when resumed.

        const questionTimer = setInterval(() => {
            setCurrentQuestion((prev) => (prev + 1) % QUESTIONS.length);
        }, 4000); // 4000ms duration
        return () => clearInterval(questionTimer);
    }, [isHovered, QUESTIONS.length]);



    const getVariants = (type: string) => {
        switch (type) {
            case 'typewriter':
                return {
                    initial: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: 0 },
                    animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, transition: { duration: 1.5, ease: "easeInOut" as const } },
                    exit: { opacity: 0, transition: { duration: 0.5 } }
                };
            case 'fade':
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" as const } },
                    exit: { opacity: 0, transition: { duration: 0.8 } }
                };
            case 'slide-up':
                return {
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
                    exit: { opacity: 0, y: -30, transition: { duration: 0.5 } }
                };
            case 'slide-down':
                return {
                    initial: { opacity: 0, y: -30 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
                    exit: { opacity: 0, y: 30, transition: { duration: 0.5 } }
                };
            case 'zoom-out':
                return {
                    initial: { opacity: 0, scale: 1.15 },
                    animate: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } },
                    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } }
                };
            case 'zoom-in':
                return {
                    initial: { opacity: 0, scale: 0.85 },
                    animate: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } },
                    exit: { opacity: 0, scale: 1.1, transition: { duration: 0.5 } }
                };
            default:
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 }
                };
        }
    };

    return (
        <>
            {/* Static Background Layer */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300/30 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] left-[50%] w-[30%] h-[30%] bg-emerald-200/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Main Content Wrapper */}
            <div className="relative min-h-screen w-full flex flex-col items-center pt-16 pb-20">

             {/* Background Slides */}
            <div className="absolute inset-0 h-full w-full pointer-events-none">
                {HERO_SLIDES.map((slide, index) => (
                    <div 
                        key={index}
                        className={clsx(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <div className="absolute inset-0 bg-white/90 z-10" /> 
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-10" />
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center">
                
                {/* Dynamic Question Text */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -40 }} 
                    viewport={{ once: false, amount: 0.2 }} 
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                    className="h-20 md:h-24 flex items-center justify-center mb-2 w-full max-w-5xl px-4 text-center cursor-default z-10"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.h1 
                            key={currentQuestion}
                            variants={getVariants(QUESTIONS[currentQuestion].type)}
                            initial="initial"
                            animate="animate"
                            className="text-2xl pt-2 sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center max-w-4xl mx-auto leading-snug"
                        >
                            {QUESTIONS[currentQuestion].text}
                        </motion.h1>
                    </AnimatePresence>
                </motion.div>

                {/* Highlighted Main Heading and Arrow */}
                {!isSeeker && (
                <motion.div 
                    initial={{ opacity: 0, y: 40 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -40 }} 
                    viewport={{ once: false, amount: 0.2 }} 
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="flex flex-col items-center z-10 w-full"
                >
                    <div className="inline-flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-full px-8 py-3 mt-8 mb-4 mx-auto z-20 relative text-xl md:text-2xl font-bold text-slate-700">
                        <Highlighter action="underline" color="rgba(250, 204, 21, 0.4)">Select Your Role</Highlighter> 
                        <span className="mx-2">to Get</span> 
                        <Highlighter action="highlight" color="rgba(135, 206, 250, 0.6)">Started</Highlighter>
                    </div>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="mb-8"
                    >
                        <ChevronDown className="w-8 h-8 text-slate-400" />
                    </motion.div>
                </motion.div>
                )}

                {/* Bento Grid Layout */}
                {!isSeeker && (
                <div id="roles-section" className="w-full max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-6 z-10 animate-fade-in-up delay-200 scroll-mt-32">
                    <SeekersGrid />
                    <FacilitatorsGrid />
                </div>
                )}

            </div>
        </div>
        </>
    );
};

export default HeroSection;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    