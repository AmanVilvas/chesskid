import { Link } from 'react-router-dom';
import { Home, LockKeyhole, Users } from 'lucide-react';
import { AudioToggles, GrownUpsButton } from './KidsShell';
import { Character } from './Characters';

export function KidsNav({ active = 'learn' }) {
  return (
    <nav className="kp-nav" aria-label="Kids World">
      <Link to="/play" className="kp-logo" aria-label="Crown Quest home">
        <Character id="pawn" size={38} /> <span>Crown Quest<small>Beginner course</small></span>
      </Link>
      <Link to="/play" className={`kp-nav-item ${active === 'learn' ? 'is-active' : ''}`} aria-current={active === 'learn' ? 'page' : undefined}><Home size={26} /><span>Learn</span></Link>
      <Link to="/play/crew" className={`kp-nav-item ${active === 'crew' ? 'is-active' : ''}`} aria-current={active === 'crew' ? 'page' : undefined}><Users size={26} /><span>My crew</span></Link>
      <GrownUpsButton className="kp-nav-item"><LockKeyhole size={26} /><span>Grown-ups</span></GrownUpsButton>
      <div className="kp-nav-audio"><AudioToggles /></div>
    </nav>
  );
}

