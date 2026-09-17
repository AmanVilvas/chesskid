import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, FileText, BarChart2, MessageSquare } from 'lucide-react';

export const Header = () => {
  const [linksOpenMobile, setLinksOpenMobile] = useState(false);

  const headerLinks = [
    { label: "How to use the Chess With Rathish Lesson Planner", href: "#how-to-use", icon: HelpCircle },
    { 
      label: "How to request 1:1 Trial Classes & Full Curriculum (From ₹999/mo)", 
      to: "/pricing", 
      icon: FileText,
    },
    { label: "Analysis & Progress", href: "#analysis", icon: BarChart2 },
    { label: "Send us your feedback", href: "#feedback", icon: MessageSquare },
  ];

  return (
    <header className="mb-3.5">
      <div className="flex items-center gap-2 mb-1 sm:hidden">
        <span className="text-[10.5px] font-bold uppercase tracking-wider bg-[#50aa1b]/10 text-[#489f1f] px-2 py-0.5 rounded-full">
          Curriculum Guide
        </span>
      </div>
      <h1 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#1ba3e1] tracking-tight leading-tight">
        Lesson Planner - Beginner
      </h1>

      {/* Mobile Collapsible / Desktop Direct List */}
      <div className="mt-2">
        {/* Mobile toggle button */}
        <button
          type="button"
          onClick={() => setLinksOpenMobile((prev) => !prev)}
          className="flex sm:hidden items-center justify-between w-full py-1.5 px-2.5 text-xs font-semibold text-[#1ba3e1] bg-sky-50/70 border border-sky-200 rounded-md active:bg-sky-100 transition-colors cursor-pointer"
        >
          <span>Curriculum Resources & Links ({headerLinks.length})</span>
          {linksOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Links container: hidden on mobile unless toggled, always visible on sm+ */}
        <ul className={`${linksOpenMobile ? 'block' : 'hidden'} sm:block mt-2 sm:mt-2.5 space-y-1 bg-white sm:bg-transparent p-2 sm:p-0 rounded-md border border-gray-100 sm:border-0 shadow-xs sm:shadow-none`}>
          {headerLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <li key={idx}>
                {link.to ? (
                  <Link
                    to={link.to}
                    className="text-[12.5px] md:text-[13px] text-[#1ba3e1] hover:underline cursor-pointer flex items-center gap-1.5 font-semibold py-1 sm:py-0 transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#1ba3e1]/80 group-hover:text-[#1ba3e1] flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="text-[12.5px] md:text-[13px] text-[#1ba3e1] hover:underline cursor-pointer flex items-center gap-1.5 font-normal py-1 sm:py-0 transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#1ba3e1]/80 group-hover:text-[#1ba3e1] flex-shrink-0" />
                    <span>{link.label}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

