import React, { useState } from 'react';
import { JobPost, JobCategory } from '../types';
import { ExternalLink, Database, RefreshCw, PlusCircle, CheckCircle2 } from 'lucide-react';

interface PortalGridProps {
  jobs: JobPost[];
  onSelectJob: (job: JobPost) => void;
  selectedCategoryFilter: JobCategory | 'All';
  selectedState: string;
  searchTerm: string;
}

export const PortalGrid: React.FC<PortalGridProps> = ({
  jobs,
  onSelectJob,
  selectedCategoryFilter,
  selectedState,
  searchTerm,
}) => {
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Filter approved jobs
  const approvedJobs = jobs.filter((job) => job.status === 'approved');

  // Filter jobs by category, state, and search term
  const filteredJobs = approvedJobs.filter((job) => {
    const matchesCategory =
      selectedCategoryFilter === 'All' || job.category === selectedCategoryFilter;

    const matchesState =
      selectedState === 'All' ||
      !job.state ||
      job.state === selectedState ||
      (selectedState !== 'All India' && job.state === 'All India');

    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.state && job.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.shortTitle && job.shortTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesState && matchesSearch;
  });

  // Standard 6 main categories
  const categories: JobCategory[] = [
    'Result',
    'Admit Card',
    'Latest Jobs',
    'Answer Key',
    'Syllabus',
    'Admission',
  ];

  // Helper to trigger Today's Seed Endpoint if user wants quick test data with TODAY'S DATE
  const handleSeedToday = async () => {
    setLoadingSeed(true);
    setStatusMessage('');
    try {
      const res = await fetch('/api/jobs/seed-today', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage("✅ Loaded sample live jobs set strictly to TODAY'S date!");
        window.location.reload();
      }
    } catch (e: any) {
      setStatusMessage('❌ Failed to fetch live sample jobs');
    } finally {
      setLoadingSeed(false);
    }
  };

  // Helper to completely clear database
  const handleClearDatabase = async () => {
    if (!confirm('Clear all jobs from database?')) return;
    try {
      await fetch('/api/jobs/clear', { method: 'POST' });
      localStorage.removeItem('sarkari_portal_jobs_v1');
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  // If a specific category or search is active, show filtered list view or categorized grid
  if (selectedCategoryFilter !== 'All' || searchTerm.trim() !== '') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border-2 border-[#b22222] rounded shadow-xs overflow-hidden mb-8">
          <div className="bg-[#b22222] text-white p-3 font-bold text-lg flex items-center justify-between">
            <span>
              {searchTerm
                ? `Search Results for "${searchTerm}"`
                : `${selectedCategoryFilter} Notifications`}
            </span>
            <span className="text-xs bg-amber-400 text-black px-2 py-1 rounded font-extrabold">
              {filteredJobs.length} Found
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-base font-semibold">No notifications available right now.</p>
              <p className="text-xs text-gray-400 mt-1">
                No active scraped updates found for this selection.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 p-2">
              {filteredJobs.map((job) => (
                <li key={job.id} className="p-3 hover:bg-red-50 transition rounded">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200">
                          {job.category}
                        </span>
                        {job.isHot && (
                          <span className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded animate-pulse">
                            🔥 NEW
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-medium">{job.department}</span>
                      </div>
                      <h4 className="text-[#0066cc] group-hover:text-[#b22222] font-bold text-sm sm:text-base mt-1">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{job.shortInfo}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-gray-500 block font-medium">
                        Posted: {job.postDate}
                      </span>
                      {job.lastDate && (
                        <span className="text-[11px] text-red-600 font-bold block">
                          Last Date: {job.lastDate}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Standard Sarkari Result 6-Box Grid Layout
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Featured Top Highlight Strip */}
      <div className="bg-amber-100 border-2 border-amber-400 text-amber-950 p-3 rounded mb-6 text-center shadow-xs">
        <p className="font-extrabold text-sm sm:text-base">
          ⭐ SARKARI RESULT OFFICIAL WEBSITE - LIVE RECRUITMENT PORTAL 2026 ⭐
        </p>
        <p className="text-xs mt-0.5 text-amber-800 font-medium">
          Real-Time Govt Job Scraping API Endpoint Ready (POST /api/jobs)
        </p>
      </div>

      {/* Global Empty State Banner if no jobs in database */}
      {approvedJobs.length === 0 && (
        <div className="bg-white border-2 border-dashed border-red-400 rounded-lg p-6 mb-8 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full mb-3">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No jobs available right now</h3>
          <p className="text-sm text-gray-600 max-w-xl mx-auto mt-1">
            Old hardcoded Jan/Feb static data has been cleared completely. The portal is ready to receive live scraped jobs from your Python script via <code className="bg-gray-100 text-red-700 px-1.5 py-0.5 rounded font-mono text-xs font-bold">POST /api/jobs</code> with today's date.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
            <button
              onClick={handleSeedToday}
              disabled={loadingSeed}
              className="inline-flex items-center gap-2 bg-[#b22222] hover:bg-red-800 text-white font-bold px-4 py-2 rounded text-xs transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingSeed ? 'animate-spin' : ''}`} />
              {loadingSeed ? 'Loading Today Jobs...' : "Load Sample Jobs with Today's Date"}
            </button>
            <button
              onClick={handleClearDatabase}
              className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded text-xs transition cursor-pointer"
            >
              Clear Storage
            </button>
          </div>

          {statusMessage && (
            <p className="text-xs font-bold text-green-700 mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {statusMessage}
            </p>
          )}
        </div>
      )}

      {/* 6 Box Portal Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {categories.map((cat) => {
          const categoryJobs = filteredJobs.filter((job) => job.category === cat);

          return (
            <div
              key={cat}
              className="bg-white border-2 border-[#b22222] rounded shadow-xs overflow-hidden flex flex-col h-[280px] md:h-[380px]"
            >
              {/* Portal Box Header */}
              <div className="bg-[#b22222] text-white p-2 text-center font-black text-xs md:text-lg tracking-wide flex items-center justify-center gap-1 md:gap-2 border-b-2 border-red-900 shrink-0">
                <span>{cat}</span>
                <span className="bg-amber-400 text-black text-[9px] md:text-xs font-black px-1.5 md:px-2 py-0.5 rounded-full">
                  {categoryJobs.length}
                </span>
              </div>

              {/* Scrollable Portal List */}
              <div className="p-2 md:p-3.5 overflow-y-auto flex-1 scrollbar-thin flex flex-col justify-between">
                {categoryJobs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
                    <p className="text-[10px] md:text-sm font-bold text-gray-600">No updates</p>
                  </div>
                ) : (
                  <ul className="space-y-1.5 md:space-y-2.5">
                    {categoryJobs.map((job) => (
                      <li
                        key={job.id}
                        className="border-b border-dashed border-gray-300 pb-1.5 md:pb-2.5 text-[10px] md:text-sm leading-snug"
                      >
                        <button
                          onClick={() => onSelectJob(job)}
                          className="text-[#0066cc] hover:underline hover:text-[#b22222] font-bold text-left w-full block transition cursor-pointer"
                        >
                          • {job.shortTitle || job.title}
                          {job.state && job.state !== 'All India' && (
                            <span className="inline-block bg-blue-100 text-blue-900 text-[9px] md:text-xs font-black px-1 py-0.5 rounded ml-1 border border-blue-300">
                              {job.state}
                            </span>
                          )}
                          {job.isHot && (
                            <span className="inline-block bg-red-600 text-white text-[9px] md:text-xs font-black px-1 py-0.5 rounded ml-1 uppercase animate-pulse">
                              New
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}

        {/* 7th Extra Box */}
        <div className="bg-white border-2 border-[#b22222] rounded shadow-xs overflow-hidden flex flex-col h-[200px] md:h-[380px] lg:col-span-3">
          <div className="bg-[#b22222] text-white p-2 text-center font-bold text-xs md:text-base tracking-wide flex items-center justify-center gap-2 border-b-2 border-red-900 shrink-0">
            <span>Important Links & Certificate Services</span>
          </div>

          <div className="p-2 md:p-4 grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto">
            {/* ... link items ... */}
            <a
              href="https://uidai.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 md:p-2 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-[10px] md:text-xs flex items-center justify-between"
            >
              <span>Aadhar Card</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            {/* ... (repeat/compact other links) ... */}
            <a
              href="https://www.pan.onlineportal.tin.egov-nsdl.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-xs flex items-center justify-between"
            >
              <span>• PAN Card Online Apply / Correction</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-xs flex items-center justify-between"
            >
              <span>• Voter ID Online Registration</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
            <a
              href="https://digilocker.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-xs flex items-center justify-between"
            >
              <span>• DigiLocker Certificate Download</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
            <a
              href="https://scholarships.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-xs flex items-center justify-between"
            >
              <span>• National Scholarship Portal NSP</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
            <a
              href="https://csc.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-2 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-xs flex items-center justify-between"
            >
              <span>• CSC Digital Seva Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
