import React from 'react';
import { ShieldCheck, Info, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenInfo?: (page: 'about' | 'privacy' | 'terms' | 'contact') => void;
  onOpenTools?: () => void;
  onSelectCategory?: (category: any) => void;
  onSearchTag?: (tag: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenInfo,
  onOpenTools,
  onSelectCategory,
  onSearchTag,
}) => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 text-xs sm:text-sm mt-12 border-t-4 border-[#b22222]">
      {/* Disclaimer Strip */}
      <div className="bg-[#262626] border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 text-gray-300 text-xs sm:text-sm leading-relaxed font-medium">
          <Info className="w-5 h-5 text-amber-400 shrink-0" />
          <p>
            <strong>Disclaimer:</strong> Sarkari Portal (www.sarkariportal.com) is a private educational and information aggregator service. We are not associated with any government department, ministry, or commission. All job listings, results, admit cards, and recruitment notices are published for candidate assistance based on public notifications. Candidates are advised to cross-check details on official government websites.
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="text-white font-extrabold text-base mb-2 text-amber-400 uppercase">
            SARKARI PORTAL
          </h4>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium">
            India's premier portal for fast, reliable updates on Government Jobs, SSC, UPSC, Railways, Banking, Defense, Teacher Recruitment, and State Board Results.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-2 uppercase border-b border-gray-700 pb-1">
            Top Job Categories
          </h4>
          <ul className="space-y-2 text-gray-300 font-medium">
            <li>
              <button
                onClick={() => onSearchTag?.('UPSC')}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • UPSC Civil Services
              </button>
            </li>
            <li>
              <button
                onClick={() => onSearchTag?.('SSC')}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • SSC CGL & CHSL Recruitment
              </button>
            </li>
            <li>
              <button
                onClick={() => onSearchTag?.('Railway')}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • Railway RRB NTPC & Group D
              </button>
            </li>
            <li>
              <button
                onClick={() => onSearchTag?.('Bank')}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • Bank PO & Clerk Recruitment
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-2 uppercase border-b border-gray-700 pb-1">
            Student Utilities
          </h4>
          <ul className="space-y-2 text-gray-300 font-medium">
            <li>
              <button
                onClick={() => onOpenTools?.()}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • Age Calculator Tool
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenTools?.()}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • Photo & Signature Inspector
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory?.('Answer Key')}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • Answer Keys & Objections
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory?.('Syllabus')}
                className="hover:text-amber-300 text-left cursor-pointer transition"
              >
                • Exam Syllabus PDF Downloads
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-2 uppercase border-b border-gray-700 pb-1">
            Important Information
          </h4>
          <ul className="space-y-2 text-gray-300 font-medium">
            <li>
              <button
                onClick={() => onOpenInfo?.('about')}
                className="hover:text-amber-300 text-left transition cursor-pointer"
              >
                • About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenInfo?.('privacy')}
                className="hover:text-amber-300 text-left transition cursor-pointer"
              >
                • Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenInfo?.('terms')}
                className="hover:text-amber-300 text-left transition cursor-pointer"
              >
                • Terms & Conditions
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenInfo?.('contact')}
                className="hover:text-amber-300 text-left transition cursor-pointer"
              >
                • Contact Us
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-black py-3.5 px-4 text-center text-gray-400 text-xs sm:text-sm font-semibold border-t border-gray-900">
        <p>© 2026 Sarkari Portal. All Rights Reserved. Designed for Government Job Aspirants Across India.</p>
      </div>
    </footer>
  );
};
