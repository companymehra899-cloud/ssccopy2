import React from 'react';
import { Search, ShieldAlert, Sparkles, Wrench, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { JobCategory } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: JobCategory | 'All';
  onCategorySelect: (category: JobCategory | 'All') => void;
  isAdminOpen: boolean;
  isAdminAuthenticated?: boolean;
  onToggleAdmin: () => void;
  onOpenTools: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  isAdminOpen,
  isAdminAuthenticated = false,
  onToggleAdmin,
  onOpenTools,
  pendingCount,
}) => {
  const categories: (JobCategory | 'All')[] = [
    'All',
    'Result',
    'Admit Card',
    'Latest Jobs',
    'Answer Key',
    'Syllabus',
    'Admission',
  ];

  return (
    <header className="bg-[#b22222] text-white border-b-2 border-[#8b0000] shadow-sm">
      {/* Top Bar for Admin & Utility Links - Compact */}
      <div className="bg-[#8b0000] py-1 px-3 text-[11px] font-bold text-amber-100 flex flex-wrap justify-between items-center gap-1.5 border-b border-red-900">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-red-950 px-2 py-0.5 rounded text-amber-300 border border-amber-500/30 text-[10px] sm:text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Sarkari Updates Portal
          </span>
          <span className="hidden md:inline text-red-200 text-[11px]">
            Govt Job & Exam Info Network 2026
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenTools}
            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-black px-2.5 py-0.5 rounded text-[11px] font-extrabold transition shadow-xs cursor-pointer"
          >
            <Wrench className="w-3 h-3" />
            Candidate Tools (Age & Photo)
          </button>

          {isAdminOpen && (
            <button
              onClick={onToggleAdmin}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-amber-400 text-black hover:bg-amber-300 transition cursor-pointer shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Close Admin
              {pendingCount > 0 && (
                <span className="bg-red-600 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full animate-pulse ml-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Header Banner - Exact padding: 4px 0 */}
      <div className="max-w-7xl mx-auto px-3 py-[4px] relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-center md:text-left cursor-pointer" onClick={() => onCategorySelect('All')}>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-400 text-red-900 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl border border-white shadow-xs">
                S
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs text-white uppercase font-sans leading-none">
                SARKARI PORTAL
              </h1>
            </div>
            <p className="text-amber-200 text-xs sm:text-sm font-bold mt-0.5 tracking-wide">
              WWW.SARKARIPORTAL.COM - Official Job, Admit Card & Result Portal
            </p>
          </div>

          {/* Search Bar - Compact */}
          <div className="w-full md:w-80 relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Job, Admit Card, Result..."
                className="w-full bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-sm font-semibold pl-8 pr-7 py-1.5 rounded border border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-300 shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-2" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-700 font-bold text-xs bg-gray-200 px-1.5 py-0.2 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Category Bar - Compact */}
      <nav className="bg-[#8b0000] border-t border-red-900 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-start gap-1 p-1 font-bold">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs whitespace-nowrap transition cursor-pointer font-bold ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'text-white hover:bg-red-800 hover:text-amber-200'
                }`}
              >
                {cat === 'All' ? '🏠 Home' : cat}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
