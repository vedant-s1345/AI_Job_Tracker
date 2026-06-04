import { useState, useEffect } from 'react';
import * as api from '../api/client';

const ALL    = ['saved','applied','interviewing','offered','rejected'];
const SCOL   = { saved:'#6366f1', applied:'#3b82f6', interviewing:'#a855f7', offered:'#22c55e', rejected:'#ef4444' };
const sc     = s => s >= 70 ? '#22c55e' : s >= 40 ? '#f5a623' : '#ef4444';
const sv     = s => s >= 70 ? 'Strong fit' : s >= 40 ? 'Partial fit' : 'Weak fit';

function ScoreArc({ score }) {
  if (score === null || score === undefined) return (
    <div className="arc-none"><span>—</span><small>unscored</small></div>
  );
  const color = sc(score), r = 30, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" aria-label={`Match score: ${score}%`}>
      <circle cx="40" cy="40" r={r} fill="none" stroke="#1c2438" strokeWidth="6"/>
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        style={{ transition: 'stroke-dasharray .6s ease' }}
      />
      <text x="40" y="45" textAnchor="middle" fill={color}
        style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:13, fontWeight:600 }}>
        {score}%
      </text>
    </svg>
  );
}

export default function JobDetailModal({ job, isScoring, activeResumeTag, onClose, onScore, onUpdate, onDelete }) {
  const [notes,       setNotes]       = useState(job.notes || '');
  const [status,      setStatus]      = useState(job.status);
  const [applied,     setApplied]     = useState(job.applied_on ? job.applied_on.slice(0,10) : '');
  const [saving,      setSaving]      = useState(false);
  const [showJD,      setShowJD]      = useState(false);
  const [cdel,        setCdel]        = useState(false);
  const [resumes,     setResumes]     = useState([]);
  const [scoreTag,    setScoreTag]    = useState(activeResumeTag || 'full-stack');

  /* Sync job changes (e.g. after scoring) */
  useEffect(() => {
    setNotes(job.notes || '');
    setStatus(job.status);
    setApplied(job.applied_on ? job.applied_on.slice(0,10) : '');
  }, [job]);

  /* Load all available resumes for the tag dropdown */
  useEffect(() => {
    api.fetchAllResumes()
      .then(r => { setResumes(r.data); })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await onUpdate(job._id, { notes, status, applied_on: applied || null });
    setSaving(false);
  };

  return (
    <div className="ovl" onClick={onClose}>
      <div className="modal modal--detail" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-hd">
          <div style={{ flex:1, minWidth:0 }}>
            <p className="modal-eyebrow" style={{ color: SCOL[job.status] }}>
              {job.company} · <span style={{ textTransform:'capitalize' }}>{job.source}</span>
            </p>
            <h2 className="modal-title" style={{ fontSize:19 }}>{job.title}</h2>
            {job.location && job.location !== 'Not specified' &&
              <p className="modal-sub">⌖ {job.location}</p>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body modal-body--detail">

          {/* ── Score section ── */}
          <div className="det-score-box">
            <div className="det-score-left">
              <ScoreArc score={job.match_score} />
              {job.match_score !== null && job.match_score !== undefined && (
                <div className="det-score-text">
                  <span style={{ color: sc(job.match_score), fontFamily:"'IBM Plex Mono',monospace", fontSize:12 }}>
                    {sv(job.match_score)}
                  </span>
                  <span style={{ fontSize:11, color:'#6b7a96' }}>resume match</span>
                </div>
              )}
            </div>

            {/* Score controls — tag picker + button */}
            <div className="det-score-ctrl">
              <div className="det-score-tag-wrap">
                <label className="det-score-tag-lbl">Score with</label>
                <select
                  className="det-score-tag-sel"
                  value={scoreTag}
                  onChange={e => setScoreTag(e.target.value)}
                >
                  {resumes.length > 0
                    ? resumes.map(r => (
                        <option key={r._id} value={r.tag}>{r.tag}</option>
                      ))
                    : <option value={scoreTag}>{scoreTag}</option>}
                </select>
              </div>
              <button
                className={`btn-score-ai${isScoring ? ' btn-score-ai--busy' : ''}`}
                onClick={() => onScore(job._id, scoreTag)}
                disabled={isScoring}
              >
                {isScoring ? '⟳ Scoring…' : '⬡ Score Resume'}
              </button>
            </div>
          </div>

          {/* ── Skills ── */}
          {(job.matched_skills?.length > 0 || job.gap_skills?.length > 0) && (
            <div className="det-skills">
              {job.matched_skills?.length > 0 && (
                <div>
                  <p className="det-label" style={{ color:'#22c55e' }}>✓ Matched</p>
                  <div className="det-pills">
                    {job.matched_skills.map(s => <span key={s} className="pill pill--match">{s}</span>)}
                  </div>
                </div>
              )}
              {job.gap_skills?.length > 0 && (
                <div>
                  <p className="det-label" style={{ color:'#ef4444' }}>✕ Gaps</p>
                  <div className="det-pills">
                    {job.gap_skills.map(s => <span key={s} className="pill pill--gap">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Status ── */}
          <div>
            <p className="det-label">Status</p>
            <div className="det-status-row">
              {ALL.map(s => (
                <button key={s}
                  className={`status-pill${status===s?' status-pill--on':''}`}
                  style={status===s?{ color:SCOL[s], background:SCOL[s]+'22', borderColor:SCOL[s] }:{}}
                  onClick={() => setStatus(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ── Applied date ── */}
          <div>
            <p className="det-label">Applied On</p>
            <input type="date" className="det-input" value={applied} onChange={e => setApplied(e.target.value)} />
          </div>

          {/* ── Tags ── */}
          {job.tags?.length > 0 && (
            <div>
              <p className="det-label">Tags</p>
              <div className="det-pills">
                {job.tags.map(t => <span key={t} className="pill">{t}</span>)}
              </div>
            </div>
          )}

          {/* ── Notes ── */}
          <div>
            <p className="det-label">Notes</p>
            <textarea className="det-ta" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Interview prep, contacts, next steps…" rows={4}/>
          </div>

          {/* ── JD toggle ── */}
          <div>
            <p className="det-label">
              Job Description
              <button className="det-toggle" onClick={() => setShowJD(!showJD)}>
                {showJD ? 'hide' : 'show'}
              </button>
            </p>
            {showJD && <pre className="det-jd">{job.jd_text}</pre>}
          </div>

          <div className="det-meta">
            <span>Added <code>{new Date(job.createdAt).toLocaleDateString()}</code></span>
            <span>Updated <code>{new Date(job.updatedAt).toLocaleDateString()}</code></span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-ft">
          {cdel ? (
            <>
              <p style={{ fontSize:12, color:'#ef4444', fontFamily:"'IBM Plex Mono',monospace", marginRight:'auto' }}>
                Permanently delete this job?
              </p>
              <button className="btn-ghost" onClick={() => setCdel(false)}>Cancel</button>
              <button className="btn-danger" onClick={() => onDelete(job._id)}>Delete</button>
            </>
          ) : (
            <>
              <button className="btn-del-ghost" onClick={() => setCdel(true)}>Delete Job</button>
              <span style={{ flex:1 }}/>
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : '💾 Save'}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
