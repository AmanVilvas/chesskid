import React from 'react';
import { 
  Clock, 
  Pencil, 
  Puzzle, 
  RotateCcw, 
  ArrowUpRight, 
  Presentation, 
  CheckSquare, 
  Play, 
  Users, 
  FileText,
  BookOpen
} from 'lucide-react';

export const SectionIcon = ({ type }) => {
  switch (type) {
    case 'clock':
      return (
        <div className="w-5 h-5 rounded-full bg-[#8bc34a]/20 border border-[#7cb342] flex items-center justify-center flex-shrink-0">
          <Clock className="w-3.5 h-3.5 text-[#558b2f]" strokeWidth={2.5} />
        </div>
      );
    case 'pencil':
      return (
        <div className="w-5 h-5 rounded bg-[#fff3e0] border border-[#ffb74d] flex items-center justify-center flex-shrink-0 shadow-2xs">
          <Pencil className="w-3.5 h-3.5 text-[#e65100]" strokeWidth={2.5} />
        </div>
      );
    case 'target':
    case 'puzzle':
      return (
        <div className="w-5 h-5 rounded bg-[#fff8e1] border border-[#fbc02d] flex items-center justify-center flex-shrink-0 shadow-2xs">
          <Puzzle className="w-3.5 h-3.5 text-[#f57f17]" strokeWidth={2.5} />
        </div>
      );
    case 'loop':
      return (
        <div className="w-5 h-5 rounded-full bg-[#e1f5fe] border border-[#4fc3f7] flex items-center justify-center flex-shrink-0">
          <RotateCcw className="w-3.5 h-3.5 text-[#0288d1]" strokeWidth={2.5} />
        </div>
      );
    case 'arrow':
      return (
        <div className="w-5 h-5 rounded bg-[#e0f2f1] border border-[#26a69a] flex items-center justify-center flex-shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5 text-[#00695c]" strokeWidth={2.5} />
        </div>
      );
    case 'easel':
      return (
        <div className="w-5 h-5 rounded bg-[#efebe9] border border-[#a1887f] flex items-center justify-center flex-shrink-0">
          <Presentation className="w-3.5 h-3.5 text-[#4e342e]" strokeWidth={2.5} />
        </div>
      );
    case 'check':
      return (
        <div className="w-5 h-5 rounded bg-[#ffebee] border border-[#e57373] flex items-center justify-center flex-shrink-0">
          <CheckSquare className="w-3.5 h-3.5 text-[#c62828]" strokeWidth={2.5} />
        </div>
      );
    default:
      return null;
  }
};

export const LessonItemIcon = ({ type }) => {
  switch (type) {
    case 'video':
      return (
        <span className="inline-flex items-center justify-center w-5 h-4 bg-[#545454] rounded-[3px] text-white shadow-2xs">
          <Play className="w-2.5 h-2.5 fill-white" />
        </span>
      );
    case 'game':
    case 'people':
      return (
        <span className="inline-flex items-center justify-center w-5 h-4 bg-[#fff8e1] border border-[#f5b82e] rounded-[3px] text-[#e65100] shadow-2xs">
          <Users className="w-3 h-3 text-[#d97706]" strokeWidth={2.2} />
        </span>
      );
    case 'document':
      return (
        <span className="inline-flex items-center justify-center w-4 h-4 bg-[#eceff1] border border-[#b0bec5] rounded-[2px] shadow-2xs">
          <FileText className="w-3 h-3 text-[#b71c1c]" strokeWidth={2} />
        </span>
      );
    case 'glossary':
      return (
        <span className="inline-flex items-center justify-center w-4 h-4 bg-[#e8f5e9] border border-[#81c784] rounded-[2px] shadow-2xs">
          <BookOpen className="w-3 h-3 text-[#2e7d32]" strokeWidth={2} />
        </span>
      );
    default:
      return null;
  }
};
