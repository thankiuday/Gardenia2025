import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import WelcomeModal from './components/WelcomeModal';
import ErrorBoundary from './components/ErrorBoundary';
import NetworkError from './components/NetworkError';
import Maintenance from './pages/Maintenance';
import MaintenanceToggle from './components/MaintenanceToggle';
import { isMaintenanceActive } from './utils/maintenance';
import Home from './pages/Home';
import Events from './pages/Events';
import Brochure from './pages/Brochure';
import RulesAndRegulations from './pages/RulesAndRegulations';
import Registration from './pages/Registration';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import EventDetails from './pages/EventDetails';
import QRScanner from './pages/QRScanner';

// Component to conditionally render navbar and footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Admin routes that should not have student navbar/footer
  const adminRoutes = ['/admin', '/scanner'];
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));
  
  // Check admin login status
  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem('adminToken');
      setIsAdminLoggedIn(!!token);
    };
    
    const handleAdminLogout = () => {
      setIsAdminLoggedIn(false);
    };
    
    // Check on mount
    checkAdminStatus();
    
    // Listen for storage changes (from other tabs) and custom events (from same tab)
    window.addEventListener('storage', checkAdminStatus);
    window.addEventListener('adminLogin', checkAdminStatus);
    window.addEventListener('adminLogout', handleAdminLogout);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
      window.removeEventListener('adminLogin', checkAdminStatus);
      window.removeEventListener('adminLogout', handleAdminLogout);
    };
  }, []);
  
  if (isAdminRoute) {
    // Admin pages - with admin navbar only if logged in, no footer
    return (
      <div className="min-h-screen bg-gray-50">
        {isAdminLoggedIn && <AdminNavbar />}
        <main className="flex-1">
          <ErrorBoundary>
            <PageTransition>
              {children}
            </PageTransition>
          </ErrorBoundary>
        </main>
        <NetworkError onRetry={() => window.location.reload()} />
        <WelcomeModal />
        <MaintenanceToggle />
      </div>
    );
  }
  
  // Student pages - with navbar and footer
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <PageTransition>
            {children}
          </PageTransition>
        </ErrorBoundary>
      </main>
      <Footer />
      <NetworkError onRetry={() => window.location.reload()} />
      <WelcomeModal />
      <MaintenanceToggle />
    </div>
  );
};

function App() {
  // Check if maintenance mode is active
  if (isMaintenanceActive()) {
    return <Maintenance />;
  }

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="brochure" element={<Brochure />} />
          <Route path="rules" element={<RulesAndRegulations />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="register/:id" element={<Registration />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="admin/*" element={<Admin />} />
          <Route path="scanner" element={<QRScanner />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}

export default App;