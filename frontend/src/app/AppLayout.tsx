
import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRouting from './routes/AppRouting';
import { AuthProvider } from '../context/AuthContext';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [pathname]);

    return null;
};

const AppLayout = () => {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <AppRouting />
            </AuthProvider>
        </Router>
    );
};

export default AppLayout;
