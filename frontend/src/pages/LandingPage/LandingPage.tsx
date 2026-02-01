import HeroSection from './components/HeroSection';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import TestimonialsSection from './components/TestimonialsSection';
import AnnouncementBanner from '../../components/layout/AnnouncementBanner';
import FeaturedOpportunities from '../../components/landing/FeaturedOpportunities';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
    const { user, isAuthenticated } = useAuth();
    const isSeeker = isAuthenticated && (user?.role === 'student' || user?.role === 'aspirant');

    return (
        <div className="min-h-screen w-full bg-slate-50 relative flex flex-col overflow-x-hidden">
            <div className="absolute top-0 left-1/2 w-3/4 h-[500px] bg-blue-400/10 blur-[120px] -translate-x-1/2 rounded-full pointer-events-none"></div>
            <header className="sticky top-0 z-[100] w-full flex flex-col bg-white shadow-sm border-b border-slate-200">
                <AnnouncementBanner />
                <Navbar />
            </header>
            <HeroSection />
            {isSeeker && <FeaturedOpportunities />}
            <TestimonialsSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
