import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage, CourseLandingPage } from './components/LandingPage';
import { CurriculumPage } from './components/CurriculumPage';
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
// Academy pages, also loaded on demand.
const LittleWinsPage = lazy(() => import('./home/LittleWinsPage'));
const AboutPage = lazy(() => import('./home/AboutPage'));
const ProgramsPage = lazy(() => import('./home/ProgramsPage'));
const BookPage = lazy(() => import('./home/BookPage'));
const HomeCoursePage = lazy(() => import('./home/HomeCoursePage'));
const PreviewPage = lazy(() => import('./home/PreviewPage'));
const CheckoutPage = lazy(() => import('./home/CheckoutPage'));

/** Entry point for the parent view: requires a signed-in grown-up. */
function ParentsEntry() {
  const { user, loading } = useAuth();
  const { mode, setMode } = useExperienceMode();
  useEffect(() => { if (user && mode !== 'parent') setMode('parent'); }, [user, mode, setMode]);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: '/parents' }} />;
  return mode === 'parent' ? <Navigate to="/" replace /> : null;
}

function PageFallback() {
  return <div style={{ minHeight: '100vh', background: '#F5ECDF' }} aria-busy="true" />;
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

      {/* Academy pages */}
      <Route path="/programs" element={<Suspense fallback={<PageFallback />}><ProgramsPage /></Suspense>} />
      <Route path="/little-wins" element={<Suspense fallback={<PageFallback />}><LittleWinsPage /></Suspense>} />
      <Route path="/about" element={<Suspense fallback={<PageFallback />}><AboutPage /></Suspense>} />
      <Route path="/book" element={<Suspense fallback={<PageFallback />}><BookPage /></Suspense>} />
      {/* Older addresses */}
      <Route path="/pricing" element={<Navigate to="/programs#plans" replace />} />
      <Route path="/book-1-1" element={<Navigate to="/book" replace />} />
      <Route path="/achievements" element={<Navigate to="/little-wins" replace />} />
      <Route path="/about-us" element={<Navigate to="/about" replace />} />
      <Route path="/contact-us" element={<Navigate to="/book" replace />} />
      <Route path="/free-course" element={<Navigate to="/courses/beginner-chess" replace />} />

      <Route path="/login" element={<AuthPage key="login" mode="login" />} />
      <Route path="/signup" element={<AuthPage key="signup" mode="signup" />} />
      <Route path="/courses" element={<CoursesPage />} />
      {/* The Home Course (Beginner Chess) has its own landing; other courses use the course template. */}
      <Route path="/courses/beginner-chess" element={<Suspense fallback={<PageFallback />}><HomeCoursePage /></Suspense>} />
      <Route path="/courses/beginner-chess/preview" element={<Suspense fallback={<PageFallback />}><PreviewPage /></Suspense>} />
      <Route path="/checkout" element={<Suspense fallback={<PageFallback />}><CheckoutPage /></Suspense>} />
      <Route path="/home-course" element={<Navigate to="/courses/beginner-chess" replace />} />
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
