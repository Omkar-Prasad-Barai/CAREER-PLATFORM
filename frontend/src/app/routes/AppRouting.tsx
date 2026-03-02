import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './config';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import ErrorBoundary from '../../components/common/ErrorBoundary';

// Pages
import LandingPage from '../../pages/LandingPage/LandingPage';
import AuthPage from '../../pages/Auth/AuthPage';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import ResetPassword from '../../pages/Auth/ResetPassword';
import StudentDashboard from '../../pages/Student/Dashboard';
import AspirantDashboard from '../../pages/Aspirant/AspirantDashboard';
import OrganizationDashboard from '../../pages/Organization/Dashboard';
import ProfessorDashboard from '../../pages/Professor/Dashboard';
import ProfessionalDashboard from '../../pages/Professional/Dashboard';
import RecruiterDashboard from '../../pages/Recruiter/Dashboard';
import OthersDashboard from '../../pages/Others/Dashboard';
import AdminLayout from '../../pages/Admin/AdminLayout';
import AdminLogin from '../../pages/Admin/AdminLogin';
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import AdminApprovals from '../../pages/Admin/AdminApprovals';
import AdminUsers from '../../pages/Admin/AdminUsers';
import AdminSpam from '../../pages/Admin/AdminSpam';
import AdminSettings from '../../pages/Admin/AdminSettings';
import AdminAnnouncements from '../../pages/Admin/AdminAnnouncements';
import AdminTestimonials from '../../pages/Admin/AdminTestimonials';

// Utility Pages
import PrivacyPolicy from '../../pages/Utility/PrivacyPolicy';
import TermsOfService from '../../pages/Utility/TermsOfService';
import ContactUs from '../../pages/Utility/ContactUs';
import Unauthorized from '../../pages/Utility/Unauthorized';
import NotFound from '../../pages/Utility/NotFound';

const AppRouting = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.AUTH} element={<AuthPage />} />
            
            {/* Utility Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Redirect legacy routes if any */}
            <Route path="/login" element={<Navigate to={ROUTES.AUTH} replace />} />
            <Route path="/role-selection" element={<Navigate to={ROUTES.HOME} replace />} />
            
            {/* Public Auth Pages */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path={ROUTES.STUDENT_DASHBOARD} element={
                <ProtectedRoute allowedRole="student">
                    <StudentDashboard />
                </ProtectedRoute>
            } />

            <Route path={ROUTES.ASPIRANT_DASHBOARD} element={
                <ProtectedRoute allowedRole="aspirant">
                    <AspirantDashboard />
                </ProtectedRoute>
            } />
            
            <Route path={ROUTES.ORG_DASHBOARD} element={
                <ProtectedRoute allowedRole="organization">
                    <OrganizationDashboard />
                </ProtectedRoute>
            } />
            
            <Route path={ROUTES.PROF_DASHBOARD} element={
                <ProtectedRoute allowedRole="professor">
                    <ProfessorDashboard />
                </ProtectedRoute>
            } />

            <Route path={ROUTES.PROFESSIONAL_DASHBOARD} element={
                <ProtectedRoute allowedRole="professional">
                    <ProfessionalDashboard />
                </ProtectedRoute>
            } />

            <Route path={ROUTES.RECRUITER_DASHBOARD} element={
                <ProtectedRoute allowedRole="recruiter">
                    <RecruiterDashboard />
                </ProtectedRoute>
            } />

            <Route path={ROUTES.OTHERS_DASHBOARD} element={
                <ProtectedRoute allowedRole="others">
                    <OthersDashboard />
                </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
                <ErrorBoundary>
                    <ProtectedRoute allowedRole="admin">
                        <AdminLayout />
                    </ProtectedRoute>
                </ErrorBoundary>
            }>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<Navigate replace to="/admin" />} />
                <Route path="approvals" element={<AdminApprovals />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="spam" element={<AdminSpam />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* F-01 FIX: Catch-all route for unknown URLs */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouting;
