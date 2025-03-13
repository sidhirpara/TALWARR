import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import Gallery from './components/Gallery';
import SearchBar from './components/SearchBar';
import About from './components/About';
import QRLanding from './components/QRLanding';
import NewArrivals from './components/NewArrivals';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

function NavigationContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'COLLECTIONS', path: '/' },
    { name: 'NEW ARRIVALS', path: '/new-arrivals' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'BESTSELLERS', path: '/' },
    { name: 'ABOUT', path: '/about' }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-50 dark:from-slate-900 dark:to-slate-800 dark:text-white transition-colors duration-300">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-serif text-slate-800 dark:text-white">TALWAR</Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white tracking-widest text-sm font-light transition-colors duration-200 ${
                      isActivePath(item.path) ? 'text-slate-900 dark:text-white font-medium' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:ring-offset-2 rounded-full p-1"
                  aria-label="Open search"
                >
                  <Search className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200" />
                </button>
                <ThemeToggle />
                <button
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-light text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white tracking-widest ${
                      isActivePath(item.path) ? 'text-slate-900 dark:text-white font-medium bg-slate-50 dark:bg-slate-800' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Search Bar */}
        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
          </div>
        }>
          <Routes>
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/qr" element={<QRLanding />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/" element={
              <div className="relative min-h-screen flex items-center">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-50 via-slate-50 to-rose-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 opacity-70"></div>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                  <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="text-center md:text-left">
                      <h2 className="text-4xl md:text-6xl font-serif text-slate-800 dark:text-white mb-6 leading-tight">
                        Discover Your Signature Scent
                      </h2>
                      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 font-light">
                        Curated fragrances for the modern individual
                      </p>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full text-lg tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 shadow-sm hover:shadow-md">
                        EXPLORE
                      </button>
                    </div>
                    
                    <div className="hidden md:block">
                      <img
                        src="https://i.ibb.co/cKgSGZXH/Hero.png?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                        alt="Luxury Perfume"
                        className="rounded-[40px] shadow-xl hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <NavigationContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;