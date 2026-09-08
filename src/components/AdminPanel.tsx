import React, { useState } from 'react';
import { JobPost, JobCategory, JobStatus, MarqueeUpdate } from '../types';
import {
  CheckCircle2,
  XCircle,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Sparkles,
  Edit3,
  Check,
  RotateCcw,
  Volume2,
  ListFilter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  jobs: JobPost[];
  onUpdateJobStatus: (id: string, status: JobStatus) => void;
  onBulkUpdateStatus: (ids: string[], status: JobStatus) => void;
  onDeleteJob: (id: string) => void;
  onAddJob: (newJob: JobPost) => void;
  marqueeItems: MarqueeUpdate[];
  onUpdateMarquee: (items: MarqueeUpdate[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  jobs,
  onUpdateJobStatus,
  onBulkUpdateStatus,
  onDeleteJob,
  onAddJob,
  marqueeItems,
  onUpdateMarquee,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'create' | 'ai' | 'marquee' | 'scraper'>('jobs');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<JobStatus | 'all'>('pending');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<JobCategory | 'all'>('all');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // New Marquee Text Input
  const [newMarqueeText, setNewMarqueeText] = useState('');

  // Create Job Form State
  const [formData, setFormData] = useState<Partial<JobPost>>({
    title: '',
    shortTitle: '',
    category: 'Latest Jobs',
    state: 'All India',
    department: '',
    postDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    lastDate: '',
    shortInfo: '',
    status: 'approved',
    isHot: true,
    totalPosts: '',
    importantDates: { applicationBegin: '', lastDateApply: '', examDate: '' },
    applicationFee: { generalObcEws: '₹ 100/-', scStPh: '₹ 0/-' },
    ageLimit: { minAge: '18 Years', maxAge: '30 Years' },
    vacancyDetails: [{ postName: 'General Officer / Assistant', totalPosts: '100', eligibility: 'Bachelor Degree' }],
    links: { applyOnline: 'https://nic.in', downloadNotification: 'https://nic.in', officialWebsite: 'https://nic.in' },
  });

  // Filter jobs for list
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = selectedStatusFilter === 'all' || job.status === selectedStatusFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || job.category === selectedCategoryFilter;
    const matchesState = selectedStateFilter === 'all' || job.state === selectedStateFilter;
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesState && matchesSearch;
  });

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedJobIds(filteredJobs.map((j) => j.id));
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedJobIds.includes(id)) {
      setSelectedJobIds(selectedJobIds.filter((item) => item !== id));
    } else {
      setSelectedJobIds([...selectedJobIds, id]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedJobIds.length === 0) return;
    onBulkUpdateStatus(selectedJobIds, 'approved');
    setSelectedJobIds([]);
  };

  const handleBulkReject = () => {
    if (selectedJobIds.length === 0) return;
    onBulkUpdateStatus(selectedJobIds, 'rejected');
    setSelectedJobIds([]);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    const newJobPost: JobPost = {
      id: `job-${Date.now()}`,
      title: formData.title,
      shortTitle: formData.shortTitle || formData.title,
      category: formData.category as JobCategory,
      state: formData.state || 'All India',
      department: formData.department || 'Government of India',
      postDate: formData.postDate || new Date().toLocaleDateString('en-GB'),
      lastDate: formData.lastDate || '',
      shortInfo: formData.shortInfo || 'Official notification released. Read details before applying.',
      status: (formData.status as JobStatus) || 'approved',
      isHot: formData.isHot ?? true,
      totalPosts: formData.totalPosts || '',
      importantDates: formData.importantDates || {},
      applicationFee: formData.applicationFee || {},
      ageLimit: formData.ageLimit || {},
      vacancyDetails: formData.vacancyDetails || [],
      links: formData.links || { applyOnline: 'https://nic.in' },
      createdAt: new Date().toISOString(),
    };

    onAddJob(newJobPost);
    alert('Job notification created successfully!');
    setActiveTab('jobs');
  };

  // AI Generator Handler
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError('');

    try {
      const res = await fetch('/api/generate-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await res.json();
      if (data.success && data.job) {
        onAddJob({
          ...data.job,
          id: `job-ai-${Date.now()}`,
          status: 'approved',
          createdAt: new Date().toISOString(),
        });
        alert('✨ Job generated & published directly via Gemini AI!');
        setAiPrompt('');
        setActiveTab('jobs');
      } else {
        setAiError(data.error || 'Failed to generate job.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error connecting to Gemini API endpoint.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add Marquee
  const handleAddMarquee = () => {
    if (!newMarqueeText.trim()) return;
    const newItem: MarqueeUpdate = {
      id: `m-${Date.now()}`,
      text: newMarqueeText.trim(),
      active: true,
    };
    onUpdateMarquee([...marqueeItems, newItem]);
    setNewMarqueeText('');
  };

  const handleToggleMarquee = (id: string) => {
    onUpdateMarquee(
      marqueeItems.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleDeleteMarquee = (id: string) => {
    onUpdateMarquee(marqueeItems.filter((item) => item.id !== id));
  };

  // Counts
  const pendingCount = jobs.filter((j) => j.status === 'pending').length;
  const approvedCount = jobs.filter((j) => j.status === 'approved').length;
  const rejectedCount = jobs.filter((j) => j.status === 'rejected').length;

  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Workspace Top Header */}
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide uppercase">
                Admin Approval Workspace & Control Panel
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage Job Posts, Review Pending Applications, Bulk Approve/Reject, & Publish Live Ticker
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded transition cursor-pointer self-end md:self-auto"
          >
            ✕ Exit Admin View
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'jobs' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            Manage & Approve Jobs
            {pendingCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'create' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            + Manual Job Entry
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            ⚡ AI Fast Post Generator
          </button>

          <button
            onClick={() => setActiveTab('marquee')}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'marquee' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Live Marquee Ticker
          </button>

          <button
            onClick={() => setActiveTab('scraper')}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scraper' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🐍 Python Scraper & Ingestion API
          </button>
        </div>

        {/* TAB 1: MANAGE & APPROVE JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => setSelectedStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                    selectedStatusFilter === 'pending'
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('approved')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                    selectedStatusFilter === 'approved'
                      ? 'bg-emerald-500 text-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Approved ({approvedCount})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('rejected')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                    selectedStatusFilter === 'rejected'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Rejected ({rejectedCount})
                </button>
                <button
                  onClick={() => setSelectedStatusFilter('all')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer ${
                    selectedStatusFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All ({jobs.length})
                </button>
              </div>

              {/* Search, State & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <select
                  value={selectedStateFilter}
                  onChange={(e) => setSelectedStateFilter(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-amber-400 font-bold"
                >
                  <option value="all">🗺️ All States</option>
                  <option value="All India">🇮🇳 All India</option>
                  <option value="UP">🔴 UP (Uttar Pradesh)</option>
                  <option value="Bihar">🟡 Bihar (BPSC/BSSC)</option>
                  <option value="Rajasthan">🟠 Rajasthan (RSMSSB)</option>
                  <option value="MP">🟢 MP (MPESB)</option>
                  <option value="Delhi">🔵 Delhi (DSSSB)</option>
                  <option value="Punjab">🌾 Punjab</option>
                  <option value="Haryana">🚜 Haryana</option>
                  <option value="Uttarakhand">🏔️ Uttarakhand</option>
                  <option value="Odisha">🌊 Odisha</option>
                  <option value="Maharashtra">🦁 Maharashtra</option>
                  <option value="Assam">🦏 Assam</option>
                  <option value="Jharkhand">⛏️ Jharkhand</option>
                  <option value="West Bengal">🐯 West Bengal</option>
                  <option value="Tamil Nadu">🛕 Tamil Nadu</option>
                  <option value="Andhra Pradesh">☀️ Andhra Pradesh</option>
                  <option value="Jammu & Kashmir">❄️ Jammu & Kashmir</option>
                  <option value="Karnataka">🏰 Karnataka</option>
                  <option value="Kerala">🌴 Kerala</option>
                  <option value="Gujarat">🪁 Gujarat</option>
                </select>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value as any)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Categories</option>
                  <option value="Result">Result</option>
                  <option value="Admit Card">Admit Card</option>
                  <option value="Latest Jobs">Latest Jobs</option>
                  <option value="Answer Key">Answer Key</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Admission">Admission</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title or board..."
                    className="bg-slate-900 text-white placeholder-slate-500 text-xs pl-8 pr-3 py-1.5 rounded border border-slate-700 w-full sm:w-48 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                </div>
              </div>
            </div>

            {/* Bulk Action Controls */}
            {selectedJobIds.length > 0 && (
              <div className="bg-amber-500/20 border border-amber-500 p-3 rounded flex items-center justify-between text-xs text-amber-200 animate-fadeIn">
                <span className="font-bold">
                  {selectedJobIds.length} Job(s) Selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkApprove}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bulk Approve
                  </button>
                  <button
                    onClick={handleBulkReject}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded transition cursor-pointer flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Bulk Reject
                  </button>
                </div>
              </div>
            )}

            {/* Table View */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-amber-400 uppercase font-bold text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          filteredJobs.length > 0 &&
                          selectedJobIds.length === filteredJobs.length
                        }
                        className="rounded accent-amber-400 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Title & Category</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Post Date</th>
                    <th className="p-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No jobs found under this status/category filter.
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-750 transition">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedJobIds.includes(job.id)}
                            onChange={() => handleToggleSelect(job.id)}
                            className="rounded accent-amber-400 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 max-w-xs">
                          <span className="text-[10px] bg-slate-900 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase mr-1.5">
                            {job.category}
                          </span>
                          <strong className="text-white text-xs block mt-1 leading-tight">
                            {job.title}
                          </strong>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">{job.department}</td>
                        <td className="p-3">
                          {job.status === 'approved' && (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                              ✓ Approved
                            </span>
                          )}
                          {job.status === 'pending' && (
                            <span className="bg-amber-950 text-amber-400 border border-amber-600/40 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 animate-pulse">
                              ⏳ Pending
                            </span>
                          )}
                          {job.status === 'rejected' && (
                            <span className="bg-red-950 text-red-400 border border-red-600/40 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                              ✕ Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                          {job.postDate}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {job.status !== 'approved' && (
                              <button
                                onClick={() => onUpdateJobStatus(job.id, 'approved')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer"
                                title="Approve Post"
                              >
                                Approve
                              </button>
                            )}
                            {job.status !== 'rejected' && (
                              <button
                                onClick={() => onUpdateJobStatus(job.id, 'rejected')}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer"
                                title="Reject Post"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteJob(job.id)}
                              className="bg-slate-700 hover:bg-red-900 text-slate-300 hover:text-white p-1 rounded transition cursor-pointer"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL CREATE JOB FORM */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-bold text-amber-300 border-b border-slate-700 pb-2">
              Add New Job Notification Post
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. UPSC Combined Defence Services CDS I 2026 Online Form"
                  className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Title (For Grid Card)</label>
                <input
                  type="text"
                  value={formData.shortTitle}
                  onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                  placeholder="e.g. UPSC CDS 1 2026 Form (457 Posts)"
                  className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as JobCategory })}
                  className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
                >
                  <option value="Latest Jobs">Latest Jobs</option>
                  <option value="Result">Result</option>
                  <option value="Admit Card">Admit Card</option>
                  <option value="Answer Key">Answer Key</option>
                  <option value="Syllabus">Syllabus</option>
                  <option value="Admission">Admission</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">State / Region *</label>
                <select
                  value={formData.state || 'All India'}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
                >
                  <option value="All India">🇮🇳 All India</option>
                  <option value="UP">🔴 UP (Uttar Pradesh)</option>
                  <option value="Bihar">🟡 Bihar</option>
                  <option value="Rajasthan">🟠 Rajasthan</option>
                  <option value="MP">🟢 MP (Madhya Pradesh)</option>
                  <option value="Delhi">🔵 Delhi</option>
                  <option value="Punjab">🌾 Punjab</option>
                  <option value="Haryana">🚜 Haryana</option>
                  <option value="Uttarakhand">🏔️ Uttarakhand</option>
                  <option value="Odisha">🌊 Odisha</option>
                  <option value="Maharashtra">🦁 Maharashtra</option>
                  <option value="Assam">🦏 Assam</option>
                  <option value="Jharkhand">⛏️ Jharkhand</option>
                  <option value="West Bengal">🐯 West Bengal</option>
                  <option value="Tamil Nadu">🛕 Tamil Nadu</option>
                  <option value="Andhra Pradesh">☀️ Andhra Pradesh</option>
                  <option value="Jammu & Kashmir">❄️ Jammu & Kashmir</option>
                  <option value="Karnataka">🏰 Karnataka</option>
                  <option value="Kerala">🌴 Kerala</option>
                  <option value="Gujarat">🪁 Gujarat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Department / Commission</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Union Public Service Commission (UPSC)"
                  className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Total Posts</label>
                <input
                  type="text"
                  value={formData.totalPosts}
                  onChange={(e) => setFormData({ ...formData, totalPosts: e.target.value })}
                  placeholder="e.g. 457 Posts"
                  className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Last Date to Apply</label>
                <input
                  type="text"
                  value={formData.lastDate}
                  onChange={(e) => setFormData({ ...formData, lastDate: e.target.value })}
                  placeholder="e.g. 25 February 2026"
                  className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Short Information Summary</label>
              <textarea
                rows={3}
                value={formData.shortInfo}
                onChange={(e) => setFormData({ ...formData, shortInfo: e.target.value })}
                placeholder="Overview of the recruitment..."
                className="w-full bg-slate-900 text-white p-2 text-xs rounded border border-slate-700 focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-xs px-6 py-2.5 rounded shadow cursor-pointer"
              >
                Publish Job Post Immediately
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: AI FAST POST GENERATOR */}
        {activeTab === 'ai' && (
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="text-lg font-bold text-amber-300">
                Gemini AI Job Notification Auto-Generator
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Paste a job title, short exam notice, or newspaper snippet (e.g., "UP Police Constable Exam Result 2026 declared for 60000 posts"). Gemini AI will structure and generate complete fees, dates, eligibility, and links automatically!
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Notification Text / Prompt</label>
              <textarea
                rows={4}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., SSC CGL Tier 1 Answer Key 2026 released today on ssc.gov.in. Candidates can submit objections till 15th Feb..."
                className="w-full bg-slate-900 text-white p-3 text-xs rounded border border-slate-700 focus:border-amber-400"
              />
            </div>

            {aiError && (
              <div className="bg-red-950 border border-red-700 text-red-300 p-3 rounded text-xs">
                {aiError}
              </div>
            )}

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating || !aiPrompt.trim()}
              className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-black font-extrabold text-xs px-6 py-2.5 rounded shadow cursor-pointer flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Generating with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  Generate & Publish Post
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 4: LIVE MARQUEE TICKER MANAGEMENT */}
        {activeTab === 'marquee' && (
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-bold text-amber-300 border-b border-slate-700 pb-2">
              Manage Live Header Scrolling News Ticker
            </h3>

            {/* Add New Ticker Text */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMarqueeText}
                onChange={(e) => setNewMarqueeText(e.target.value)}
                placeholder="🔥 Latest Update: UPSC Civil Services Mains Admit Card Download Link..."
                className="flex-1 bg-slate-900 text-white text-xs p-2 rounded border border-slate-700 focus:border-amber-400"
              />
              <button
                onClick={handleAddMarquee}
                className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-xs px-4 py-2 rounded cursor-pointer shrink-0"
              >
                + Add Headline
              </button>
            </div>

            {/* List of Tickers */}
            <div className="space-y-2 pt-2">
              {marqueeItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 p-3 rounded border border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <span className={item.active ? 'text-amber-200 font-semibold' : 'text-slate-500 line-through'}>
                    {item.text}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleMarquee(item.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        item.active ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.active ? 'Active' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => handleDeleteMarquee(item.id)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PYTHON SCRAPER & INGESTION API */}
        {activeTab === 'scraper' && (
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg space-y-6">
            <div>
              <h3 className="text-lg font-bold text-amber-300 border-b border-slate-700 pb-2 flex items-center gap-2">
                🐍 State Portal Python Scraper & Live Backend Ingestion
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                This Python script automatically scrapes job alerts from official state government portals (e.g., UPPSC, BPSC, RSMSSB, MPESB), stores them locally in SQLite to prevent duplicates, and automatically posts new entries to your backend endpoint (<code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">POST /api/jobs</code>).
              </p>
            </div>

            {/* Ingestion API Endpoint Demo Box */}
            <div className="bg-slate-900 border border-slate-700 p-4 rounded text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-emerald-400 uppercase">
                  📡 Ingestion API Endpoint Ready:
                </span>
                <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-700 font-mono text-[10px]">
                  POST /api/jobs
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Any job posted to <code className="text-amber-200">/api/jobs</code> lands directly in your <strong>Pending Approval Queue</strong> for 1-click admin review!
              </p>
            </div>

            {/* Python Scraper Code Display */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-amber-300">
                  📜 Complete Production Python Scraper Script (state_scraper.py)
                </label>
                <button
                  onClick={() => {
                    const scriptText = `import requests
from bs4 import BeautifulSoup
import sqlite3
import time
import random
import json

# --- CONFIGURATION ---
STATE_TAG = "UP"  # Target State Tag e.g. UP, Bihar, Rajasthan, MP
API_ENDPOINT = "http://localhost:3000/api/jobs"  # Replace with production backend domain

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
]

def init_db():
    conn = sqlite3.connect("scraped_jobs.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT UNIQUE,
            state TEXT,
            pdf_link TEXT,
            scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    return conn

def is_duplicate(conn, title):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM jobs WHERE title = ?", (title,))
    return cursor.fetchone() is not None

def save_job_locally(conn, title, state, pdf_link):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO jobs (title, state, pdf_link) VALUES (?, ?, ?)", (title, state, pdf_link))
    conn.commit()

def post_to_backend(payload):
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(API_ENDPOINT, json=payload, headers=headers, timeout=10)
        if response.status_code in [200, 201]:
            print(f"[SUCCESS] Sent to Admin Approval Queue: {payload['title']}")
        else:
            print(f"[ERROR {response.status_code}] Failed payload: {response.text}")
    except Exception as e:
        print(f"[CONNECTION ERROR] Could not post to backend: {e}")

def scrape_state_jobs():
    conn = init_db()
    
    # Target URL (Example: UP Government Job Portal)
    target_url = "https://uppsc.up.nic.in"
    
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    print(f"[*] Fetching notifications from {target_url}...")
    
    try:
        response = requests.get(target_url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Parse job links (Adjust selectors as per state portal HTML structure)
        job_elements = soup.find_all("a", href=True)
        
        count = 0
        for elem in job_elements:
            title = elem.get_text(strip=True)
            link = elem["href"]
            
            if len(title) > 15 and ("Recruitment" in title or "Notice" in title or "Advt" in title or "Apply" in title):
                if is_duplicate(conn, title):
                    continue
                
                pdf_link = link if link.startswith("http") else f"{target_url}/{link}"
                
                payload = {
                    "title": title,
                    "officialLink": pdf_link,
                    "pdf_link": pdf_link,
                    "apply_link": target_url,
                    "state": STATE_TAG,
                    "category": "Latest Jobs",
                    "department": "State Public Service Commission",
                    "postedDate": time.strftime("%Y-%m-%d"), # Live dynamic date (YYYY-MM-DD)
                    "notification_date": time.strftime("%d/%m/%Y"),
                    "status": "pending"
                }
                
                save_job_locally(conn, title, STATE_TAG, pdf_link)
                post_to_backend(payload)
                count += 1
                
                time.sleep(2)  # 2-second rate-limiting delay
                
        print(f"[FINISHED] Processed {count} new state job notifications.")
    except Exception as e:
        print(f"[SCRAPE ERROR] {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    scrape_state_jobs()`;
                    navigator.clipboard.writeText(scriptText);
                    alert('Python Scraper script copied to clipboard!');
                  }}
                  className="bg-amber-400 text-black hover:bg-amber-500 font-bold px-3 py-1 rounded text-xs cursor-pointer"
                >
                  📋 Copy Python Code
                </button>
              </div>

              <pre className="bg-slate-900 border border-slate-700 p-4 rounded text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-72">
{`import requests
from bs4 import BeautifulSoup
import sqlite3
import time
import random

STATE_TAG = "UP"  # Options: UP, Bihar, Rajasthan, MP, Delhi
API_ENDPOINT = "http://localhost:3000/api/jobs"

def init_db():
    conn = sqlite3.connect("scraped_jobs.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT UNIQUE,
            state TEXT,
            pdf_link TEXT,
            scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    return conn

def scrape_and_ingest():
    conn = init_db()
    # Scrapes state portal -> Checks SQLite duplicate -> POSTs to /api/jobs -> Land in Pending Approval Queue
    ...`}
              </pre>
            </div>

            {/* Linux Cron Setup Box */}
            <div className="bg-slate-900 border border-slate-700 p-4 rounded text-xs space-y-3">
              <h4 className="font-extrabold text-amber-300">
                ⏰ Hosting Instructions: Run Automatically on Linux Server via Cron Job
              </h4>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Install dependencies on Linux: <code className="text-amber-200">pip install requests beautifulsoup4</code></li>
                <li>Save the script as <code className="text-amber-200">state_scraper.py</code>.</li>
                <li>Open crontab: <code className="text-amber-200">crontab -e</code></li>
                <li>Add this line to run automatically every hour:</li>
              </ol>
              <div className="bg-black text-amber-400 p-2.5 rounded font-mono text-xs">
                0 * * * * /usr/bin/python3 /path/to/state_scraper.py &gt;&gt; /var/log/scraper.log 2&gt;&amp;1
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
