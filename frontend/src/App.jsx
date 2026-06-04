import { useState, useEffect, useCallback } from 'react';
import * as api from './api/client';

import Sidebar        from './components/Sidebar';
import AddJobModal    from './components/AddJobModal';
import JobDetailModal from './components/JobDetailModal';

import DashboardPage  from './pages/DashboardPage';
import PipelinePage   from './pages/PipelinePage';
import AnalyticsPage  from './pages/AnalyticsPage';
import ResumePage     from './pages/ResumePage';
import SettingsPage   from './pages/SettingsPage';
import TnPPage        from './pages/TnPPage';         // ← NEW

import './App.css';

export default function App() {
  const [page,        setPage]        = useState('dashboard');
  const [jobs,        setJobs]        = useState([]);
  const [stats,       setStats]       = useState(null);
  const [tnpNewCount, setTnpNewCount] = useState(0);   // ← NEW: badge count
  const [loading,     setLoading]     = useState(true);
  const [showAdd,     setShowAdd]     = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [scoringJobs, setScoringJobs] = useState(new Set());
  const [toast,       setToast]       = useState(null);

  const [activeResumeTag, setActiveResumeTagState] = useState(
    () => localStorage.getItem('ajtActiveResume') || 'full-stack'
  );
  const setActiveResumeTag = (tag) => {
    setActiveResumeTagState(tag);
    localStorage.setItem('ajtActiveResume', tag);
  };

  /* ── Toast ──────────────────────────────────────────────────────── */
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, []);

  /* ── Load jobs + TnP badge count ────────────────────────────────── */
  const loadData = useCallback(async () => {
    try {
      const [jRes, sRes, tnpRes] = await Promise.all([
        api.fetchJobs(),
        api.fetchPipeline(),
        api.fetchTnPStats(),                            // ← NEW
      ]);
      setJobs(jRes.data);
      setStats(sRes.data);
      setTnpNewCount(tnpRes.data?.new || 0);            // ← NEW
    } catch {
      showToast('Cannot reach backend — is it running on port 5000?', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleParse = async (jdText) => {
    try {
      await api.parseJobWithAI(jdText);
      await loadData();
      showToast('Job parsed and added to your pipeline!');
      return true;
    } catch { return false; }
  };

  const handleScore = async (jobId, resumeTag) => {
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
    try {
      await api.updateJob(jobId, { status });
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status } : j));
      const sRes = await api.fetchPipeline();
      setStats(sRes.data);
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleUpdate = async (jobId, data) => {
    try {
      const res = await api.updateJob(jobId, data);
      setJobs(prev => prev.map(j => j._id === jobId ? res.data : j));
      setSelected(res.data);
      if (data.status) { const sRes = await api.fetchPipeline(); setStats(sRes.data); }
      showToast('Job updated');
    } catch { showToast('Failed to update job', 'error'); }
  };

  const handleDelete = async (jobId) => {
    try {
      await api.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j._id !== jobId));
      setSelected(null);
      const sRes = await api.fetchPipeline();
      setStats(sRes.data);
      showToast('Job deleted');
    } catch { showToast('Failed to delete job', 'error'); }
  };

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="app-shell">
      <Sidebar
        activePage={page}
        onNav={(p) => { setPage(p); if (p === 'tnp') loadData(); }}
        onNewJob={() => setShowAdd(true)}
        stats={stats}
        activeResumeTag={activeResumeTag}
        tnpNewCount={tnpNewCount}                       // ← NEW
      />

      <main className="app-main">
        {loading ? (
          <div className="app-loading"><div className="app-loader"/><p>Connecting to backend…</p></div>
        ) : (
          <>
            {page === 'dashboard'  && <DashboardPage  jobs={jobs} stats={stats} loading={loading} onSelectJob={setSelected} onNav={setPage} onNewJob={() => setShowAdd(true)} />}
            {page === 'pipeline'   && <PipelinePage   jobs={jobs} scoringJobs={scoringJobs} onScore={handleScore} onStatusChange={handleStatusChange} onSelect={setSelected} onDelete={handleDelete} />}
            {page === 'analytics'  && <AnalyticsPage  jobs={jobs} stats={stats} />}
            {page === 'resume'     && <ResumePage     showToast={showToast} activeResumeTag={activeResumeTag} onActiveChange={setActiveResumeTag} />}
            {page === 'settings'   && <SettingsPage   showToast={showToast} />}
            {page === 'tnp'        && <TnPPage        showToast={showToast} onJobsChange={loadData} />}  {/* ← NEW */}
          </>
        )}
      </main>

      {showAdd   && <AddJobModal    onClose={() => setShowAdd(false)} onParse={handleParse} />}
      {selected  && <JobDetailModal job={selected} isScoring={scoringJobs.has(selected._id)} activeResumeTag={activeResumeTag} onClose={() => setSelected(null)} onScore={handleScore} onUpdate={handleUpdate} onDelete={handleDelete} />}

      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast--err' : 'toast--ok'}`}>
          {toast.type === 'error' ? '⚠ ' : '✓ '}{toast.msg}
        </div>
      )}
    </div>
  );
}
