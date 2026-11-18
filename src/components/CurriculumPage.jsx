import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { ParentOverview } from '../parent/ParentOverview';
import { ParentPlayer } from '../parent/ParentPlayer';
import '../parent/parent.css';
import { useAuth } from './AuthContext';
import { USE_SERVER_API, apiRequest } from '../data/apiClient';

function CourseAccessGate({ children }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [state, setState] = useState({ userId: null, enrolled: false, error: '' });
  useEffect(() => {
    let mounted = true;
    if (authLoading) return () => { mounted = false; };
    if (!user) return () => { mounted = false; };
    apiRequest('/api/courses/beginner-chess/access')
      .then((result) => { if (mounted) setState({ userId: user.id, enrolled: result.enrolled, error: '' }); })
      .catch((error) => { if (mounted) setState({ userId: user.id, enrolled: false, error: error.message }); });
    return () => { mounted = false; };
  }, [user, authLoading]);

  if (authLoading || (user && state.userId !== user.id)) {
    return <div className="pp-root pp-gate"><p className="pp-kicker">Checking your course access…</p></div>;
  }
  // Without the course server the preview units are open to every signed-in parent; paid units lock inside the player.
  if (state.enrolled || (user && !USE_SERVER_API)) return children;
  return (
    <div className="pp-root">
      <main className="pp-gate">
        <section className="pp-gate-card">
          <span className="pp-kicker"><LockKeyhole size={13} style={{ verticalAlign: '-2px' }} /> Protected course area</span>
          <h1 className="pp-serif">{user ? 'Unlock your course to continue' : 'Sign in to access your course'}</h1>
          <p>Course lessons and practice open on your account once you have bought a course part.</p>
          {state.error && <p role="alert" className="pp-gate-error">{state.error}</p>}
          <div className="pp-gate-actions">
            {user
              ? <Link to="/checkout" className="pp-btn pp-btn-primary pp-btn-lg">Unlock the course</Link>
              : <>
                  <Link to="/login" state={{ from: `${location.pathname}${location.search}` }} className="pp-btn pp-btn-primary pp-btn-lg">Sign in</Link>
                  <Link to="/signup" state={{ from: `${location.pathname}${location.search}` }} className="pp-btn pp-btn-ghost pp-btn-lg">Create account</Link>
                </>}
            <span className="pp-kicker" style={{ marginTop: 8 }}><ShieldCheck size={13} style={{ verticalAlign: '-2px' }} /> Your purchase is checked when you sign in</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export const CurriculumPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const viewParam = searchParams.get('view'); // 'overview' | 'player'
  const unitParam = parseInt(searchParams.get('unit'), 10);
  const lectureParam = searchParams.get('lecture');

  // Mode: 'overview' (Screenshot 2) or 'player' (Screenshot 1)
  const [viewMode, setViewMode] = useState(viewParam === 'player' ? 'player' : 'overview');
  const [selectedUnitId, setSelectedUnitId] = useState(unitParam || 1);
  const [selectedLectureId, setSelectedLectureId] = useState(lectureParam || null);

  // Sync state if URL search params change
  useEffect(() => {
    if (viewParam === 'player') {
      setViewMode('player');
    } else if (viewParam === 'overview') {
      setViewMode('overview');
    }
    if (unitParam && !isNaN(unitParam)) {
      setSelectedUnitId(unitParam);
    }
    if (lectureParam) {
      setSelectedLectureId(lectureParam);
    }
  }, [viewParam, unitParam, lectureParam]);

  // Handler to launch player from overview
  const handleStartCourse = (unitId = 1, lectureId = null) => {
    setSelectedUnitId(unitId);
    setSelectedLectureId(lectureId);
    setViewMode('player');
    setSearchParams({ view: 'player', unit: String(unitId), ...(lectureId ? { lecture: lectureId } : {}) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to return to course overview
  const handleBackToOverview = () => {
    setViewMode('overview');
    setSearchParams({ view: 'overview' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {viewMode === 'player' ? (
        <CourseAccessGate>
        <ParentPlayer
          initialUnitId={selectedUnitId}
          initialLectureId={selectedLectureId}
          onBackToOverview={handleBackToOverview}
        />
        </CourseAccessGate>
      ) : (
        <ParentOverview onStartCourse={handleStartCourse} />
      )}
    </div>
  );
};
