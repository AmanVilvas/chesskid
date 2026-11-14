import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ExperienceModeContext = createContext(null);
const STORAGE_KEY = 'thinking-academy-experience-mode';

function readInitialMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'parent' ? 'parent' : 'adventure';
  } catch {
    return 'adventure';
  }
}

// The parent view requires a signed-in grown-up. Choosing it while signed out sends the
// visitor to sign in first and brings them back to the parent view (/parents) afterwards.
export function ExperienceModeProvider({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setModeState] = useState(readInitialMode);

  useEffect(() => {
    if (!loading && !user && mode === 'parent') setModeState('adventure');
  }, [loading, user, mode]);

  useEffect(() => {
    document.documentElement.dataset.experienceMode = mode;
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* Private browsing can disable local storage. */ }
  }, [mode]);

  const setMode = useCallback((next) => {
    if (next === 'parent' && !user) {
      navigate('/login', { state: { from: '/parents' } });
      return;
    }
    setModeState(next === 'parent' ? 'parent' : 'adventure');
  }, [user, navigate]);

  const value = useMemo(() => ({
    mode,
    isParentMode: mode === 'parent',
    setMode,
    toggleMode: () => setMode(mode === 'adventure' ? 'parent' : 'adventure'),
  }), [mode, setMode]);

  return <ExperienceModeContext.Provider value={value}>{children}</ExperienceModeContext.Provider>;
}

export function useExperienceMode() {
  const context = useContext(ExperienceModeContext);
  if (!context) throw new Error('useExperienceMode must be used within ExperienceModeProvider');
  return context;
}
