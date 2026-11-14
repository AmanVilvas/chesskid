import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { KidsWorldProvider } from './KidsShell';
import { useMotionTier } from './kidsMotion';

// One provider for the whole Kids World: the access check runs once, and moving between the
// map and a world is instant (no reload screen), which page transitions rely on.
export default function KidsLayout() {
  const tier = useMotionTier();
  // Warm both page chunks so a transition never waits on a download.
  useEffect(() => {
    import('./KidsWorldPage');
    import('./KidsLevelPage');
    import('./KidsCrewPage');
  }, []);
  return (
    <KidsWorldProvider motionTier={tier}>
      <Outlet />
    </KidsWorldProvider>
  );
}
