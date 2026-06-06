const ICO = {
  dashboard: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="12" y="2" width="6" height="6" rx="1.5"/><rect x="2" y="12" width="6" height="6" rx="1.5"/><rect x="12" y="12" width="6" height="6" rx="1.5"/></svg>,
  pipeline:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><rect x="2" y="3" width="3.5" height="14" rx="1.5"/><rect x="8.25" y="3" width="3.5" height="14" rx="1.5"/><rect x="14.5" y="3" width="3.5" height="14" rx="1.5"/></svg>,
  analytics: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><polyline points="2 15 6 9 10 12 14 5 18 8"/><line x1="2" y1="18" x2="18" y2="18"/></svg>,
  resume:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M12 2H5a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 5 18h10a1.5 1.5 0 0 0 1.5-1.5V7L12 2z"/><polyline points="12 2 12 7 16.5 7"/><line x1="6.5" y1="11" x2="13.5" y2="11"/><line x1="6.5" y1="14" x2="13.5" y2="14"/></svg>,
  tnp:       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M3 4h14v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4z"/><path d="M3 4l7 6 7-6"/></svg>,
  settings:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><circle cx="10" cy="10" r="2.5"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.2 3.2l1.4 1.4M15.4 15.4l1.4 1.4M16.8 3.2l-1.4 1.4M4.6 15.4l-1.4 1.4"/></svg>,
};

const NAV_MAIN = [
  { key: 'dashboard', label: 'Overview'  },
  { key: 'pipeline',  label: 'Pipeline'  },
  { key: 'analytics', label: 'Analytics' },
  { key: 'resume',    label: 'Resumes'   },
];
const NAV_PLACEMENT = [
  { key: 'tnp', label: 'T&P Mails' },
];
const NAV_BOTTOM = [
  { key: 'settings', label: 'Settings' },
];

const PIPE_COLS = [
  { key: 'saved',        color: '#6366f1' },
  { key: 'applied',      color: '#3b82f6' },
  { key: 'interviewing', color: '#a855f7' },
  { key: 'offered',      color: '#22c55e' },
  { key: 'rejected',     color: '#ef4444' },
];
const TAG_COLORS = {
  'full-stack':   '#00c9a7',
  'java_backend': '#f5a623',
  'aiml':         '#a855f7',
  'frontend':     '#3b82f6',
  'devops':       '#22c55e',
};
const tagColor = t => TAG_COLORS[t] || '#6366f1';

function NavItem({ item, active, onNav, badge, badgeRed }) {
  return (
    <button
      className={`sb-item${active ? ' sb-item--on' : ''}`}
      onClick={() => onNav(item.key)}
    >
      <span className="sb-ico">{ICO[item.key]}</span>
      <span className="sb-lbl">{item.label}</span>
      {badge > 0 && (
        <span
          className="sb-badge"
          style={badgeRed
            ? { background: '#ef4444', borderColor: '#ef4444', color: '#fff' }
            : {}}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({
  activePage,
  onNav,
  onNewJob,
  stats,
  activeResumeTag,
  tnpNewCount,
  isDemo,
  onToggleDemo,
  isOpen,
  onClose,
}) {
  const total  = stats?.total || 0;
  const maxCnt = Math.max(...PIPE_COLS.map(s => stats?.[s.key] || 0), 1);
  const tc     = tagColor(activeResumeTag);

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>

      {/* ── Mobile close button ─────────────────────────────────────────── */}
      <button className="sb-mobile-close" onClick={onClose} aria-label="Close menu">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" width="14" height="14">
          <line x1="3" y1="3" x2="17" y2="17"/>
          <line x1="17" y1="3" x2="3" y2="17"/>
        </svg>
      </button>

      {/* ── Brand ───────────────────────────────────────────────────────── */}
      <div className="sb-brand">
        <div className="sb-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00c9a7" strokeWidth="1.5" width="22" height="22">
            <polygon points="12 2 22 7 22 17 12 22 2 17 2 7"/>
          </svg>
        </div>
        <div>
          <div className="sb-name">JobTracker</div>
          <div className="sb-tagline">⬡ gemini powered</div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="sb-nav">
        <p className="sb-sect">Main</p>
        {NAV_MAIN.map(n => (
          <NavItem
            key={n.key}
            item={n}
            active={activePage === n.key}
            onNav={onNav}
            badge={n.key === 'pipeline' ? total : 0}
          />
        ))}

        <p className="sb-sect" style={{ marginTop: 12 }}>Placement</p>
        {NAV_PLACEMENT.map(n => (
          <NavItem
            key={n.key}
            item={n}
            active={activePage === n.key}
            onNav={onNav}
            badge={tnpNewCount}
            badgeRed={tnpNewCount > 0}
          />
        ))}

        <p className="sb-sect" style={{ marginTop: 12 }}>System</p>
        {NAV_BOTTOM.map(n => (
          // Hide settings in demo mode
          isDemo ? null :
          <NavItem key={n.key} item={n} active={activePage === n.key} onNav={onNav} />
        ))}
      </nav>

      {/* ── Active resume indicator ─────────────────────────────────────── */}
      <div className="sb-resume-ind">
        <p className="sb-sect">Active Resume</p>
        <div
          className="sb-resume-tag"
          style={{ '--rtc': tc }}
          onClick={() => onNav('resume')}
          title="Click to manage resumes"
        >
          <span className="sb-resume-dot"  style={{ background: tc }}/>
          <span className="sb-resume-name">{activeResumeTag || 'full-stack'}</span>
          <span className="sb-resume-edit">→</span>
        </div>
      </div>

      {/* ── Pipeline health ─────────────────────────────────────────────── */}
      {total > 0 && (
        <div className="sb-health">
          <p className="sb-sect">Pipeline Health</p>
          {PIPE_COLS.map(s => (
            <div key={s.key} className="sb-hrow">
              <span className="sb-hkey">{s.key}</span>
              <div className="sb-htrack">
                <div
                  className="sb-hfill"
                  style={{
                    width: `${((stats?.[s.key] || 0) / maxCnt) * 100}%`,
                    background: s.color,
                  }}
                />
              </div>
              <span className="sb-hn" style={{ color: s.color }}>
                {stats?.[s.key] || 0}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="sb-foot">
        {/* User info */}
        <div className="sb-user">
          <div className="sb-avatar">V</div>
          <div>
            <div className="sb-uname">Vedant Sarode</div>
            <div className="sb-urole">Full-Stack Dev</div>
          </div>
        </div>

        {/* Demo mode toggle */}
        <button
          className={`sb-demo-toggle${isDemo ? ' sb-demo-toggle--on' : ''}`}
          onClick={onToggleDemo}
          title={isDemo ? 'Exit demo mode' : 'Enable demo mode to hide your real data'}
        >
          <span className="sb-demo-ico">🎭</span>
          <span className="sb-demo-lbl">
            {isDemo ? 'Exit Demo Mode' : 'Demo Mode'}
          </span>
          <span className={`sb-demo-dot${isDemo ? ' sb-demo-dot--on' : ''}`}/>
        </button>

        {/* Parse JD CTA */}
        <button className="sb-parse" onClick={onNewJob}>
          <svg
            viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="2.2"
            width="12" height="12"
          >
            <line x1="8" y1="1" x2="8" y2="15"/>
            <line x1="1" y1="8" x2="15" y2="8"/>
          </svg>
          Parse JD
        </button>
      </div>
    </aside>
  );
}
