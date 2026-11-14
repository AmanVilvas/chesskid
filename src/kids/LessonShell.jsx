import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { GoldStar } from './KidsBoard';

/**
 * Full-screen activity layout: close + progress + stars on top, content in the middle and a
 * footer bar for actions. `feedback` turns the footer into a green (good) or red (oops) banner.
 */
export function LessonShell({ world, progress = 0, stars = null, onClose, footer, feedback = null, children }) {
  return (
    <div className="kids-root kl-page" style={{ '--c': world.color, '--d': world.deep }}>
      <header className="ks-top">
        <button type="button" className="ks-close" onClick={onClose} aria-label="Back to the map"><X size={30} strokeWidth={2.8} /></button>
        <div className="ks-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Progress">
          <motion.i initial={false} animate={{ width: `${Math.max(4, progress * 100)}%` }} transition={{ type: 'spring', stiffness: 160, damping: 22 }} />
        </div>
        {stars !== null && <span className="ks-stars"><GoldStar className="ks-star" /><b>{stars}</b></span>}
      </header>
      <main className="ks-body">{children}</main>
      <footer className={`ks-footer ${feedback ? `is-${feedback.tone}` : ''}`}>
        <div className="ks-footer-inner">{footer}</div>
      </footer>
    </div>
  );
}

export function FeedbackTitle({ icon, title, text }) {
  return (
    <div className="ks-feedback">
      <span className="ks-feedback-icon" aria-hidden="true">{icon}</span>
      <div><strong>{title}</strong>{text && <span>{text}</span>}</div>
    </div>
  );
}
