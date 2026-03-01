import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveAnnouncements } from '../../services/apiService';
import type { AnnouncementData } from '../../services/apiService';

const AnnouncementBanner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getActiveAnnouncements();
                setAnnouncements(data);
            } catch {
                // Silently fail — banner just won't show
                setAnnouncements([]);
            }
        };
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (announcements.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [announcements.length]);

    // Hide if dismissed, loading, or no announcements
    if (!isVisible || announcements.length === 0) return null;

    const current = announcements[currentIndex];

    return (
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-2.5 px-4 relative flex items-center justify-center text-xs md:text-sm font-medium z-[60] shadow-md transition-all">
            <div 
                className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition-opacity mx-auto"
                onClick={() => navigate('/auth')}
            >
                <span className="bg-white text-orange-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                    NEW
                </span>
                
                <div className="relative h-5 flex items-center justify-center overflow-hidden min-w-[200px] sm:min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={current._id + currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-center truncate max-w-[60vw] sm:max-w-none block sm:inline"
                        >
                            {current.emoji} {current.message}
                        </motion.span>
                    </AnimatePresence>
                </div>

                <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
            </div>
            
            <button 
                onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
                className="absolute right-3 md:right-4 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                aria-label="Close announcement"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default AnnouncementBanner;
