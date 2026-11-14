import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole, X } from 'lucide-react';

// The coaching subscription plans are not connected to a payment provider yet.
// Keep this explicit rather than collecting card data or simulating a successful charge.
export const CheckoutModal = ({ plan, onClose }) => {
  if (!plan) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}>
      <section className="relative w-full max-w-md rounded-3xl border border-sky-100 bg-white p-6 shadow-2xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="checkout-not-ready-title">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100"><X size={18}/></button>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700"><LockKeyhole size={22}/></div>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[1.2px] text-sky-700">{plan.name} · coaching plan</p>
        <h2 id="checkout-not-ready-title" className="mt-2 text-2xl font-black text-slate-900">Online checkout isn’t set up yet</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">No payment has been taken. Coaching subscriptions need a configured payment provider. You can enroll in the Beginner Chess course through its secure course checkout.</p>
        <div className="mt-6 grid gap-3">
          <Link to="/courses" onClick={onClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#55c810] px-4 text-sm font-black text-white no-underline">View course enrollment <ArrowRight size={17}/></Link>
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600">Back to plans</button>
        </div>
      </section>
    </div>
  );
};
