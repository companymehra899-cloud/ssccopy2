import React, { useState, useEffect } from 'react';
import { JobPost, JobCategory, JobStatus, MarqueeUpdate } from './types';
import {
  getStoredJobs,
  saveStoredJobs,
  getStoredMarquee,
  saveStoredMarquee,
} from './utils/helpers';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { QuickLinks } from './components/QuickLinks';
import { PortalGrid } from './components/PortalGrid';
import { JobDetails } from './components/JobDetails';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { ToolsModal } from './components/ToolsModal';
import { Footer } from './components/Footer';

export default function App() {
  const [jobs, setJobs] = useState<JobPost[]>(getStoredJobs);
  const [marqueeItems, setMarqueeItems] = useState<MarqueeUpdate[]>(getStoredMarquee);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | 'All'>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Check URL path/hash on load & verify existing token
  useEffect(() => {
    const isUrlAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';
    if (isUrlAdmin) {
      setIsAdminOpen(true);
    }

    const savedToken = localStorage.getItem('sarkari_admin_token') || sessionStorage.getItem('sarkari_admin_token');
    if (savedToken) {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: savedToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setIsAdminAuthenticated(true);
            setAdminToken(savedToken);
          } else {
            localStorage.removeItem('sarkari_admin_token');
            sessionStorage.removeItem('sarkari_admin_token');
            setIsAdminAuthenticated(false);
            setAdminToken(null);
          }
        })
        .catch(() => {
          // If server fails or offline, fallback token check
          setIsAdminAuthenticated(false);
        });
    }

    const handlePopState = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Shortcut: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleToggleAdmin(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update browser URL history when opening/closing Admin Panel
  const handleToggleAdmin = (openState?: boolean) => {
    const nextState = openState !== undefined ? openState : !isAdminOpen;
    setIsAdminOpen(nextState);

    if (nextState) {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        window.history.pushState({}, '', '/');
      }
    }
  };

  // Logout handler
  const handleAdminLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: adminToken }),
        });
      } catch (e) {
        console.warn('Logout API warning:', e);
      }
    }
    localStorage.removeItem('sarkari_admin_token');
    sessionStorage.removeItem('sarkari_admin_token');
    setIsAdminAuthenticated(false);
    setAdminToken(null);
  };

  // Fetch real-time jobs from backend API on mount
  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API fetch error');
      })
      .then((apiJobs) => {
        if (Array.isArray(apiJobs)) {
          setJobs(apiJobs);
        }
      })
      .catch((err) => {
        console.warn('API fetch warning:', err);
      });
  }, []);

  // Sync to localStorage on state change
  useEffect(() => {
    saveStoredJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    saveStoredMarquee(marqueeItems);
  }, [marqueeItems]);

  // Job Operations
  const handleUpdateJobStatus = (id: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status } : job))
    );
  };

  const handleBulkUpdateStatus = (ids: string[], status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) => (ids.includes(job.id) ? { ...job, status } : job))
    );
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('Are you sure you want to delete this job post permanently?')) {
      setJobs((prev) => prev.filter((job) => job.id !== id));
      if (selectedJob?.id === id) {
        setSelectedJob(null);
      }
    }
  };

  const handleAddJob = (newJob: JobPost) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleUpdateMarquee = (items: MarqueeUpdate[]) => {
    setMarqueeItems(items);
  };

  const pendingCount = jobs.filter((j) => j.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans flex flex-col justify-between">
      <div>
        {/* Main Header */}
        <Header
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            if (selectedJob) setSelectedJob(null);
          }}
          selectedCategory={selectedCategory}
          onCategorySelect={(cat) => {
            setSelectedCategory(cat);
            if (selectedJob) setSelectedJob(null);
          }}
          isAdminOpen={isAdminOpen}
          isAdminAuthenticated={isAdminAuthenticated}
          onToggleAdmin={() => handleToggleAdmin()}
          onOpenTools={() => setIsToolsOpen(true)}
          pendingCount={pendingCount}
        />

        {/* Marquee News Ticker */}
        <MarqueeTicker items={marqueeItems} />

        {/* Fast Search & State Shortcuts */}
        <QuickLinks
          selectedState={selectedState}
          onSelectState={(st) => {
            setSelectedState(st);
            if (selectedJob) setSelectedJob(null);
          }}
          onSearchTag={(tag) => {
            setSearchTerm(tag);
            setSelectedCategory('All');
            if (selectedJob) setSelectedJob(null);
          }}
        />

        {/* ADMIN WORKSPACE PROTECTED VIEW */}
        {isAdminOpen ? (
          isAdminAuthenticated ? (
            <AdminPanel
              jobs={jobs}
              onUpdateJobStatus={handleUpdateJobStatus}
              onBulkUpdateStatus={handleBulkUpdateStatus}
              onDeleteJob={handleDeleteJob}
              onAddJob={handleAddJob}
              marqueeItems={marqueeItems}
              onUpdateMarquee={handleUpdateMarquee}
              onClose={() => handleToggleAdmin(false)}
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={(token) => {
                setAdminToken(token);
                setIsAdminAuthenticated(true);
              }}
              onClose={() => handleToggleAdmin(false)}
            />
          )
        ) : selectedJob ? (
          /* JOB DETAILS VIEW */
          <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />
        ) : (
          /* PORTAL BOX GRID HOME VIEW */
          <PortalGrid
            jobs={jobs}
            onSelectJob={(job) => setSelectedJob(job)}
            selectedCategoryFilter={selectedCategory}
            selectedState={selectedState}
            searchTerm={searchTerm}
          />
        )}
      </div>

      {/* CANDIDATE UTILITY TOOLS MODAL */}
      <ToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />

      {/* FOOTER */}
      <Footer onOpenAdmin={() => handleToggleAdmin(true)} />
    </div>
  );
}
