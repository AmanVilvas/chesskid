import React from 'react';

export const Header = () => {
  const headerLinks = [
    { label: "How to use the ChessKid Lesson Planner", href: "#how-to-use" },
    { label: "How to request the full ChessKid Written Curriculum", href: "#curriculum" },
    { label: "Analysis", href: "#analysis" },
    { label: "Send us your feedback", href: "#feedback" },
  ];

  return (
    <header className="mb-3.5">
      <h1 className="text-[26px] md:text-[28px] font-bold text-[#1ba3e1] tracking-tight leading-tight">
        Lesson Planner - Beginner
      </h1>

      <ul className="mt-2.5 space-y-1">
        {headerLinks.map((link, idx) => (
          <li key={idx}>
            <a
              href={link.href}
              className="text-[12.5px] md:text-[13px] text-[#1ba3e1] hover:underline cursor-pointer block font-normal transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
};
