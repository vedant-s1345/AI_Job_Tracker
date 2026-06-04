import { useState, useRef } from 'react';
import * as api from '../api/client';

const TABS = ['Text', 'PDF Upload'];

export default function AddJobModal({ onClose, onParse }) {
  const [tab,       setTab]       = useState('Text');
  const [jdText,    setJdText]    = useState('');
  const [pdfFile,   setPdfFile]   = useState(null);
  const [extracted, setExtracted] = useState('');
  const [extracting,setExtracting]= useState(false);
  const [loading,   setLoading]   = useState(false);
  const [err,       setErr]       = useState('');
  const [dragOver,  setDragOver]  = useState(false);
  const fileRef = useRef();

  /* ── PDF handling ─────────────────────────────────────────── */
  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setErr('Please upload a PDF file.'); return;
    }
    setPdfFile(file); setErr(''); setExtracted('');
    setExtracting(true);
    try {
      const res = await api.extractPdfText(file);
      setExtracted(res.data.text);
    } catch {
      setErr('PDF extraction failed — make sure the backend is running.');
    } finally { setExtracting(false); }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ── Submit ───────────────────────────────────────────────── */
  const handleParse = async () => {
    const text = tab === 'Text' ? jdText.trim() : extracted.trim();
    if (!text) { setErr('No job description to parse.'); return; }
    setLoading(true); setErr('');
    const ok = await onParse(text);
    setLoading(false);
    if (ok) onClose();
    else setErr('Parse failed — make sure n8n is running on port 5678 and the parse-job workflow is active.');
  };

  const activeText = tab === 'Text' ? jdText : extracted;

  return (
    <div className="ovl" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-hd">
          <div>
            <p className="modal-eyebrow">AI PARSING</p>
            <h2 className="modal-title">New Job Description</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {TABS.map(t => (
            <button key={t}
              className={`modal-tab${tab === t ? ' modal-tab--on' : ''}`}
              onClick={() => { setTab(t); setErr(''); }}
            >{t}</button>
          ))}
        </div>

        {/* Body */}
        <div className="modal-body">

          {/* ── Text tab ── */}
          {tab === 'Text' && (
            <>
              <p className="modal-hint">
                Paste the full JD — Gemini will extract title, company, location and skills automatically.
              </p>
              <textarea
                className="modal-ta"
                placeholder="Paste job description here…"
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                rows={13}
                autoFocus
              />
            </>
          )}

          {/* ── PDF tab ── */}
          {tab === 'PDF Upload' && (
            <>
              {/* Drop zone */}
              <div
                className={`pdf-drop${dragOver ? ' pdf-drop--over' : ''}${pdfFile ? ' pdf-drop--done' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                role="button"
                aria-label="Upload PDF"
              >
                <input
                  ref={fileRef} type="file" accept="application/pdf" style={{ display:'none' }}
                  onChange={e => handleFile(e.target.files[0])}
                />
                {extracting ? (
                  <div className="pdf-loading">
                    <div className="pdf-spinner" />
                    <p>Extracting text from PDF…</p>
                  </div>
                ) : pdfFile ? (
                  <div className="pdf-done">
                    <span className="pdf-ico">✓</span>
                    <p className="pdf-fname">{pdfFile.name}</p>
                    <p className="pdf-meta">{extracted.length.toLocaleString()} chars extracted</p>
                    <button className="pdf-change" onClick={e => { e.stopPropagation(); setPdfFile(null); setExtracted(''); }}>
                      Change file
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="pdf-upload-ico">⬡</span>
                    <p className="pdf-drop-title">Drop PDF here or click to browse</p>
                    <p className="pdf-drop-sub">Supports JD PDFs up to 10 MB</p>
                  </>
                )}
              </div>

              {/* Extracted preview */}
              {extracted && !extracting && (
                <div className="pdf-preview-wrap">
                  <div className="pdf-preview-hd">
                    <span>Extracted text preview</span>
                    <span className="pdf-preview-n">{extracted.split('\n').filter(Boolean).length} lines</span>
                  </div>
                  <pre className="pdf-preview">{extracted.slice(0, 600)}{extracted.length > 600 ? '\n…' : ''}</pre>
                </div>
              )}
            </>
          )}

          {err && <p className="modal-err">{err}</p>}
        </div>

        {/* Footer */}
        <div className="modal-ft">
          <span className="modal-chars">{activeText.length.toLocaleString()} chars</span>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleParse} disabled={loading || extracting || !activeText.trim()}>
            {loading ? '⬡ Parsing…' : '⬡ Parse with Gemini'}
          </button>
        </div>
      </div>
    </div>
  );
}
