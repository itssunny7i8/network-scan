import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Terminal, BookOpen, Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Scanner, { ScanResult } from './pages/Scanner';
import About from './pages/About';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addScanToHistory = (scan: ScanResult) => {
    setScanHistory(prev => [scan, ...prev].slice(0, 10));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'scanner':
        return <Scanner scanHistory={scanHistory} addScanToHistory={addScanToHistory} showToast={showToast} />;
      case 'about':
        return <About />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-gray-300 font-sans flex flex-col justify-between selection:bg-emerald-500/20">
      
      {/* Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`w-full p-4 rounded-xl shadow-lg border text-sm flex items-center justify-between ${
                toast.type === 'success' 
                  ? 'bg-[#111C18] border-emerald-500/30 text-emerald-400' 
                  : toast.type === 'error'
                  ? 'bg-[#1C1111] border-red-500/30 text-red-400'
                  : 'bg-[#1C1811] border-amber-500/30 text-amber-400'
              }`}
            >
              <div className="flex-1 pr-2">{toast.message}</div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-xs opacity-60 hover:opacity-100 hover:text-white font-mono"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0A0E17]/85 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 group text-white focus:outline-none"
          >
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg group-hover:bg-emerald-500/20 transition-all">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
              <div className="text-left">
                <span className="font-extrabold text-base tracking-tight block">Network Scanner</span>
              </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'home' 
                  ? 'bg-white/5 text-emerald-400 border border-white/5 font-semibold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </button>
            
            <button
              onClick={() => setCurrentPage('scanner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'scanner' 
                  ? 'bg-white/5 text-emerald-400 border border-white/5 font-semibold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Terminal className="h-4 w-4" />
              Scanner
            </button>
            
            <button
              onClick={() => setCurrentPage('about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === 'about' 
                  ? 'bg-white/5 text-emerald-400 border border-white/5 font-semibold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
                About
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-[#0C1220]/95 z-30 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              <button
                onClick={() => setCurrentPage('home')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'home' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => setCurrentPage('scanner')}
                className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'scanner' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Terminal className="h-4 w-4" />
                Scanner
              </button>
              
              <button
                onClick={() => setCurrentPage('about')}
                className={`w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentPage === 'about' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                  About
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Details */}
      <footer className="border-t border-white/5 bg-[#070A10] px-4 py-6 text-center text-xs text-gray-500 font-light">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500/50" />
              <span>Network Scanner • Network discovery and reporting tool</span>
            </div>
            <div>
              <span>Disclaimer: for authorized testing on networks you own or are permitted to test.</span>
            </div>
        </div>
      </footer>

    </div>
  );
}
