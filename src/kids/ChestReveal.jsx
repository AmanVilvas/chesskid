import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Character, CREW } from './Characters';
import { playEffect } from './kidsAudio';

// ---------- chest reveal: drop, shake, burst open, card flip ----------
export function ChestReveal({ world, onClose, tier, sound }) {
  const crew = CREW[world.crew];
  const [phase, setPhase] = useState(tier === 'reduced' ? 'card' : 'shake');
  useEffect(() => {
    if (phase === 'shake') { const t = setTimeout(() => setPhase('open'), 900); return () => clearTimeout(t); }
    if (phase === 'open') { playEffect('unlock', sound); const t = setTimeout(() => setPhase('card'), 650); return () => clearTimeout(t); }
    return undefined;
  }, [phase, sound]);
  return createPortal(
    <div className="kids-portal">
      <motion.div className="cr-shade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => phase !== 'card' && setPhase('card')}>
        {tier !== 'reduced' && <div className="cr-rays" aria-hidden="true" />}
        <div className="cr-stage" role="dialog" aria-modal="true" aria-label={`${world.title} treasure`}>
          {phase !== 'card' && (
            <motion.svg className="cr-chest" viewBox="0 0 200 170" aria-hidden="true"
              initial={{ y: -260, scale: 0.6 }}
              animate={phase === 'shake' ? { y: 0, scale: 1, rotate: [0, -6, 6, -4, 4, 0] } : { y: 0, scale: 1.08 }}
              transition={phase === 'shake' ? { y: { type: 'spring', stiffness: 260, damping: 16 }, rotate: { delay: 0.45, duration: 0.45 } } : { duration: 0.2 }}>
              <rect x="30" y="80" width="140" height="74" rx="14" fill="#C9864E" />
              <rect x="30" y="102" width="140" height="12" fill="#FFC23D" />
              <rect x="88" y="94" width="24" height="30" rx="5" fill="#FFC23D" />
              <motion.g style={{ transformBox: 'view-box', transformOrigin: '30px 80px' }} animate={{ rotate: phase === 'open' ? -32 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                <path d="M30 82 V64 Q30 36 100 36 Q170 36 170 64 V82 Z" fill="#DE9A5E" />
                <path d="M30 70 Q100 54 170 70" stroke="#FFC23D" strokeWidth="9" fill="none" />
              </motion.g>
              {phase === 'open' && <circle cx="100" cy="80" r="60" fill="#FFF3C4" opacity=".8" className="cr-glow" />}
            </motion.svg>
          )}
          {phase === 'card' && (
            <motion.div className="cr-card" style={{ '--c': crew.color, '--d': crew.shade }}
              initial={tier === 'reduced' ? false : { rotateY: 180, scale: 0.4, y: 60 }} animate={{ rotateY: 0, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16 }}>
              <span className="cr-new">{world.badge2 ? 'NEW BADGE!' : 'NEW FRIEND!'}</span>
              <div className="cr-card-art"><Character id={world.crew} mood="cheer" size={150} crown={world.id === 11} /></div>
              <h2>{world.badge2 || crew.name}</h2>
              <p className="cr-piece">{world.badge2 ? `${crew.name} gives you a badge` : `The ${crew.piece}`}</p>
              <p className="cr-blurb">{crew.blurb}</p>
              <button type="button" className="kid-btn kid-btn-go kid-btn-xl" onClick={onClose}>Add to my crew</button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

