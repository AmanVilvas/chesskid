import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CurriculumPage } from './components/CurriculumPage';
import { PaymentPage } from './components/PaymentPage';

function PricingPageWrapper({ onSubscriptionSuccess }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Site Navbar */}
      <Navbar />

      {/* Main Pricing / Book 1:1 Page */}
      <main className="flex-1">
        <PaymentPage onSubscriptionSuccess={onSubscriptionSuccess} />
      </main>
    </div>
  );
}

export default function App() {
  const [activeSubscription, setActiveSubscription] = useState(null);

  return (
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Curriculum Page at /curriculum and /lesson-planner */}
      <Route 
        path="/curriculum" 
        element={<CurriculumPage activeSubscription={activeSubscription} />} 
      />
      <Route 
        path="/lesson-planner" 
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
