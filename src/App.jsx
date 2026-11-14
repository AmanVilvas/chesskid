import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage, CourseLandingPage } from './components/LandingPage';
import { CurriculumPage } from './components/CurriculumPage';
import { PaymentPage } from './components/PaymentPage';
import { AuthPage } from './components/AuthPage';
import { AuthProvider, useAuth } from './components/AuthContext';
import { CoursesPage } from './components/CoursesPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ExperienceModeProvider, useExperienceMode } from './components/ExperienceModeContext';

// Kids World is loaded on demand (one chunk) so it does not add weight to the other pages.
const KidsLayout = lazy(() => import('./kids/KidsLayout'));
const KidsWorldPage = lazy(() => import('./kids/KidsWorldPage'));
const KidsLevelPage = lazy(() => import('./kids/KidsLevelPage'));
const KidsCrewPage = lazy(() => import('./kids/KidsCrewPage'));

function PricingPageWrapper() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Site Navbar */}
      <Navbar />

      {/* Main Pricing / Book 1:1 Page */}
      <main className="flex-1">
        <PaymentPage />
      </main>
    </div>
  );
}

/** Entry point for the parent view: requires a signed-in grown-up. */
function ParentsEntry() {
  const { user, loading } = useAuth();
  const { mode, setMode } = useExperienceMode();
  useEffect(() => { if (user && mode !== 'parent') setMode('parent'); }, [user, mode, setMode]);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: '/parents' }} />;
  return mode === 'parent' ? <Navigate to="/" replace /> : null;
}

function KidsFallback() {
  return <div style={{ minHeight: '100vh', background: '#F7F2E8' }} aria-busy="true" />;
}

export default function App() {
  return (
    <AuthProvider>
    <ExperienceModeProvider>
    <Routes>
      {/* Home / Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Curriculum Page at /curriculum and /lesson-planner */}
      <Route
        path="/curriculum"
        element={<CurriculumPage />}
      />
      <Route
        path="/lesson-planner"
        element={<CurriculumPage />}
      />

      {/* Pricing / Book 1:1 Page at /pricing */}
      <Route
        path="/pricing"
        element={<PricingPageWrapper />}
      />

      {/* Book 1:1 alias route */}
      <Route path="/book-1-1" element={<Navigate to="/pricing" replace />} />

      <Route path="/login" element={<AuthPage key="login" mode="login" />} />
      <Route path="/signup" element={<AuthPage key="signup" mode="signup" />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:slug" element={<CourseLandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Kids World (children's adventure) and the parent-view entry */}
      <Route path="/play" element={<Suspense fallback={<KidsFallback />}><KidsLayout /></Suspense>}>
        <Route index element={<Suspense fallback={<KidsFallback />}><KidsWorldPage /></Suspense>} />
        <Route path="crew" element={<Suspense fallback={<KidsFallback />}><KidsCrewPage /></Suspense>} />
        <Route path=":worldId" element={<Suspense fallback={<KidsFallback />}><KidsLevelPage /></Suspense>} />
        <Route path=":worldId/:activity" element={<Suspense fallback={<KidsFallback />}><KidsLevelPage /></Suspense>} />
      </Route>
      <Route path="/parents" element={<ParentsEntry />} />

      {/* Fallback redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ExperienceModeProvider>
    </AuthProvider>
  );
}
