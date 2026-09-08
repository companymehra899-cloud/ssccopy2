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
    <header className="bg-[#b22222] text-white border-b-4 border-[#8b0000] shadow-md">
      {/* Top Bar for Admin & Utility Links */}
      <div className="bg-[#8b0000] py-2 px-4 text-xs sm:text-sm font-bold text-amber-100 flex flex-wrap justify-between items-center gap-2 border-b border-red-900">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-red-950 px-2.5 py-1 rounded text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-bold">
            <ShieldCheck className="w-4 h-4" />
            Official Sarkari Updates Portal
          </span>
          <span className="hidden md:inline text-red-200 text-xs sm:text-sm">
            India's Leading Government Job & Exam Info Network
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTools}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black px-3 py-1.5 rounded text-xs sm:text-sm font-extrabold transition shadow-sm cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            Candidate Tools (Age & Photo)
          </button>

          {(isAdminOpen || isAdminAuthenticated) && (
            <button
              onClick={onToggleAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs sm:text-sm font-extrabold transition cursor-pointer shadow ${
                isAdminOpen
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-black/40 text-amber-300 hover:bg-black/60 border border-amber-400/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              {isAdminOpen ? 'Close Admin Workspace' : 'Admin Panel'}
              {pendingCount > 0 && (
                <span className="bg-red-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-full animate-pulse ml-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-center relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left cursor-pointer" onClick={() => onCategorySelect('All')}>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-12 h-12 bg-amber-400 text-red-900 rounded-full flex items-center justify-center font-black text-3xl border-2 border-white shadow">
                S
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-sm text-white uppercase font-sans">
                SARKARI PORTAL
              </h1>
            </div>
            <p className="text-amber-200 text-sm sm:text-base font-bold mt-1.5 tracking-wide">
              WWW.SARKARIPORTAL.COM - Official Job, Admit Card & Result Portal
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96 relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Job, Admit Card, Result..."
                className="w-full bg-white text-gray-900 placeholder-gray-500 text-base font-semibold pl-10 pr-9 py-2.5 rounded border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700 font-bold text-sm bg-gray-200 px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Category Bar */}
      <nav className="bg-[#8b0000] border-t border-red-900 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start gap-1.5 p-1.5 font-bold">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap transition cursor-pointer font-extrabold ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-sm'
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
