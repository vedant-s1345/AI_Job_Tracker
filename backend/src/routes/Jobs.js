const express  = require('express');
const multer   = require('multer');
const pdfParse = require('pdf-parse');
const Job      = require('../models/Job');
const Resume   = require('../models/Resume');

const router = express.Router();

// ── Multer (memory storage — no disk writes) ──────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files are allowed'), false);
  },
});

// ── GET /api/jobs/resume  (single resume, optional ?tag= filter) ──────
router.get('/resume', async (req, res) => {
  try {
    const filter = { userId: 'vedant' };
    if (req.query.tag) {
      const normalizedTag = req.query.tag.toLowerCase().replace(/\s+/g, '_');
      filter.tag = normalizedTag;
    }
    const resume = await Resume.findOne(filter).sort({ createdAt: -1 });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ── GET /api/jobs/resumes  (all resumes for this user) ─────────────────
router.get('/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: 'vedant' }).sort({ tag: 1 });
    res.json(resumes);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/jobs/resume  (upsert by tag — one doc per tag) ───────────
router.post('/resume', async (req, res) => {
  try {
    const { text, tag } = req.body;
    if (!text) return res.status(400).json({ error: 'Resume text required' });
    const resumeTag = (tag || 'full-stack').toLowerCase().replace(/\s+/g, '_');
    const resume = await Resume.findOneAndUpdate(
      { userId: 'vedant', tag: resumeTag },
      { text, tag: resumeTag },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(resume);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE /api/jobs/resume/:id  (delete one resume by _id) ───────────
router.delete('/resume/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ message: 'Resume deleted', resume });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/jobs/extract-pdf  (upload PDF → return extracted text) ──
router.post('/extract-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    const data = await pdfParse(req.file.buffer);
    res.json({
      text:     data.text.trim(),
      pages:    data.numpages,
      filename: req.file.originalname,
    });
  } catch (err) {
    res.status(500).json({ error: 'PDF parse failed: ' + err.message });
  }
});

// ── GET /api/jobs/stats/pipeline ───────────────────────────────────────
router.get('/stats/pipeline', async (req, res) => {
  try {
    const [saved, applied, interviewing, offered, rejected] = await Promise.all([
      Job.countDocuments({ status: 'saved'        }),
      Job.countDocuments({ status: 'applied'      }),
      Job.countDocuments({ status: 'interviewing' }),
      Job.countDocuments({ status: 'offered'      }),
      Job.countDocuments({ status: 'rejected'     }),
    ]);
    res.json({ saved, applied, interviewing, offered, rejected,
      total: saved + applied + interviewing + offered + rejected });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/jobs  (create job) ───────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, company, location, jd_text, source, deadline, tags } = req.body;
    if (!title || !company || !jd_text)
      return res.status(400).json({ error: 'title, company, and jd_text are required' });
    const job = new Job({ title, company, location, jd_text, source, deadline, tags });
    await job.save();
    res.status(201).json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/jobs  (list with optional filters) ────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, company, minScore, maxScore } = req.query;
    const filter = {};
    if (status)   filter.status  = status;
    if (company)  filter.company = new RegExp(company, 'i');
    if (minScore) filter.match_score = { $gte: parseInt(minScore) };
    if (maxScore) { filter.match_score = filter.match_score || {}; filter.match_score.$lte = parseInt(maxScore); }
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/jobs/:id ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /api/jobs/:id ────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const { status, match_score, gap_skills, matched_skills, notes,
            follow_up_date, applied_on, tags } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (status                       ) job.status         = status;
    if (match_score    !== undefined  ) job.match_score    = match_score;
    if (gap_skills                   ) job.gap_skills      = gap_skills;
    if (matched_skills               ) job.matched_skills  = matched_skills;
    if (notes          !== undefined  ) job.notes          = notes;
    if (follow_up_date               ) job.follow_up_date  = follow_up_date;
    if (applied_on                   ) job.applied_on      = applied_on;
    if (tags                         ) job.tags            = tags;
    await job.save();
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE /api/jobs/:id ───────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted', job });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
