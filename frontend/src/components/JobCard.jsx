import { useState } from 'react';

const ALL = ['saved','applied','interviewing','offered','rejected'];
const sc  = s => s >= 70 ? '#22c55e' : s >= 40 ? '#f5a623' : '#ef4444';

export default function JobCard({ job, colColor, isScoring, onScore, onSelect, onDelete, onStatusChange }) {
  const [cdel, setCdel] = useState(false);
  const ini = (job.company || '??').slice(0, 2).toUpperCase();
  const s   = job.match_score;

  return (
    <div className="jcard" style={{ '--cc': colColor }} onClick={onSelect}>
      {/* Header row */}
      <div className="jcard-hd">
        <div className="jcard-avi" style={{ background: `${colColor}20`, border: `1px solid ${colColor}35`, color: colColor }}>
          {ini}
        </div>
        <div className="jcard-meta">
          <p className="jcard-title">{job.title}</p>
          <p className="jcard-co">{job.company}</p>
        </div>
        {s !== null && s !== undefined
          ? <span className="jcard-score" style={{ color: sc(s), borderColor: sc(s) + '50' }}>{s}%</span>
          : <span className="jcard-score jcard-score--none">—</span>}
      </div>

      {/* Location */}
      {job.location && job.location !== 'Not specified' && (
        <p className="jcard-loc">⌖ {job.location}</p>
      )}

      {/* Score bar */}
      {s !== null && s !== undefined && (
        <div className="jcard-bar">
          <div className="jcard-barfill" style={{ width: `${s}%`, background: sc(s) }} />
        </div>
      )}

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="jcard-tags">
          {job.tags.slice(0, 3).map(t => <span key={t} className="jcard-tag">{t}</span>)}
          {job.tags.length > 3 && <span className="jcard-tag jcard-tag--more">+{job.tags.length - 3}</span>}
        </div>
      )}

      {/* Actions */}
      <div className="jcard-acts" onClick={e => e.stopPropagation()}>
        {cdel ? (
          <>
            <span className="jcard-delq">Delete?</span>
            <button className="jbtn jbtn--yes" onClick={onDelete}>Yes</button>
            <button className="jbtn" onClick={() => setCdel(false)}>No</button>
          </>
        ) : (
          <>
            <button className={`jbtn jbtn--score${isScoring ? ' scoring' : ''}`} onClick={onScore} disabled={isScoring}>
              {isScoring ? '⟳ Scoring' : '⬡ Score'}
            </button>
            <select className="jbtn jbtn--sel" value={job.status} onChange={e => onStatusChange(e.target.value)}>
              {ALL.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="jbtn jbtn--del" onClick={() => setCdel(true)}>×</button>
          </>
        )}
      </div>
    </div>
  );
}
