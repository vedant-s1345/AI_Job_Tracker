import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../api/client';

/* ── Helpers ─────────────────────────────────────────────────────────── */
const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - Date.now()) / 86400000);
  if (days < 0)  return { label: 'Expired',        color: '#3a4d68', urgent: false };
  if (days === 0) return { label: 'Today!',         color: '#ef4444', urgent: true  };
  if (days <= 2)  return { label: `${days}d left`,  color: '#ef4444', urgent: true  };
  if (days <= 5)  return { label: `${days}d left`,  color: '#f5a623', urgent: false };
  return           { label: `${days}d left`,         color: '#22c55e', urgent: false };
};

const STATUS_META = {
  new:        { label: 'New',        color: '#00c9a7' },
  interested: { label: 'Interested', color: '#3b82f6' },
  applied:    { label: 'Applied',    color: '#22c55e' },
  ignored:    { label: 'Ignored',    color: '#3a4d68' },
};

/* ── Opportunity Card ────────────────────────────────────────────────── */
function OppCard({ opp, onStatus, onAddToPipeline, onSelect }) {
  const dl  = deadlineInfo(opp.deadline);
  const sm  = STATUS_META[opp.status];
  const ini = opp.company.slice(0, 2).toUpperCase();

  return (
    <div className={`opp-card${opp.status === 'ignored' ? ' opp-card--ignored' : ''}`}
      onClick={() => onSelect(opp)}>

      {/* Header */}
      <div className="opp-card-hd">
        <div className="opp-avi">{ini}</div>
        <div className="opp-hd-info">
          <p className="opp-company">{opp.company}</p>
          <p className="opp-role">{opp.role}</p>
        </div>
        <span className="opp-status-badge" style={{ color: sm.color, borderColor: sm.color + '50', background: sm.color + '15' }}>
          {sm.label}
        </span>
      </div>

      {/* Meta row */}
      <div className="opp-meta-row">
        {opp.location && opp.location !== 'Not specified' &&
          <span className="opp-meta-item">⌖ {opp.location}</span>}
        {opp.ctc &&
          <span className="opp-meta-item opp-meta-ctc">💰 {opp.ctc}</span>}
        {dl &&
          <span className="opp-meta-item opp-deadline"
            style={{ color: dl.color, background: dl.color + '15', borderColor: dl.color + '40' }}>
            {dl.urgent ? '⚠ ' : '⏰ '}{new Date(opp.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })} · {dl.label}
          </span>}
      </div>

      {/* Eligibility */}
      {opp.eligibility && (
        <p className="opp-eligibility">🎓 {opp.eligibility}</p>
      )}

      {/* Skills */}
      {opp.skills_required?.length > 0 && (
        <div className="opp-skills">
          {opp.skills_required.slice(0, 5).map(s => (
            <span key={s} className="opp-skill">{s}</span>
          ))}
          {opp.skills_required.length > 5 &&
            <span className="opp-skill opp-skill--more">+{opp.skills_required.length - 5}</span>}
        </div>
      )}

      {/* Summary */}
      {opp.summary && (
        <p className="opp-summary">{opp.summary}</p>
      )}

      {/* Actions */}
      <div className="opp-actions" onClick={e => e.stopPropagation()}>
        {opp.status !== 'applied' && (
          <button className="opp-btn opp-btn--add"
            onClick={() => onAddToPipeline(opp._id)}>
            + Add to Pipeline
          </button>
        )}
        {opp.status === 'applied' && opp.job_id && (
          <span className="opp-linked">✓ In Pipeline</span>
        )}
        {opp.status === 'new' && (
          <button className="opp-btn opp-btn--star"
            onClick={() => onStatus(opp._id, 'interested')}>
            ⭐ Interested
          </button>
        )}
        {opp.status === 'interested' && (
          <button className="opp-btn opp-btn--star opp-btn--star-on"
            onClick={() => onStatus(opp._id, 'new')}>
            ⭐ Interested
          </button>
        )}
        {opp.status !== 'ignored' && opp.status !== 'applied' && (
          <button className="opp-btn opp-btn--ignore"
            onClick={() => onStatus(opp._id, 'ignored')}>
            Ignore
          </button>
        )}
        {opp.status === 'ignored' && (
          <button className="opp-btn"
            onClick={() => onStatus(opp._id, 'new')}>
            Restore
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Opportunity Detail Modal ────────────────────────────────────────── */
function OppDetailModal({ opp, onClose, onStatus, onAddToPipeline }) {
  const dl = deadlineInfo(opp.deadline);
  const sm = STATUS_META[opp.status];

  return (
    <div className="ovl" onClick={onClose}>
      <div className="modal modal--detail" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="modal-eyebrow">T&P OPPORTUNITY · {opp.email_from}</p>
            <h2 className="modal-title" style={{ fontSize: 19 }}>{opp.role}</h2>
            <p className="modal-sub">{opp.company}{opp.location !== 'Not specified' ? ` · ${opp.location}` : ''}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body modal-body--detail">
          {/* Key details grid */}
          <div className="opp-detail-grid">
            {opp.ctc && (
              <div className="opp-detail-item">
                <span className="opp-di-lbl">Package</span>
                <span className="opp-di-val" style={{ color: '#22c55e' }}>{opp.ctc}</span>
              </div>
            )}
            {opp.deadline && (
              <div className="opp-detail-item">
                <span className="opp-di-lbl">Deadline</span>
                <span className="opp-di-val" style={{ color: dl?.color }}>
                  {new Date(opp.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  {dl && ` (${dl.label})`}
                </span>
              </div>
            )}
            {opp.eligibility && (
              <div className="opp-detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="opp-di-lbl">Eligibility</span>
                <span className="opp-di-val">{opp.eligibility}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {opp.skills_required?.length > 0 && (
            <div>
              <p className="det-label">Skills Required</p>
              <div className="det-pills">
                {opp.skills_required.map(s => <span key={s} className="pill">{s}</span>)}
              </div>
            </div>
          )}

          {/* Summary */}
          {opp.summary && (
            <div>
              <p className="det-label">Summary</p>
              <p style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65 }}>{opp.summary}</p>
            </div>
          )}

          {/* Email info */}
          <div>
            <p className="det-label">Original Email</p>
            <div className="opp-email-meta">
              <span><strong>Subject:</strong> {opp.email_subject}</span>
              <span><strong>Received:</strong> {opp.email_date ? new Date(opp.email_date).toLocaleString('en-IN') : '—'}</span>
            </div>
            {opp.email_body && (
              <pre className="opp-email-body">{opp.email_body.slice(0, 1500)}{opp.email_body.length > 1500 ? '\n…' : ''}</pre>
            )}
          </div>

          {/* Status */}
          <div>
            <p className="det-label">Status</p>
            <div className="det-status-row">
              {Object.entries(STATUS_META).map(([k, v]) => (
                <button key={k}
                  className={`status-pill${opp.status === k ? ' status-pill--on' : ''}`}
                  style={opp.status === k ? { color: v.color, background: v.color + '22', borderColor: v.color } : {}}
                  onClick={() => onStatus(opp._id, k)}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-ft">
          {opp.status !== 'applied' && (
            <button className="btn-primary" onClick={() => { onAddToPipeline(opp._id); onClose(); }}>
              + Add to Pipeline
            </button>
          )}
          {opp.status === 'applied' && (
            <span style={{ color: '#22c55e', fontFamily: 'var(--mono)', fontSize: 12 }}>✓ Already in pipeline</span>
          )}
          <span style={{ flex: 1 }} />
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function TnPPage({ showToast, onJobsChange }) {
  const [opps,       setOpps]       = useState([]);
  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');  // all|new|interested|applied|ignored
  const [search,     setSearch]     = useState('');
  const [selected,   setSelected]   = useState(null);
  const [addingId,   setAddingId]   = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [oppsRes, statsRes] = await Promise.all([
        api.fetchTnP(),
        api.fetchTnPStats(),
      ]);
      setOpps(oppsRes.data);
      setStats(statsRes.data);
    } catch {
      showToast('Failed to load TnP opportunities', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleStatus = async (id, status) => {
    try {
      const res = await api.updateTnP(id, { status });
      setOpps(prev => prev.map(o => o._id === id ? res.data : o));
      if (selected?._id === id) setSelected(res.data);
      const sr = await api.fetchTnPStats();
      setStats(sr.data);
    } catch { showToast('Failed to update', 'error'); }
  };

  const handleAddToPipeline = async (id) => {
    setAddingId(id);
    try {
      const res = await api.addTnPToPipeline(id);
      setOpps(prev => prev.map(o => o._id === id ? res.data.opportunity : o));
      if (selected?._id === id) setSelected(res.data.opportunity);
      const sr = await api.fetchTnPStats();
      setStats(sr.data);
      if (onJobsChange) onJobsChange();
      showToast(`"${res.data.job.title}" added to pipeline!`);
    } catch { showToast('Failed to add to pipeline', 'error'); }
    finally { setAddingId(null); }
  };

  const visible = useMemo(() => {
    let list = opps;
    if (filter !== 'all') list = list.filter(o => o.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.company.toLowerCase().includes(q) ||
        o.role.toLowerCase().includes(q));
    }
    return list;
  }, [opps, filter, search]);

  /* ── Urgency sort: deadline-soon first, then createdAt ── */
  const sorted = useMemo(() => [...visible].sort((a, b) => {
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  }), [visible]);

  const TAB_FILTERS = [
    { key: 'all',        label: 'All',        n: stats?.total },
    { key: 'new',        label: 'New',        n: stats?.new },
    { key: 'interested', label: 'Interested', n: stats?.interested },
    { key: 'applied',    label: 'Applied',    n: stats?.applied },
    { key: 'ignored',    label: 'Ignored',    n: stats?.ignored },
  ];

  return (
    <div className="page tnp-page">

      {/* Header */}
      <div className="page-hd">
        <div>
          <h1 className="page-title">T&P Opportunities</h1>
          <p className="page-sub">
            Auto-tracked from your college placement cell emails
            {stats?.deadlineSoon > 0 && (
              <span className="tnp-deadline-warn">
                {' '}· ⚠ {stats.deadlineSoon} deadline{stats.deadlineSoon > 1 ? 's' : ''} within 3 days
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="tnp-stats">
          {[
            { label: 'New',       n: stats.new,        color: '#00c9a7' },
            { label: 'Interested',n: stats.interested, color: '#3b82f6' },
            { label: 'Applied',   n: stats.applied,    color: '#22c55e' },
            { label: 'Due Soon',  n: stats.deadlineSoon, color: '#ef4444' },
            { label: 'Total',     n: stats.total,      color: '#7b8ba5' },
          ].map(s => (
            <div key={s.label} className="tnp-stat">
              <span className="tnp-stat-n" style={{ color: s.color }}>{s.n}</span>
              <span className="tnp-stat-l">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="tnp-filter-bar">
        <div className="tnp-tabs">
          {TAB_FILTERS.map(t => (
            <button key={t.key}
              className={`tnp-tab${filter === t.key ? ' tnp-tab--on' : ''}`}
              onClick={() => setFilter(t.key)}>
              {t.label}
              {t.n !== undefined && <span className="tnp-tab-n">{t.n}</span>}
            </button>
          ))}
        </div>
        <div className="filter-wrap" style={{ marginLeft: 'auto' }}>
          <svg className="filter-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" width="13" height="13">
            <circle cx="7" cy="7" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/>
          </svg>
          <input className="filter-inp" placeholder="Search company or role…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="loading-box">Loading opportunities…</div>
      ) : sorted.length === 0 ? (
        <div className="tnp-empty">
          <p className="tnp-empty-ico">📬</p>
          <h3>No opportunities yet</h3>
          {filter === 'all'
            ? <p>Once n8n starts monitoring your T&P emails, opportunities will appear here automatically.</p>
            : <p>No opportunities with this filter. <button className="inline-link" onClick={() => setFilter('all')}>View all →</button></p>}
        </div>
      ) : (
        <div className="opp-grid">
          {sorted.map(opp => (
            <OppCard
              key={opp._id}
              opp={opp}
              onStatus={handleStatus}
              onAddToPipeline={handleAddToPipeline}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <OppDetailModal
          opp={selected}
          onClose={() => setSelected(null)}
          onStatus={handleStatus}
          onAddToPipeline={handleAddToPipeline}
        />
      )}
    </div>
  );
}
