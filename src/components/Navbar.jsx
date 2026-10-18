import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isCurriculum = location.pathname.startsWith('/curriculum') || location.pathname.startsWith('/lesson-planner');

  const closeMenu = () => setMobileMenuOpen(false);
  const links = [
    { label: 'Home', to: '/#home' },
    { label: 'Learn chess', to: '/#pieces' },
    { label: 'Adventure map', to: '/#adventure-map' },
    { label: 'Lesson planner', to: '/curriculum', active: isCurriculum },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2.5 text-[#163858] no-underline">
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#e2f5ff] text-[27px] text-[#328bb9] shadow-[inset_0_-3px_#cbeafa]">♞</span>
          <span className="leading-none"><span className="block text-[15px] font-black tracking-tight">The Thinking Academy</span><small className="mt-1 block text-[8px] font-extrabold tracking-[1.2px] text-[#8298a8]">CHESS · CURIOSITY · CONFIDENCE</small></span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {links.map((item) => item.to.startsWith('/#')
            ? <a key={item.label} href={item.to} className="whitespace-nowrap text-[12px] font-extrabold text-[#536c81] no-underline transition-colors hover:text-[#2d8db5]">{item.label}</a>
            : <Link key={item.label} to={item.to} className={`whitespace-nowrap text-[12px] font-extrabold no-underline transition-colors ${item.active ? 'text-[#2d8db5]' : 'text-[#536c81] hover:text-[#2d8db5]'}`}>{item.label}</Link>)}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link to="/curriculum?view=player&unit=1&lecture=u1-l2&puzzle=1" className="hidden min-h-[40px] items-center gap-2 rounded-[13px] bg-[#55c810] px-4 text-[11px] font-black text-white no-underline shadow-[0_4px_0_#38a509] transition hover:-translate-y-0.5 hover:bg-[#49b90c] sm:inline-flex">Start learning <ArrowRight size={15}/></Link>
          <Link to="/pricing" className="hidden min-h-[40px] items-center rounded-[13px] bg-[#ffcf4a] px-4 text-[11px] font-black text-[#4b3c0a] no-underline transition hover:bg-[#ffd96c] md:inline-flex">Book a 1:1 trial</Link>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-sky-100 bg-white text-[#315c7a] lg:hidden" type="button" onClick={() => setMobileMenuOpen((value) => !value)} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>

      {mobileMenuOpen && <nav className="grid gap-1 border-t border-sky-100 bg-white px-4 py-3 shadow-lg lg:hidden" aria-label="Mobile navigation">
        {links.map((item) => item.to.startsWith('/#')
          ? <a key={item.label} href={item.to} onClick={closeMenu} className="flex min-h-[43px] items-center rounded-lg px-3 text-[13px] font-extrabold text-[#536c81] no-underline hover:bg-sky-50">{item.label}</a>
          : <Link key={item.label} to={item.to} onClick={closeMenu} className={`flex min-h-[43px] items-center rounded-lg px-3 text-[13px] font-extrabold no-underline ${item.active ? 'bg-sky-50 text-[#2d8db5]' : 'text-[#536c81] hover:bg-sky-50'}`}>{item.label}</Link>)}
        <Link to="/curriculum?view=player&unit=1&lecture=u1-l2&puzzle=1" onClick={closeMenu} className="mt-1 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#55c810] text-[12px] font-black text-white no-underline">Start learning <ArrowRight size={15}/></Link>
        <Link to="/pricing" onClick={closeMenu} className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#fff3cf] text-[12px] font-black text-[#6e5817] no-underline">Book a 1:1 trial</Link>
      </nav>}
    </header>
  );
};
