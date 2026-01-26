import AppLayout from './app/AppLayout';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
      <AppLayout />
      <Toaster
        position="bottom-right"
        containerClassName="!z-[9999]"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#F5F4F0',
            color: '#1A1D23',
            fontWeight: 600,
            borderRadius: '14px',
            border: '1px solid rgba(26, 29, 35, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
            padding: '14px 18px',
            fontSize: '14px',
            maxWidth: '400px',
            minWidth: '320px',
          },
          success: {
            iconTheme: {
              primary: '#14B8A6',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #14B8A6',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #EF4444',
            },
          },
        }}
      />
    </>
  );
}

export default App;
