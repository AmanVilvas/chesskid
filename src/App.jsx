import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CurriculumPage } from './components/CurriculumPage';
import { PaymentPage } from './components/PaymentPage';

function PricingPageWrapper({ onSubscriptionSuccess }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f4ff]">
      {/* Site Navbar */}
      <Navbar />

      {/* Clean Minimal Breadcrumb: Home / Book 1:1 */}
      <div className="bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-2.5 flex items-center text-xs text-gray-500 font-medium">
          <Link to="/" className="hover:text-[#1a3d1a] transition-colors cursor-pointer font-semibold">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-bold">Book 1:1</span>
        </div>
      </div>

      {/* Main Pricing / Book 1:1 Page */}
      <main className="flex-1">
        <PaymentPage onSubscriptionSuccess={onSubscriptionSuccess} />
      </main>

      {/* Site Footer */}
      <footer className="bg-[#1a3d1a] text-white/80 py-6 text-center text-xs mt-auto border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <p>© Chess With Rathish — All Rights Reserved. I don't teach chess, I teach thinking.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [activeSubscription, setActiveSubscription] = useState(null);

  return (
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Curriculum Page at /curriculum */}
      <Route 
        path="/curriculum" 
        element={<CurriculumPage activeSubscription={activeSubscription} />} 
      />

      {/* Pricing / Book 1:1 Page at /pricing */}
      <Route 
        path="/pricing" 
        element={<PricingPageWrapper onSubscriptionSuccess={setActiveSubscription} />} 
      />

      {/* Book 1:1 alias route */}
      <Route path="/book-1-1" element={<Navigate to="/pricing" replace />} />

      {/* Fallback redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
