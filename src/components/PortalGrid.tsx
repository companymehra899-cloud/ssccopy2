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
      job.state === selectedState ||
      (selectedState === 'All India' && (!job.state || job.state === 'All India'));

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
      <div className="max-w-7xl mx-auto px-2 sm:px-3 py-2">
        <div className="bg-white border-2 border-[#b22222] rounded shadow-xs overflow-hidden mb-4">
          <div className="bg-[#b22222] text-white py-1.5 px-3 font-bold text-sm sm:text-base flex items-center justify-between">
            <span>
              {searchTerm
                ? `Search Results for "${searchTerm}"`
                : `${selectedCategoryFilter} Notifications`}
            </span>
            <span className="text-[11px] bg-amber-400 text-black px-2 py-0.5 rounded font-black">
              {filteredJobs.length} Found
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm font-semibold">No notifications available right now.</p>
              <p className="text-xs text-gray-400 mt-0.5">
                No active scraped updates found for this selection.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 p-1">
              {filteredJobs.map((job) => (
                <li key={job.id} className="p-2 hover:bg-red-50 transition rounded">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1 group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded border border-red-200">
                          {job.category}
                        </span>
                        {job.isHot && (
                          <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded animate-pulse">
                            🔥 NEW
                          </span>
                        )}
                        <span className="text-[11px] text-gray-500 font-medium">{job.department}</span>
                      </div>
                      <h4 className="text-[#0066cc] group-hover:text-[#b22222] font-bold text-xs sm:text-sm mt-0.5 leading-snug">
                        {job.title}
                      </h4>
                      <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">{job.shortInfo}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-500 block font-medium">
                        Posted: {job.postDate}
                      </span>
                      {job.lastDate && (
                        <span className="text-[10px] text-red-600 font-bold block">
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
    <div className="max-w-7xl mx-auto px-2 sm:px-3 py-1.5">
      {/* Global Empty State Banner if no jobs in database */}
      {approvedJobs.length === 0 && (
        <div className="bg-white border border-dashed border-red-400 rounded-md p-3 mb-2 text-center shadow-xs">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full mb-1">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No jobs available right now</h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto mt-0.5">
            The portal is ready to receive live scraped jobs from your Python script via <code className="bg-gray-100 text-red-700 px-1 py-0.2 rounded font-mono text-[11px] font-bold">POST /api/jobs</code>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <button
              onClick={handleSeedToday}
              disabled={loadingSeed}
              className="inline-flex items-center gap-1.5 bg-[#b22222] hover:bg-red-800 text-white font-bold px-3 py-1 rounded text-xs transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSeed ? 'animate-spin' : ''}`} />
              {loadingSeed ? 'Loading...' : "Load Sample Today's Jobs"}
            </button>
            <button
              onClick={handleClearDatabase}
              className="inline-flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-2.5 py-1 rounded text-xs transition cursor-pointer"
            >
              Clear Storage
            </button>
          </div>

          {statusMessage && (
            <p className="text-xs font-bold text-green-700 mt-1.5 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {statusMessage}
            </p>
          )}
        </div>
      )}

      {/* 6 Box Portal Grid - Compact for Above The Fold View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const categoryJobs = filteredJobs.filter((job) => job.category === cat);

          return (
            <div
              key={cat}
              className="bg-white border-2 border-[#b22222] rounded shadow-xs overflow-hidden flex flex-col h-auto"
            >
              {/* Portal Box Header */}
              <div className="bg-[#b22222] text-white py-1 px-2 text-center font-black text-xs md:text-sm tracking-wide flex items-center justify-center gap-1.5 border-b-2 border-red-900 shrink-0">
                <span>{cat}</span>
                <span className="bg-amber-400 text-black text-[9px] md:text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {categoryJobs.length}
                </span>
              </div>

              {/* Scrollable Portal List */}
              <div className="p-1.5 md:p-2 overflow-y-auto scrollbar-thin">
                {categoryJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <p className="text-[11px] md:text-xs font-bold text-gray-500">No updates</p>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {categoryJobs.map((job) => (
                      <li
                        key={job.id}
                        className="border-b border-dashed border-gray-200 pb-1 text-[11px] md:text-xs leading-tight"
                      >
                        <button
                          onClick={() => onSelectJob(job)}
                          className="text-[#0066cc] hover:underline hover:text-[#b22222] font-bold text-left w-full block transition cursor-pointer"
                        >
                          • {job.shortTitle || job.title}
                          {job.state && job.state !== 'All India' && (
                            <span className="inline-block bg-blue-100 text-blue-900 text-[8px] md:text-[9px] font-black px-1 py-0.2 rounded ml-1 border border-blue-300">
                              {job.state}
                            </span>
                          )}
                          {job.isHot && (
                            <span className="inline-block bg-red-600 text-white text-[8px] md:text-[9px] font-black px-1 py-0.2 rounded ml-1 uppercase animate-pulse">
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

        {/* 7th Extra Box - Compact */}
        <div className="bg-white border-2 border-[#b22222] rounded shadow-xs overflow-hidden flex flex-col h-auto lg:col-span-3">
          <div className="bg-[#b22222] text-white py-1 px-2 text-center font-bold text-xs md:text-sm tracking-wide flex items-center justify-center gap-2 border-b-2 border-red-900 shrink-0">
            <span>Important Links & Certificate Services</span>
          </div>

          <div className="p-1.5 md:p-2.5 grid grid-cols-2 md:grid-cols-3 gap-1.5 overflow-y-auto">
            <a
              href="https://uidai.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-1 md:p-1.5 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-[10px] md:text-[11px] flex items-center justify-between"
            >
              <span>• Aadhar Card</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href="https://www.pan.onlineportal.tin.egov-nsdl.com"
              target="_blank"
              rel="noreferrer"
              className="p-1 md:p-1.5 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-[10px] md:text-[11px] flex items-center justify-between"
            >
              <span>• PAN Card Apply / Correction</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-1 md:p-1.5 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-[10px] md:text-[11px] flex items-center justify-between"
            >
              <span>• Voter ID Registration</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href="https://digilocker.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-1 md:p-1.5 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-[10px] md:text-[11px] flex items-center justify-between"
            >
              <span>• DigiLocker Certificate</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href="https://scholarships.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-1 md:p-1.5 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-[10px] md:text-[11px] flex items-center justify-between"
            >
              <span>• National Scholarship (NSP)</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
            <a
              href="https://csc.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-1 md:p-1.5 border border-gray-200 rounded hover:bg-red-50 text-[#0066cc] hover:text-[#b22222] font-semibold text-[10px] md:text-[11px] flex items-center justify-between"
            >
              <span>• CSC Digital Seva Portal</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
