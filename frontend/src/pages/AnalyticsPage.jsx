import { useMemo } from 'react';

const sc = s => s >= 70 ? '#22c55e' : s >= 40 ? '#f5a623' : '#ef4444';

/* ── Score Distribution ─────────────────────────────────────────── */
function ScoreDistChart({ jobs }) {
  const scored = jobs.filter(j => j.match_score !== null);
  const buckets = [
    { label:'0–20',   min:0,  max:20,  color:'#ef4444' },
    { label:'21–40',  min:21, max:40,  color:'#f97316' },
    { label:'41–60',  min:41, max:60,  color:'#f5a623' },
    { label:'61–80',  min:61, max:80,  color:'#84cc16' },
    { label:'81–100', min:81, max:100, color:'#22c55e' },
  ].map(b => ({ ...b, count: scored.filter(j => j.match_score >= b.min && j.match_score <= b.max).length }));
  const maxN = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Score Distribution</h3>
      <p className="chart-sub">{scored.length} of {jobs.length} jobs scored</p>
      <div className="sdist">
        {buckets.map(b => (
          <div key={b.label} className="sdist-col">
            <div className="sdist-bar-wrap">
              <div className="sdist-bar" style={{ height:`${(b.count/maxN)*100}%`, background: b.color }}/>
            </div>
            <div className="sdist-n" style={{ color: b.color }}>{b.count}</div>
            <div className="sdist-lbl">{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Status Rings ───────────────────────────────────────────────── */
function StatusRings({ stats }) {
  const STATUS = [
    { key:'saved',        label:'Saved',        color:'#6366f1' },
    { key:'applied',      label:'Applied',      color:'#3b82f6' },
    { key:'interviewing', label:'Interviewing', color:'#a855f7' },
    { key:'offered',      label:'Offered',      color:'#22c55e' },
    { key:'rejected',     label:'Rejected',     color:'#ef4444' },
  ];
  const total = stats?.total || 0;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Pipeline Breakdown</h3>
      <p className="chart-sub">{total} total applications</p>
      <div className="rings-row">
        {STATUS.map(s => {
          const cnt  = stats?.[s.key] || 0;
          const pct  = total > 0 ? Math.round((cnt / total) * 100) : 0;
          const r    = 24, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
          return (
            <div key={s.key} className="ring-item">
              <svg width="64" height="64" viewBox="0 0 64 64" aria-label={`${s.label}: ${cnt}`}>
                <circle cx="32" cy="32" r={r} fill="none" stroke="#1c2438" strokeWidth="5.5"/>
                <circle cx="32" cy="32" r={r} fill="none" stroke={s.color}
                  strokeWidth="5.5" strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ-dash}`}
                  strokeDashoffset={circ/4}
                  style={{ transition:'stroke-dasharray .5s ease' }}
                />
                <text x="32" y="36" textAnchor="middle" fill={s.color}
                  style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, fontWeight:600 }}>
                  {cnt}
                </text>
              </svg>
              <div className="ring-lbl" style={{ color: s.color }}>{s.label}</div>
              <div className="ring-pct">{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Skill Gaps ─────────────────────────────────────────────────── */
function SkillGaps({ jobs }) {
  const gaps = useMemo(() => {
    const freq = {};
    jobs.forEach(j => (j.gap_skills||[]).forEach(s => { freq[s]=(freq[s]||0)+1; }));
    return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8);
  }, [jobs]);
  const maxN = gaps[0]?.[1] || 1;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Top Skill Gaps</h3>
      <p className="chart-sub">Skills most frequently missing across JDs</p>
      {gaps.length === 0 ? (
        <p className="chart-empty">Score some jobs to see skill gaps.</p>
      ) : (
        <div className="gc-list">
          {gaps.map(([skill, cnt], i) => (
            <div key={skill} className="gc-row">
              <span className="gc-rank">{i+1}</span>
              <span className="gc-skill">{skill}</span>
              <div className="gc-track">
                <div className="gc-fill" style={{ width:`${(cnt/maxN)*100}%` }}/>
              </div>
              <span className="gc-n">{cnt}×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Source Breakdown ───────────────────────────────────────────── */
function SourceBreakdown({ jobs }) {
  const COLORS = { webhook:'#00c9a7', linkedin:'#3b82f6', manual:'#a855f7', gmail:'#f5a623' };
  const data = useMemo(() => {
    const freq = {};
    jobs.forEach(j => { freq[j.source]=(freq[j.source]||0)+1; });
    return Object.entries(freq).sort((a,b)=>b[1]-a[1]);
  }, [jobs]);
  const total = jobs.length || 1;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Source Breakdown</h3>
      <p className="chart-sub">Where your jobs came from</p>
      <div className="src-list">
        {data.map(([src, cnt]) => (
          <div key={src} className="src-row">
            <span className="src-dot" style={{ background: COLORS[src]||'#7a879e' }}/>
            <span className="src-name">{src}</span>
            <div className="src-track">
              <div className="src-fill" style={{ width:`${(cnt/total)*100}%`, background: COLORS[src]||'#7a879e' }}/>
            </div>
            <span className="src-pct">{Math.round((cnt/total)*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────── */
export default function AnalyticsPage({ jobs, stats }) {
  const scored   = jobs.filter(j => j.match_score !== null);
  const avgScore = scored.length ? Math.round(scored.reduce((a,j) => a+j.match_score,0)/scored.length) : 0;
  const bestMatch= scored.length ? Math.max(...scored.map(j=>j.match_score)) : 0;
  const offerRate= jobs.length ? Math.round(((stats?.offered||0)/jobs.length)*100) : 0;

  return (
    <div className="page anl-page">

      <div className="page-hd">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Insights across {jobs.length} tracked positions</p>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="anl-kpis">
        {[
          { label:'Scored Jobs',  val:`${scored.length} / ${jobs.length}`, color:'#00c9a7' },
          { label:'Avg Score',    val: avgScore  ? `${avgScore}%`  : '—', color: avgScore>=70?'#22c55e':avgScore>=40?'#f5a623':'#6b7a96' },
          { label:'Best Match',   val: bestMatch ? `${bestMatch}%` : '—', color:'#22c55e' },
          { label:'Offer Rate',   val: jobs.length ? `${offerRate}%` : '—', color:'#a855f7' },
        ].map(k => (
          <div key={k.label} className="anl-kpi">
            <div className="kpi-val" style={{ color: k.color }}>{k.val}</div>
            <div className="kpi-lbl">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="anl-grid">
        <ScoreDistChart jobs={jobs} />
        <StatusRings    stats={stats} />
        <SkillGaps      jobs={jobs} />
        <SourceBreakdown jobs={jobs} />
      </div>
    </div>
  );
}
