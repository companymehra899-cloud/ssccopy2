import React from 'react';
import { ShieldCheck, Info, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
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
            <li><a href="#" className="hover:text-amber-300">• UPSC Civil Services</a></li>
            <li><a href="#" className="hover:text-amber-300">• SSC CGL & CHSL Recruitment</a></li>
            <li><a href="#" className="hover:text-amber-300">• Railway RRB NTPC & Group D</a></li>
            <li><a href="#" className="hover:text-amber-300">• Bank PO & Clerk Recruitment</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-2 uppercase border-b border-gray-700 pb-1">
            Student Utilities
          </h4>
          <ul className="space-y-2 text-gray-300 font-medium">
            <li><a href="#" className="hover:text-amber-300">• Age Calculator Tool</a></li>
            <li><a href="#" className="hover:text-amber-300">• Photo & Signature Inspector</a></li>
            <li><a href="#" className="hover:text-amber-300">• Answer Keys & Objections</a></li>
            <li><a href="#" className="hover:text-amber-300">• Exam Syllabus PDF Downloads</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-2 uppercase border-b border-gray-700 pb-1">
            Important Information
          </h4>
          <ul className="space-y-2 text-gray-300 font-medium">
            <li><a href="#" className="hover:text-amber-300">• About Us</a></li>
            <li><a href="#" className="hover:text-amber-300">• Privacy Policy</a></li>
            <li><a href="#" className="hover:text-amber-300">• Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-amber-300">• Contact Us</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-black py-3.5 px-4 text-center text-gray-400 text-xs sm:text-sm font-semibold border-t border-gray-900 flex flex-wrap items-center justify-center gap-2 relative">
        <p>© 2026 Sarkari Portal. All Rights Reserved. Designed for Government Job Aspirants Across India.</p>
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            title="Admin Login"
            aria-label="Admin Login"
            className="text-gray-600 hover:text-amber-400 transition cursor-pointer p-1 rounded"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </footer>
  );
};
