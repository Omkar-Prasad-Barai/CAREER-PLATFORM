import { useEffect, useState, useCallback } from 'react';

/**
 * Navigation blocker for the Admin Dashboard.
 * Uses popstate (browser back/forward) to detect exit attempts and returns
 * modal state instead of using native window.confirm.
 * 
 * Compatible with BrowserRouter (does NOT require createBrowserRouter/data router).
 */
const useNavigationBlocker = (shouldBlock = true) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Push an extra history entry and listen for popstate (back button)
  useEffect(() => {
    if (!shouldBlock) return;

    // Push a guard entry so pressing back triggers popstate instead of leaving
    window.history.pushState({ adminGuard: true }, '', window.location.href);

    const handlePopState = () => {
      // Show the custom modal instead of native confirm
      setIsModalOpen(true);
      // Re-push guard entry to prevent immediate navigation
      window.history.pushState({ adminGuard: true }, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [shouldBlock]);

  const handleStay = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleProceedLogout = useCallback(() => {
    setIsModalOpen(false);
    // Navigation will be handled by the logout function in the consuming component
  }, []);

  return { isModalOpen, handleStay, handleProceedLogout };
};

export default useNavigationBlocker;
