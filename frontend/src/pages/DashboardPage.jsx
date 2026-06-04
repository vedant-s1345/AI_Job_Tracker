import { useMemo } from 'react';

const sc = s => s >= 70 ? '#22c55e' : s >= 40 ? '#f5a623' : '#ef4444';

const GREET = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const DATE = () => new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

const STATUS_META = {
  saved:'#6366f1', applied:'#3b82f6', interviewing:'#a855f7', offered:'#22c55e', rejected:'#ef4444'
};

export default function DashboardPage({ jobs, stats, loading, onSelectJob, onNav, onNewJob }) {
  const scored   = useMemo(() => jobs.filter(j => j.match_score !== null), [jobs]);
  const avgScore = useMemo(() => scored.length ? Math.round(scored.reduce((a,j) => a + j.match_score, 0) / scored.length) : 0, [scored]);
  const recent   = useMemo(() => [...jobs].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,7), [jobs]);
  const topMatch = useMemo(() => [...scored].sort((a,b) => b.match_score - a.match_score).slice(0,3), [scored]);
  const topGaps  = useMemo(() => {
    const freq = {};
    jobs.forEach(j => (j.gap_skills||[]).forEach(s => { freq[s]=(freq[s]||0)+1; }));
    return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,6);
  }, [jobs]);

  const METRICS = [
    { label:'Total Jobs',   val: stats?.total||0,        icon:'⊞', color:'#6366f1', sub:'tracked overall'      },
    { label:'Active',       val: (stats?.total||0)-(stats?.saved||0)-(stats?.rejected||0), icon:'→', color:'#3b82f6', sub:'in progress' },
    { label:'Avg Score',    val: avgScore ? `${avgScore}%` : '—', icon:'◎', color: avgScore>=70?'#22c55e':avgScore>=40?'#f5a623':'#7a879e', sub:'resume match' },
    { label:'Offers',       val: stats?.offered||0,      icon:'★', color:'#22c55e', sub:'received'              },
  ];

  return (
    <div className="page dash">

      {/* Hero */}
      <div className="dash-hero">
        <div>
          <h1 className="dash-greet">{GREET()}, Vedant 👋</h1>
          <p className="dash-date">{DATE()}</p>
        </div>
        <button className="btn-primary" onClick={onNewJob}>+ Parse New JD</button>
      </div>

      {/* Metrics */}
      <div className="dash-metrics">
        {METRICS.map(m => (
          <div key={m.label} className="metric-card" style={{ '--mc': m.color }}>
            <div className="mc-icon" style={{ color: m.color }}>{m.icon}</div>
            <div className="mc-body">
              <div className="mc-val" style={{ color: m.color }}>{loading ? '—' : m.val}</div>
              <div className="mc-lbl">{m.label}</div>
              <div className="mc-sub">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="dash-grid">

        {/* Recent applications */}
        <div className="d-panel">
          <div className="d-panel-hd">
            <h2 className="d-panel-title">Recent Applications</h2>
            <button className="d-panel-link" onClick={() => onNav('pipeline')}>View all →</button>
          </div>

          {recent.length === 0 ? (
            <div className="d-empty">
              No jobs yet.{' '}
              <button className="inline-link" onClick={onNewJob}>Parse your first JD →</button>
            </div>
          ) : (
            <div className="recent-list">
              {recent.map(job => (
                <div key={job._id} className="recent-row" onClick={() => onSelectJob(job)}>
                  <div className="rr-avi"
                    style={{ background: STATUS_META[job.status]+'20', color: STATUS_META[job.status], border:`1px solid ${STATUS_META[job.status]}35` }}>
                    {job.company.slice(0,2).toUpperCase()}
                  </div>
                  <div className="rr-info">
                    <div className="rr-title">{job.title}</div>
                    <div className="rr-co">
                      {job.company}{job.location && job.location !== 'Not specified' ? ` · ${job.location}` : ''}
                    </div>
                  </div>
                  <div className="rr-right">
                    {job.match_score !== null && job.match_score !== undefined
                      ? <span className="rr-score" style={{ color: sc(job.match_score) }}>{job.match_score}%</span>
                      : <span className="rr-score rr-score--none">—</span>}
                    <span className={`rr-status rr-status--${job.status}`}>{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="dash-right">

          {/* Best matches */}
          {topMatch.length > 0 && (
            <div className="d-panel">
              <div className="d-panel-hd">
                <h2 className="d-panel-title">🎯 Best Matches</h2>
              </div>
              {topMatch.map((job, i) => (
                <div key={job._id} className="top-row" onClick={() => onSelectJob(job)}>
                  <span className="top-rank" style={{ color:'#00c9a7' }}>#{i+1}</span>
                  <div className="top-info">
                    <div className="top-title">{job.title}</div>
                    <div className="top-co">{job.company}</div>
                  </div>
                  <span className="top-score" style={{ color: sc(job.match_score) }}>{job.match_score}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Top skill gaps */}
          {topGaps.length > 0 && (
            <div className="d-panel">
              <div className="d-panel-hd">
                <h2 className="d-panel-title">📊 Top Skill Gaps</h2>
              </div>
              <div className="gap-list">
                {topGaps.map(([skill, cnt]) => (
                  <div key={skill} className="gap-row">
                    <span className="gap-skill">{skill}</span>
                    <div className="gap-track">
                      <div className="gap-fill" style={{ width:`${(cnt/topGaps[0][1])*100}%` }}/>
                    </div>
                    <span className="gap-n">{cnt}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="d-panel">
            <div className="d-panel-hd">
              <h2 className="d-panel-title">Quick Actions</h2>
            </div>
            {[
              { ico:'⬡', color:'#00c9a7', title:'Parse New JD',    sub:'AI extracts all details',  action: onNewJob },
              { ico:'≡', color:'#3b82f6', title:'Open Pipeline',   sub:'Drag & manage stages',     action: () => onNav('pipeline') },
              { ico:'≈', color:'#a855f7', title:'Analytics',        sub:'Charts and insights',      action: () => onNav('analytics') },
              { ico:'≡', color:'#f5a623', title:'Update Resume',    sub:'Edit scoring source',      action: () => onNav('resume') },
            ].map(q => (
              <button key={q.title} className="qa-btn" onClick={q.action}>
                <span className="qa-ico" style={{ color: q.color }}>{q.ico}</span>
                <div>
                  <div className="qa-title">{q.title}</div>
                  <div className="qa-sub">{q.sub}</div>
                </div>
                <span className="qa-arr">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
