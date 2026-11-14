import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, Menu, Sparkles, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useExperienceMode } from './ExperienceModeContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { mode, setMode } = useExperienceMode();
  const isCurriculum = location.pathname.startsWith('/curriculum') || location.pathname.startsWith('/lesson-planner');

  const closeMenu = () => setMobileMenuOpen(false);
  const links = [
    { label: 'Home', to: '/#home' },
    { label: 'Learn chess', to: '/#pieces' },
    { label: 'Kids World', to: '/play', active: location.pathname.startsWith('/play') },
    { label: 'Lesson planner', to: '/curriculum', active: isCurriculum },
    { label: 'Courses', to: '/courses', active: location.pathname.startsWith('/courses') },
    ...(['admin', 'instructor'].includes(user?.role) ? [{ label: 'Studio', to: '/admin', active: location.pathname.startsWith('/admin') }] : []),
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
          <div className="hidden items-center rounded-xl border border-sky-100 bg-[#f5fbfd] p-1 xl:flex" role="group" aria-label="Choose learning view">
            <button type="button" onClick={() => setMode('adventure')} aria-pressed={mode === 'adventure'} className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-extrabold transition ${mode === 'adventure' ? 'bg-[#18354a] text-white shadow-sm' : 'text-[#638093] hover:text-[#18354a]'}`}><Sparkles size={13}/> Adventure</button>
            <button type="button" onClick={() => setMode('parent')} aria-pressed={mode === 'parent'} className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-extrabold transition ${mode === 'parent' ? 'bg-white text-[#18354a] shadow-sm' : 'text-[#638093] hover:text-[#18354a]'}`}><BookOpen size={13}/> Parent view</button>
          </div>
          {user ? <button type="button" onClick={signOut} className="hidden min-h-[38px] items-center rounded-[12px] border border-sky-100 bg-white px-3 text-[11px] font-extrabold text-[#315c7a] transition hover:bg-sky-50 sm:inline-flex" title={`Signed in as ${user.email}`}>Hi, {user.name.split(' ')[0]} · Sign out</button> : <><Link to="/login" className="hidden min-h-[38px] items-center rounded-[12px] px-3 text-[11px] font-extrabold text-[#536c81] no-underline transition hover:bg-sky-50 hover:text-[#2d8db5] sm:inline-flex">Sign in</Link><Link to="/signup" className="hidden min-h-[38px] items-center rounded-[12px] border border-[#b8e7f7] bg-[#effaff] px-3 text-[11px] font-black text-[#287da7] no-underline transition hover:bg-[#e3f7ff] sm:inline-flex">Create account</Link></>}
          <Link to="/curriculum?view=player&unit=1&lecture=u1-l2&puzzle=1" className="hidden min-h-[40px] items-center gap-2 rounded-[13px] bg-[#55c810] px-4 text-[11px] font-black text-white no-underline shadow-[0_4px_0_#38a509] transition hover:-translate-y-0.5 hover:bg-[#49b90c] sm:inline-flex">Start learning <ArrowRight size={15}/></Link>
          <Link to="/pricing" className="hidden min-h-[40px] items-center rounded-[13px] bg-[#ffcf4a] px-4 text-[11px] font-black text-[#4b3c0a] no-underline transition hover:bg-[#ffd96c] md:inline-flex">Book a 1:1 trial</Link>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-sky-100 bg-white text-[#315c7a] lg:hidden" type="button" onClick={() => setMobileMenuOpen((value) => !value)} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>

      {mobileMenuOpen && <nav className="grid gap-1 border-t border-sky-100 bg-white px-4 py-3 shadow-lg lg:hidden" aria-label="Mobile navigation">
        <div className="grid grid-cols-2 gap-2 py-2" role="group" aria-label="Choose learning view">
          <button type="button" onClick={() => setMode('adventure')} aria-pressed={mode === 'adventure'} className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl text-[11px] font-black ${mode === 'adventure' ? 'bg-[#18354a] text-white' : 'border border-sky-100 bg-white text-[#536c81]'}`}><Sparkles size={14}/> Adventure</button>
          <button type="button" onClick={() => setMode('parent')} aria-pressed={mode === 'parent'} className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl text-[11px] font-black ${mode === 'parent' ? 'bg-[#18354a] text-white' : 'border border-sky-100 bg-white text-[#536c81]'}`}><BookOpen size={14}/> Parent view</button>
        </div>
        {links.map((item) => item.to.startsWith('/#')
          ? <a key={item.label} href={item.to} onClick={closeMenu} className="flex min-h-[43px] items-center rounded-lg px-3 text-[13px] font-extrabold text-[#536c81] no-underline hover:bg-sky-50">{item.label}</a>
          : <Link key={item.label} to={item.to} onClick={closeMenu} className={`flex min-h-[43px] items-center rounded-lg px-3 text-[13px] font-extrabold no-underline ${item.active ? 'bg-sky-50 text-[#2d8db5]' : 'text-[#536c81] hover:bg-sky-50'}`}>{item.label}</Link>)}
        {user ? <button type="button" onClick={() => { signOut(); closeMenu(); }} className="mt-1 min-h-[43px] rounded-lg px-3 text-left text-[12px] font-extrabold text-[#536c81] hover:bg-sky-50">Sign out · {user.name}</button> : <div className="grid grid-cols-2 gap-2 pt-1"><Link to="/login" onClick={closeMenu} className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-sky-100 text-[12px] font-black text-[#315c7a] no-underline">Sign in</Link><Link to="/signup" onClick={closeMenu} className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#e8f8ff] text-[12px] font-black text-[#287da7] no-underline">Create account</Link></div>}
        <Link to="/curriculum?view=player&unit=1&lecture=u1-l2&puzzle=1" onClick={closeMenu} className="mt-1 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#55c810] text-[12px] font-black text-white no-underline">Start learning <ArrowRight size={15}/></Link>
        <Link to="/pricing" onClick={closeMenu} className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#fff3cf] text-[12px] font-black text-[#6e5817] no-underline">Book a 1:1 trial</Link>
      </nav>}
    </header>
  );
};
