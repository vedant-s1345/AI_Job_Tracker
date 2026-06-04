import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api', headers: { 'Content-Type': 'application/json' } });
const N8N = 'http://localhost:5678/webhook';

// ── Jobs ──────────────────────────────────────────────────────────────
export const fetchJobs     = (p = {}) => API.get('/jobs', { params: p });
export const fetchJob      = (id)     => API.get(`/jobs/${id}`);
export const createJob     = (d)      => API.post('/jobs', d);
export const updateJob     = (id, d)  => API.patch(`/jobs/${id}`, d);
export const deleteJob     = (id)     => API.delete(`/jobs/${id}`);
export const fetchPipeline = ()       => API.get('/jobs/stats/pipeline');

// ── Resume ────────────────────────────────────────────────────────────
export const fetchResume     = (tag)       => API.get('/jobs/resume', { params: tag ? { tag } : {} });
export const fetchAllResumes = ()          => API.get('/jobs/resumes');
export const saveResume      = (text, tag) => API.post('/jobs/resume', { text, tag });
export const deleteResume    = (id)        => API.delete(`/jobs/resume/${id}`);

export const extractPdfText = (file) => {
  const fd = new FormData();
  fd.append('pdf', file);
  return API.post('/jobs/extract-pdf', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// ── n8n Webhooks ──────────────────────────────────────────────────────
export const parseJobWithAI = (jd_text)         => axios.post(`${N8N}/parse-job`, { jd_text });
export const scoreJobWithAI = (jobId, resumeTag) => axios.post(`${N8N}/score-job`, { jobId, resumeTag: resumeTag || 'full-stack' });

// ── TnP Opportunities ─────────────────────────────────────────────────
export const fetchTnP      = (p = {})    => API.get('/tnp', { params: p });
export const fetchTnPStats = ()          => API.get('/tnp/stats');
export const updateTnP     = (id, d)     => API.patch(`/tnp/${id}`, d);
export const deleteTnP     = (id)        => API.delete(`/tnp/${id}`);
export const addTnPToPipeline = (id)     => API.post(`/tnp/${id}/add-to-pipeline`);
