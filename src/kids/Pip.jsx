import { motion } from 'motion/react';
import { Character } from './Characters';

// Pip the pawn is the Chess Crew's guide. Other crew members can speak with `who`.
export function Pip({ mood = 'idle', size = 96, crown = false, className = '', title }) {
  return <Character id="pawn" mood={mood} size={size} crown={crown} className={className} title={title || 'Pip the pawn'} />;
}

export function PipBubble({ children, mood = 'idle', size = 92, side = 'right', crown = false, live = true, className = '', who = 'pawn' }) {
  return (
    <div className={`pip-bubble-wrap pip-${side} ${className}`}>
      <Character id={who} mood={mood} size={size} crown={crown} />
      <motion.div
        key={typeof children === 'string' ? children : undefined}
        className="pip-bubble"
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        aria-live={live ? 'polite' : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
