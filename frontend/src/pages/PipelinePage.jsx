import { useState } from 'react';
import JobCard from '../components/JobCard';

const COLS = [
  { key:'saved',        label:'Saved',        color:'#6366f1' },
  { key:'applied',      label:'Applied',      color:'#3b82f6' },
  { key:'interviewing', label:'Interviewing', color:'#a855f7' },
  { key:'offered',      label:'Offered',      color:'#22c55e' },
  { key:'rejected',     label:'Rejected',     color:'#ef4444' },
];

export default function PipelinePage({ jobs, scoringJobs, onScore, onStatusChange, onSelect, onDelete }) {
  const [search,      setSearch]      = useState('');
  const [filterSt,    setFilterSt]    = useState('');
  const [minScore,    setMinScore]    = useState('');

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    if (q && !j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q)) return false;
    if (filterSt && j.status !== filterSt) return false;
    if (minScore && (j.match_score === null || j.match_score < parseInt(minScore))) return false;
    return true;
  });

  return (
    <div className="page pipe-page">

      {/* Header */}
      <div className="page-hd">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-sub">{jobs.length} jobs across {COLS.length} stages</p>
        </div>

        {/* Filters */}
        <div className="pipe-filters">
          <div className="filter-wrap">
            <svg className="filter-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" width="13" height="13"><circle cx="7" cy="7" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>
            <input
              className="filter-inp"
              placeholder="Search title or company…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-sel" value={filterSt} onChange={e => setFilterSt(e.target.value)}>
            <option value="">All stages</option>
            {COLS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <input
            type="number" min={0} max={100}
            className="filter-inp filter-inp--sm"
            placeholder="Min score"
            value={minScore}
            onChange={e => setMinScore(e.target.value)}
          />
          {(search || filterSt || minScore) && (
            <button className="filter-clear" onClick={() => { setSearch(''); setFilterSt(''); setMinScore(''); }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="pipe-board">
        {COLS.map(col => {
          const colJobs = filtered.filter(j => j.status === col.key);
          return (
            <div key={col.key} className="pipe-col">
              <div className="pipe-col-hd" style={{ '--cc': col.color }}>
                <span className="pipe-pip" style={{ background:col.color, boxShadow:`0 0 6px ${col.color}80` }}/>
                <span className="pipe-lbl">{col.label}</span>
                <span className="pipe-cnt" style={{ background:col.color }}>{colJobs.length}</span>
              </div>
              <div className="pipe-col-body">
                {colJobs.length === 0
                  ? <p className="pipe-empty">Empty</p>
                  : colJobs.map(job => (
                    <JobCard
                      key={job._id}
                      job={job}
                      colColor={col.color}
                      isScoring={scoringJobs.has(job._id)}
                      onScore={e => { e?.stopPropagation?.(); onScore(job._id); }}
                      onSelect={() => onSelect(job)}
                      onDelete={() => onDelete(job._id)}
                      onStatusChange={s => onStatusChange(job._id, s)}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
