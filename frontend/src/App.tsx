import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Training } from './pages/Training';
import { Auth } from './pages/Auth';
import { Toaster } from 'react-hot-toast';
import { Profile } from './pages/Profile';
import { Feed } from './pages/Feed';
import { ImmersiveStack } from './components/ImmersiveStack';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings } from 'lucide-react';
import { api } from './api'; 

const BACKEND_URL = 'http://localhost:3000';

const NAV_LINKS = [
  { path: '/', label: 'Learn' },
  { path: '/camera', label: 'Camera' },
  { path: '/dictionary', label: 'Dictionary' },
  { path: '/feed', label: 'Feed' },
];

export const Navigation = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getProfile()
      .then(data => {
        if (data && data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const Separator = () => <span className="text-white/20 mx-2 font-light">|</span>;

  const isProfileActive = isActive('/profile') || isDropdownOpen;

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-serif tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300">
        LINGUA <span className="opacity-70">VISION</span>
      </Link>

      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center">
          {NAV_LINKS.map((link, index) => {
            const active = isActive(link.path);
            return (
              <div key={link.path} className="flex items-center">
                <Link 
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full transition-colors duration-300 text-xs md:text-sm font-bold tracking-widest uppercase ${
                    active ? 'text-white' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navGlow"
                      className="absolute inset-0 bg-white/5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
                {index < NAV_LINKS.length - 1 && <Separator />}
              </div>
            );
          })}
        </nav>

        <div className="hidden md:block w-px h-5 bg-white/10 ml-2"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`group w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 dark-matte-glass overflow-hidden relative ${
              isProfileActive
                ? 'border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            {avatarUrl ? (
              <img 
                src={`${BACKEND_URL}${avatarUrl}`} 
                alt="User Avatar" 
                className={`w-full h-full object-cover rounded-full transition-all duration-500 mix-blend-screen
                  ${isProfileActive 
                    ? 'opacity-90 brightness-110 contrast-100' 
                    : 'opacity-40 brightness-75 contrast-125 group-hover:opacity-90 group-hover:brightness-100'
                  }`}
              />
            ) : (
              <User 
                size={18} 
                className={`transition-colors duration-300 ${
                  isProfileActive ? 'text-white' : 'text-white/40 group-hover:text-white'
                }`}
              />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 rounded-3xl dark-matte-glass border border-white/10 p-2 flex flex-col gap-1 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
              <Link 
                to="/profile" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-colors"
              >
                <Settings size={16} />
                Настройки
              </Link>
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-colors text-left"
              >
                <LogOut size={16} />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isImmersive = ['/', '/camera', '/dictionary'].includes(location.pathname);
  const routeKey = isImmersive ? 'immersive' : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        <Route path="/" element={<PageTransition><ImmersiveStack /></PageTransition>} />
        <Route path="/camera" element={<PageTransition><ImmersiveStack /></PageTransition>} />
        <Route path="/dictionary" element={<PageTransition><ImmersiveStack /></PageTransition>} />
        
        <Route path="/feed" element={<PageTransition><Feed /></PageTransition>} />
        <Route path="/training" element={<PageTransition><Training /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-center" 
        toastOptions={{ 
          duration: 3000,
          style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }} 
      />
      
      <div className="min-h-screen flex flex-col font-sans relative z-10 overflow-hidden">
        <Navigation onLogout={handleLogout} />

        <main className="flex-grow w-full">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;