import { useState, useEffect, useCallback } from 'react';
import * as api from './api/client';
import {
  DEMO_JOBS, DEMO_STATS, DEMO_TNP_STATS,
  DEMO_TNP_OPPORTUNITIES, DEMO_RESUMES,
} from './demo/demoData';

import Sidebar        from './components/Sidebar';
import AddJobModal    from './components/AddJobModal';
import JobDetailModal from './components/JobDetailModal';

import DashboardPage  from './pages/DashboardPage';
import PipelinePage   from './pages/PipelinePage';
import AnalyticsPage  from './pages/AnalyticsPage';
import ResumePage     from './pages/ResumePage';
import SettingsPage   from './pages/SettingsPage';
import TnPPage        from './pages/TnPPage';

import './App.css';

/* ── Mobile bottom-nav definition ──────────────────────────────────────────── */
const MOBILE_NAV = [
  {
    key: 'dashboard', label: 'Overview',
    icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="12" y="2" width="6" height="6" rx="1"/><rect x="2" y="12" width="6" height="6" rx="1"/><rect x="12" y="12" width="6" height="6" rx="1"/></svg>,
  },
  {
    key: 'pipeline', label: 'Pipeline',
    icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><rect x="2" y="3" width="3.5" height="14" rx="1"/><rect x="8.25" y="3" width="3.5" height="14" rx="1"/><rect x="14.5" y="3" width="3.5" height="14" rx="1"/></svg>,
  },
  {
    key: 'analytics', label: 'Analytics',
    icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><polyline points="2 15 6 9 10 12 14 5 18 8"/><line x1="2" y1="18" x2="18" y2="18"/></svg>,
  },
  {
    key: 'tnp', label: 'T&P',
    icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><path d="M3 4h14v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4z"/><path d="M3 4l7 6 7-6"/></svg>,
  },
  {
    key: 'settings', label: 'Settings',
    icon: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18"><circle cx="10" cy="10" r="2.5"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.2 3.2l1.4 1.4M15.4 15.4l1.4 1.4M16.8 3.2l-1.4 1.4M4.6 15.4l-1.4 1.4"/></svg>,
  },
];

