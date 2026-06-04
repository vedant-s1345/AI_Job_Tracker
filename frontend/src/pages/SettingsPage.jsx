import { useState } from 'react';

export default function SettingsPage({ showToast }) {
  const [backend, setBackend] = useState('http://localhost:5000');
  const [n8n,     setN8n]     = useState('http://localhost:5678');
  const [gemini,  setGemini]  = useState('Gemini 2.5 (via n8n)');

  const save = () => showToast('Settings saved (stored in session — no persistence yet).');

  const Section = ({ title, sub, children }) => (
    <div className="set-section">
      <div className="set-sec-hd">
        <h2 className="set-sec-title">{title}</h2>
        {sub && <p className="set-sec-sub">{sub}</p>}
      </div>
      <div className="set-sec-body">{children}</div>
    </div>
  );

  const Field = ({ label, hint, children }) => (
    <div className="set-field">
      <label className="set-lbl">{label}</label>
      {children}
      {hint && <p className="set-hint">{hint}</p>}
    </div>
  );

  return (
    <div className="page set-page">
      <div className="page-hd">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Configure API endpoints and AI behaviour</p>
        </div>
      </div>

      <div className="set-body">
        <Section title="Backend API" sub="Express.js server connection">
          <Field label="Backend URL" hint="Your Node.js server address (default: port 5000)">
            <input className="set-inp" value={backend} onChange={e=>setBackend(e.target.value)}/>
          </Field>
        </Section>

        <Section title="n8n Automation" sub="Workflow automation server">
          <Field label="n8n URL" hint="Self-hosted n8n instance (default: port 5678)">
            <input className="set-inp" value={n8n} onChange={e=>setN8n(e.target.value)}/>
          </Field>
          <Field label="Webhooks">
            <div className="set-webhook-list">
              {[
                { name:'JD Parser',      path:'/webhook/parse-job', desc:'Extracts title, company, skills from raw JD text' },
                { name:'Resume Scorer',  path:'/webhook/score-job', desc:'Scores your resume against a specific job' },
              ].map(w => (
                <div key={w.name} className="set-webhook">
                  <div>
                    <div className="set-w-name">{w.name}</div>
                    <div className="set-w-path"><code>{n8n}{w.path}</code></div>
                    <div className="set-w-desc">{w.desc}</div>
                  </div>
                  <span className="set-w-badge">Active</span>
                </div>
              ))}
            </div>
          </Field>
        </Section>

        <Section title="AI Model" sub="Gemini configuration (managed via n8n)">
          <Field label="Model" hint="Changed inside the n8n 'Message a model' node">
            <input className="set-inp" value={gemini} readOnly style={{ opacity:.6, cursor:'default' }}/>
          </Field>
          <div className="set-info-box">
            <p>🔑 Your Gemini API key is stored in <code>backend/.env</code> as <code>GEMINI_API_KEY</code>. The n8n workflow reads it via the credential store — never expose it in the frontend.</p>
          </div>
        </Section>

        <Section title="Database" sub="MongoDB Atlas connection">
          <div className="set-info-box">
            <p>Connection string stored in <code>backend/.env</code> as <code>MONGO_URI</code>. Using the direct port 27017 connection instead of SRV to bypass ISP DNS restrictions.</p>
          </div>
        </Section>

        <Section title="About" sub="Project info">
          <div className="set-about">
            <div className="set-about-row"><span>Stack</span><span>Node.js + Express + MongoDB + React + Vite + n8n + Gemini</span></div>
            <div className="set-about-row"><span>Author</span><span>Vedant Sarode · PCCoE TY IT</span></div>
            <div className="set-about-row"><span>Version</span><span>2.0.0</span></div>
          </div>
        </Section>
      </div>

      <div className="set-foot">
        <button className="btn-primary" onClick={save}>Save Settings</button>
      </div>
    </div>
  );
}
