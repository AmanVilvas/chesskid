import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurriculum = location.pathname.startsWith('/curriculum') || location.pathname.startsWith('/lesson-planner');
  const isPricing = location.pathname === '/pricing' || location.pathname === '/book-1-1';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity select-none"
        >
          <div className="w-9 h-9 bg-[#1a3d1a] rounded-md flex items-center justify-center text-white text-xl font-bold">
            ♞
          </div>
          <div className="leading-tight">
            <div className="text-[#1a3d1a] font-black text-[13px] tracking-wide uppercase">
              Chess With Rathish
            </div>
            <div className="text-gray-400 text-[9px] tracking-wider font-medium">
              I DON'T TEACH CHESS, I TEACH THINKING.
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-gray-700">
          <Link 
            to="/" 
            className="hover:text-black transition-colors"
          >
            Program
          </Link>
          <Link 
            to="/curriculum" 
            className={`transition-colors py-1 ${
              isCurriculum 
                ? 'text-black font-bold border-b-2 border-black' 
                : 'hover:text-black'
            }`}
          >
            Curriculum
          </Link>
          <a href="/#how-it-works" className="hover:text-black transition-colors">
            How It Works
          </a>
          <a href="/#about" className="hover:text-black transition-colors">
            About
          </a>
          <a href="/#faqs" className="hover:text-black transition-colors">
            FAQs
          </a>
        </nav>

        {/* CTA Button & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            to="/pricing"
            className="hidden md:inline-flex items-center justify-center font-bold text-xs sm:text-[13px] px-4 py-2 rounded-md bg-[#FFBA07] hover:bg-[#FFC42B] text-[#0D0D0D] shadow-2xs transition-all duration-200 cursor-pointer"
          >
            Book a 1:1 Trial
          </Link>

          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col gap-1"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            <span className="block w-5 h-0.5 bg-current rounded-full" />
            <span className="block w-5 h-0.5 bg-current rounded-full" />
            <span className="block w-5 h-0.5 bg-current rounded-full" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-1 duration-150">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-semibold text-sm py-1.5 hover:text-[#1a3d1a]"
          >
            Program
          </Link>
          <Link 
            to="/curriculum" 
            onClick={() => setMobileMenuOpen(false)}
            className={`block font-semibold text-sm py-1.5 ${
              isCurriculum ? 'text-[#1a3d1a] font-bold' : 'text-gray-700 hover:text-[#1a3d1a]'
            }`}
          >
            Lesson Planner
          </Link>
          <a 
            href="/#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-semibold text-sm py-1.5 hover:text-[#1a3d1a]"
          >
            How It Works
          </a>
          <a 
            href="/#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-semibold text-sm py-1.5 hover:text-[#1a3d1a]"
          >
            About
          </a>
          <a 
            href="/#faqs" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-semibold text-sm py-1.5 hover:text-[#1a3d1a]"
          >
            FAQs
          </a>
          
          <div className="pt-2 border-t border-gray-100">
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#1a3d1a] hover:bg-[#2d5a2d] text-white font-bold text-sm py-2.5 rounded-lg transition-colors text-center"
            >
              Book a 1:1 Trial →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