export default function App() {
  const [page,        setPage]        = useState('dashboard');
  const [jobs,        setJobs]        = useState([]);
  const [stats,       setStats]       = useState(null);
  const [tnpNewCount, setTnpNewCount] = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [showAdd,     setShowAdd]     = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [scoringJobs, setScoringJobs] = useState(new Set());
  const [toast,       setToast]       = useState(null);

  // Demo mode — persisted in localStorage
  const [isDemo, setIsDemo] = useState(
    () => localStorage.getItem('ajtDemoMode') === 'true'
  );
  // Mobile sidebar open/closed
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeResumeTag, setActiveResumeTagState] = useState(
    () => localStorage.getItem('ajtActiveResume') || 'full-stack'
  );
  const setActiveResumeTag = (tag) => {
    setActiveResumeTagState(tag);
    localStorage.setItem('ajtActiveResume', tag);
  };

  const toggleDemo = () => {
    setIsDemo(prev => {
      const next = !prev;
      localStorage.setItem('ajtDemoMode', String(next));
      return next;
    });
  };

  /* ── Toast ──────────────────────────────────────────────────────────────── */
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, []);

  const demoBlocked = () =>
    showToast('Demo mode — data is read-only 🎭', 'error');

  /* ── Data loading ───────────────────────────────────────────────────────── */
  const loadData = useCallback(async () => {
    if (isDemo) {
      setJobs(DEMO_JOBS);
      setStats(DEMO_STATS);
      setTnpNewCount(DEMO_TNP_STATS.new);
      setLoading(false);
      return;
    }
    try {
      const [jRes, sRes, tnpRes] = await Promise.all([
        api.fetchJobs(),
        api.fetchPipeline(),
        api.fetchTnPStats(),
      ]);
      setJobs(jRes.data);
      setStats(sRes.data);
      setTnpNewCount(tnpRes.data?.new || 0);
    } catch {
      showToast('Cannot reach backend — is it running on port 5000?', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, isDemo]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const handleParse = async (jdText) => {
    if (isDemo) { demoBlocked(); return false; }
    try {
      await api.parseJobWithAI(jdText);
      await loadData();
      showToast('Job parsed and added to your pipeline!');
      return true;
    } catch { return false; }
  };

  const handleScore = async (jobId, resumeTag) => {
    if (isDemo) { demoBlocked(); return; }
    const tag = resumeTag || activeResumeTag;
    setScoringJobs(prev => new Set([...prev, jobId]));
    try {
      await api.scoreJobWithAI(jobId, tag);
      const [jRes, sRes] = await Promise.all([api.fetchJobs(), api.fetchPipeline()]);
      setJobs(jRes.data);
      setStats(sRes.data);
      if (selected?._id === jobId) setSelected(jRes.data.find(j => j._id === jobId));
      showToast(`Scored with "${tag}" resume!`);
    } catch {
      showToast('Scoring failed — check n8n is running on port 5678', 'error');
    } finally {
      setScoringJobs(prev => { const n = new Set(prev); n.delete(jobId); return n; });
    }
  };

  const handleStatusChange = async (jobId, status) => {
    if (isDemo) { demoBlocked(); return; }
    try {
      await api.updateJob(jobId, { status });
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status } : j));
      const sRes = await api.fetchPipeline();
      setStats(sRes.data);
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleUpdate = async (jobId, data) => {
    if (isDemo) { demoBlocked(); return; }
    try {
      const res = await api.updateJob(jobId, data);
      setJobs(prev => prev.map(j => j._id === jobId ? res.data : j));
      setSelected(res.data);
      if (data.status) { const sRes = await api.fetchPipeline(); setStats(sRes.data); }
      showToast('Job updated');
    } catch { showToast('Failed to update job', 'error'); }
  };

  const handleDelete = async (jobId) => {
    if (isDemo) { demoBlocked(); return; }
    try {
      await api.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      setSelected(null);
      const sRes = await api.fetchPipeline();
      setStats(sRes.data);
      showToast('Job deleted');
    } catch { showToast('Failed to delete job', 'error'); }
  };

  /* ── Nav helper ─────────────────────────────────────────────────────────── */
  const navigate = (p) => {
    setPage(p);
    if (p === 'tnp') loadData();
    setSidebarOpen(false);
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="app-shell">

      {/* ── Mobile: sidebar overlay backdrop ─────────────────────────────── */}
      {sidebarOpen && (
        <div className="sb-mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Mobile: fixed top bar ─────────────────────────────────────────── */}
      <div className="mobile-topbar">
        <button
          className="mobile-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="2" y1="5"  x2="18" y2="5"/>
            <line x1="2" y1="10" x2="18" y2="10"/>
            <line x1="2" y1="15" x2="18" y2="15"/>
          </svg>
        </button>

        <div className="mobile-topbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00c9a7" strokeWidth="1.5" width="18" height="18">
            <polygon points="12 2 22 7 22 17 12 22 2 17 2 7"/>
          </svg>
          <span>JobTracker</span>
        </div>

        {isDemo && <span className="mobile-demo-pill">DEMO</span>}

        <button className="mobile-parse-btn" onClick={() => setShowAdd(true)}>
          + Parse JD
        </button>
      </div>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <Sidebar
        activePage={page}
        onNav={navigate}
        onNewJob={() => { setShowAdd(true); setSidebarOpen(false); }}
        stats={stats}
        activeResumeTag={activeResumeTag}
        tnpNewCount={tnpNewCount}
        isDemo={isDemo}
        onToggleDemo={toggleDemo}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="app-main">

        {/* Demo banner */}
        {isDemo && (
          <div className="demo-banner">
            <span className="demo-banner-icon">🎭</span>
            <span>
              <strong>Demo Mode</strong> — You&apos;re viewing sample data.
              Your real applications are hidden.
            </span>
            <button className="demo-banner-exit" onClick={toggleDemo}>
              Exit Demo
            </button>
          </div>
        )}

        {loading ? (
          <div className="app-loading">
            <div className="app-loader"/>
            <p>Connecting to backend…</p>
          </div>
        ) : (
          <>
            {page === 'dashboard'  && (
              <DashboardPage
                jobs={jobs} stats={stats} loading={loading}
                onSelectJob={setSelected} onNav={setPage}
                onNewJob={() => setShowAdd(true)}
              />
            )}
            {page === 'pipeline'   && (
              <PipelinePage
                jobs={jobs} scoringJobs={scoringJobs}
                onScore={handleScore} onStatusChange={handleStatusChange}
                onSelect={setSelected} onDelete={handleDelete}
              />
            )}
            {page === 'analytics'  && (
              <AnalyticsPage jobs={jobs} stats={stats} />
            )}
            {page === 'resume'     && (
              <ResumePage
                showToast={showToast}
                activeResumeTag={activeResumeTag}
                onActiveChange={setActiveResumeTag}
                isDemo={isDemo}
                demoResumes={DEMO_RESUMES}
              />
            )}
            {page === 'settings'   && (
              <SettingsPage showToast={showToast} />
            )}
            {page === 'tnp'        && (
              <TnPPage
                showToast={showToast}
                onJobsChange={loadData}
                isDemo={isDemo}
                demoOpportunities={DEMO_TNP_OPPORTUNITIES}
                demoStats={DEMO_TNP_STATS}
              />
            )}
          </>
        )}
      </main>

      {/* ── Mobile: bottom navigation bar ────────────────────────────────── */}
      <nav className="mobile-bottom-nav">
        {MOBILE_NAV.map(item => (
          <button
            key={item.key}
            className={`mobile-bn-item${page === item.key ? ' mobile-bn-item--on' : ''}`}
            onClick={() => navigate(item.key)}
          >
            <span className="mobile-bn-icon">{item.icon}</span>
            <span className="mobile-bn-label">{item.label}</span>
            {item.key === 'tnp' && tnpNewCount > 0 && (
              <span className="mobile-bn-badge">{tnpNewCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {showAdd  && (
        <AddJobModal onClose={() => setShowAdd(false)} onParse={handleParse} />
      )}
      {selected && (
        <JobDetailModal
          job={selected}
          isScoring={scoringJobs.has(selected._id)}
          activeResumeTag={activeResumeTag}
          onClose={() => setSelected(null)}
          onScore={handleScore}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast--err' : 'toast--ok'}`}>
          {toast.type === 'error' ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}
    </div>
  );
}
