import { useState, useEffect } from 'react';
import * as api from '../api/client';

const PRESET_TAGS = ['full-stack', 'java_backend', 'aiml', 'frontend', 'devops', 'custom'];

const TAG_COLORS = {
  'full-stack':   '#00c9a7',
  'java_backend': '#f5a623',
  'aiml':         '#a855f7',
  'frontend':     '#3b82f6',
  'devops':       '#22c55e',
  'custom':       '#6366f1',
};

const tagColor = (tag) => TAG_COLORS[tag] || '#6366f1';

// ← DEMO MODE: added isDemo, demoResumes props
export default function ResumePage({ showToast, activeResumeTag, onActiveChange, isDemo, demoResumes }) {
  const [resumes,    setResumes]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [editTag,    setEditTag]    = useState(null);
  const [editText,   setEditText]   = useState('');
  const [editLabel,  setEditLabel]  = useState('');
  const [saving,     setSaving]     = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [newTag,     setNewTag]     = useState('');
  const [newText,    setNewText]    = useState('');
  const [customTag,  setCustomTag]  = useState('');
  const [confirmDel, setConfirmDel] = useState(null);

  const loadResumes = async () => {
    // ← DEMO MODE: use fake resume data when demo is active
    if (isDemo) {
      setResumes(demoResumes || []);
      setLoading(false);
      return;
    }
    try {
      const r = await api.fetchAllResumes();
      setResumes(r.data);
    } catch { showToast('Could not load resumes', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadResumes(); }, [isDemo]);  // re-run when demo toggles

  const openEdit = (r) => {
    setEditTag(r.tag);
    setEditText(r.text);
    setEditLabel(r.tag);
    setShowNew(false);
  };

  const cancelEdit = () => { setEditTag(null); setEditText(''); setEditLabel(''); };

  const saveEdit = async () => {
    // ← DEMO MODE: block mutations
    if (isDemo) { showToast('Demo mode — data is read-only 🎭', 'error'); return; }
    if (!editText.trim()) { showToast('Resume text cannot be empty', 'error'); return; }
    setSaving(true);
    try {
      await api.saveResume(editText, editTag);
      showToast(`"${editTag}" resume saved!`);
      cancelEdit();
      loadResumes();
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const saveNew = async () => {
    // ← DEMO MODE: block mutations
    if (isDemo) { showToast('Demo mode — data is read-only 🎭', 'error'); return; }
    const finalTag = (newTag === 'custom' ? customTag : newTag)
      .trim().toLowerCase().replace(/\s+/g, '_');
    if (!finalTag) { showToast('Please choose or enter a tag', 'error'); return; }
    if (!newText.trim()) { showToast('Resume text cannot be empty', 'error'); return; }
    setSaving(true);
    try {
      await api.saveResume(newText, finalTag);
      showToast(`"${finalTag}" resume added!`);
      setShowNew(false); setNewTag(''); setNewText(''); setCustomTag('');
      loadResumes();
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const doDelete = async (id, tag) => {
    // ← DEMO MODE: block mutations
    if (isDemo) { showToast('Demo mode — data is read-only 🎭', 'error'); return; }
    try {
      await api.deleteResume(id);
      showToast(`"${tag}" resume deleted`);
      setConfirmDel(null);
      if (activeResumeTag === tag) onActiveChange('full-stack');
      loadResumes();
    } catch { showToast('Delete failed', 'error'); }
  };

  const words = (t) => t.trim() ? t.trim().split(/\s+/).length : 0;

  return (
    <div className="page resume-page">

      {/* Header */}
      <div className="page-hd">
        <div>
          <h1 className="page-title">Resumes</h1>
          <p className="page-sub">
            {isDemo
              ? 'Sample resumes — demo data only'
              : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} saved · Gemini uses the active one when scoring`}
          </p>
        </div>
        {/* ← DEMO MODE: hide "Add Resume" button in demo mode */}
        {!isDemo && (
          <button className="btn-primary" onClick={() => { setShowNew(true); cancelEdit(); }}>
            + Add Resume
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-box">Loading resumes…</div>
      ) : (
        <div className="res-multi-layout">

          {/* ── Left column: resume cards ── */}
          <div className="res-cards">
            {resumes.length === 0 && (
              <div className="res-empty">
                <p>{isDemo ? 'No demo resumes configured.' : 'No resumes yet.'}</p>
                {!isDemo && (
                  <button className="btn-primary" onClick={() => setShowNew(true)}>
                    + Add your first resume
                  </button>
                )}
              </div>
            )}

            {resumes.map(r => {
              const isActive  = r.tag === activeResumeTag;
              const isEditing = r.tag === editTag;
              const wc        = words(r.text);
              const tc        = tagColor(r.tag);

              return (
                <div
                  key={r._id}
                  className={`res-card${isActive ? ' res-card--active' : ''}${isEditing ? ' res-card--editing' : ''}`}
                  style={{ '--rc': tc }}
                >
                  {/* Card header */}
                  <div className="res-card-hd">
                    <div
                      className="res-tag-badge"
                      style={{ background: tc + '20', border: `1px solid ${tc}40`, color: tc }}
                    >
                      {r.tag}
                    </div>
                    {isActive && <span className="res-active-badge">● Active</span>}

                    <div className="res-card-actions">
                      {!isActive && (
                        <button
                          className="res-act-btn res-act-btn--set"
                          onClick={() => onActiveChange(r.tag)}
                          title="Set as active scoring resume"
                        >
                          Set Active
                        </button>
                      )}

                      {/* ← DEMO MODE: hide edit/delete buttons in demo mode */}
                      {!isDemo && (
                        <>
                          <button
                            className="res-act-btn"
                            onClick={() => isEditing ? cancelEdit() : openEdit(r)}
                            title="Edit this resume"
                          >
                            {isEditing ? 'Cancel' : 'Edit'}
                          </button>
                          {confirmDel === r._id ? (
                            <>
                              <button className="res-act-btn res-act-btn--del" onClick={() => doDelete(r._id, r.tag)}>
                                Confirm
                              </button>
                              <button className="res-act-btn" onClick={() => setConfirmDel(null)}>No</button>
                            </>
                          ) : (
                            <button
                              className="res-act-btn res-act-btn--del"
                              onClick={() => setConfirmDel(r._id)}
                              title="Delete this resume"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="res-card-stats">
                    <span>{r.text.length.toLocaleString()} chars</span>
                    <span>·</span>
                    <span>{wc.toLocaleString()} words</span>
                    <span>·</span>
                    <span style={{ color: wc > 200 ? '#22c55e' : '#f5a623' }}>
                      {wc > 200 ? 'Good length' : 'Short'}
                    </span>
                    <span>·</span>
                    <span style={{ color: '#3a4d68' }}>
                      Saved {new Date(r.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Inline edit textarea (only when not in demo mode) */}
                  {isEditing && !isDemo && (
                    <div className="res-edit-inline">
                      <textarea
                        className="res-ta"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        rows={18}
                        autoFocus
                      />
                      <div className="res-edit-foot">
                        <span className="res-tip">💡 More detail = better Gemini scoring.</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
                          <button className="btn-primary" onClick={saveEdit} disabled={saving}>
                            {saving ? 'Saving…' : '💾 Save Resume'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preview text */}
                  {(!isEditing || isDemo) && (
                    <pre className="res-preview">
                      {r.text.slice(0, 220)}{r.text.length > 220 ? '\n…' : ''}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Right column: Add new form (hidden in demo) ── */}
          {showNew && !isDemo && (
            <div className="res-new-panel">
              <div className="res-new-hd">
                <h3 className="res-new-title">Add New Resume</h3>
                <button
                  className="modal-close"
                  onClick={() => { setShowNew(false); setNewTag(''); setNewText(''); setCustomTag(''); }}
                >
                  ✕
                </button>
              </div>

              <div className="res-new-body">
                <div>
                  <p className="det-label">Profile / Tag</p>
                  <select className="det-input" value={newTag} onChange={e => setNewTag(e.target.value)}>
                    <option value="" disabled>Choose a profile…</option>
                    {PRESET_TAGS
                      .filter(t => !resumes.find(r => r.tag === t))
                      .map(t => <option key={t} value={t}>{t}</option>)}
                    {!PRESET_TAGS.includes(newTag) && newTag !== 'custom' && newTag &&
                      <option value={newTag}>{newTag}</option>}
                    <option value="custom">+ Custom tag…</option>
                  </select>
                  {newTag === 'custom' && (
                    <input
                      className="det-input"
                      style={{ marginTop: 8 }}
                      value={customTag}
                      onChange={e => setCustomTag(e.target.value)}
                      placeholder="e.g. data_engineering, mobile_dev…"
                    />
                  )}
                </div>

                <div>
                  <p className="det-label">Resume Text</p>
                  <textarea
                    className="res-ta"
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                    placeholder="Paste your resume as plain text…"
                    rows={20}
                    autoFocus
                  />
                  <div className="res-char-row">
                    <span>{newText.length.toLocaleString()} chars · {words(newText).toLocaleString()} words</span>
                  </div>
                </div>

                <div className="res-new-foot">
                  <span className="res-tip" style={{ flex: 1 }}>💡 Tailor each resume for its target role.</span>
                  <button className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
                  <button className="btn-primary" onClick={saveNew} disabled={saving}>
                    {saving ? 'Saving…' : '+ Save Resume'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
