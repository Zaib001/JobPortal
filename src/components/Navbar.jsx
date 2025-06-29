import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.svg'
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
// Scroll handler
const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    setOpen(false); // close mobile menu if open
  }
};

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 10 ? 'bg-white shadow-lg' : 'bg-white shadow'
      }`}
    >
      <nav className="max-w-screen-xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h- w-32" />
          {/* <span className="text-2xl font-bold text-indigo-600">TalentLink</span> */}
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-6 items-center text-sm">
        {[
  { label: 'Home', id: 'hero' },
  { label: 'Features Jobs', id: 'featured' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Hiring', id: 'hiring' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'Contact', id: 'footer' }, 
].map((item, idx, arr) => (
  <li key={item.id} className="flex items-center gap-2">
    <button
      onClick={() => scrollToSection(item.id)}
      className="text-gray-700 hover:text-indigo-600 transition duration-200 font-medium hover:underline"
    >
      {item.label}
    </button>
    {idx < arr.length - 1 && (
      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2" />
      </svg>
    )}
  </li>
))}

        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-3 items-center">
          <Link
            to="/login"
            className="py-2 px-6 text-sm font-semibold rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition transform hover:scale-105"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="py-2 px-6 text-sm font-semibold rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setOpen(true)} className="text-indigo-600">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white z-50 shadow-lg border-r"
          >
            <div className="px-6 py-4 flex justify-between items-center border-b">
              <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <img src="/logo.svg" alt="logo" className="h-8 w-8" />
                <span className="text-2xl font-bold text-indigo-600">TalentLink</span>
              </Link>
              <button onClick={() => setOpen(false)}>
                <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className="px-6 py-6 space-y-4">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'Features', to: '/features' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Testimonials', to: '/testimonials' },
                { label: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="px-6 pt-4 pb-6 border-t">
              <Link
                to="/login"
                className="block w-full text-center py-3 mb-3 rounded-full text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-3 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
              >
                Sign Up
              </Link>
              <p className="mt-4 text-xs text-center text-gray-400">© 2024 TalentLink</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
