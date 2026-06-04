const express = require('express');
const TnP     = require('../models/TnPOpportunity');
const Job     = require('../models/Job');

const router = express.Router();

// ── POST /api/tnp  (called by n8n after parsing a TnP email) ──────────
router.post('/', async (req, res) => {
  try {
    const {
      company, role, location, ctc, eligibility, deadline,
      skills_required, summary,
      email_subject, email_body, email_from, email_date,
    } = req.body;

    if (!company || !role)
      return res.status(400).json({ error: 'company and role are required' });

    const opp = new TnP({
      company, role, location, ctc, eligibility,
      deadline: deadline ? new Date(deadline) : null,
      skills_required: skills_required || [],
      summary,
      email_subject, email_body, email_from,
      email_date: email_date ? new Date(email_date) : null,
    });
    await opp.save();
    res.status(201).json(opp);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/tnp  (list with optional filters) ────────────────────────
// Query params:
//   status          = new | interested | applied | ignored  (comma-separated)
//   deadlineWithin  = N days  (for the reminder workflow)
//   search          = text match on company/role
router.get('/', async (req, res) => {
  try {
    const { status, deadlineWithin, search } = req.query;
    const filter = {};

    if (status) {
      const statuses = status.split(',').map(s => s.trim());
      filter.status = { $in: statuses };
    }

    if (deadlineWithin) {
      const days   = parseInt(deadlineWithin);
      const now    = new Date();
      const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      filter.deadline = { $gte: now, $lte: future };
    }

    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ company: re }, { role: re }];
    }

    const opps = await TnP.find(filter).sort({ createdAt: -1 });
    res.json(opps);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/tnp/stats  (counts per status + deadline-soon count) ─────
router.get('/stats', async (req, res) => {
  try {
    const [total, newCount, interested, applied, ignored] = await Promise.all([
      TnP.countDocuments({}),
      TnP.countDocuments({ status: 'new' }),
      TnP.countDocuments({ status: 'interested' }),
      TnP.countDocuments({ status: 'applied' }),
      TnP.countDocuments({ status: 'ignored' }),
    ]);

    // deadline within 3 days and not ignored/applied
    const soon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const deadlineSoon = await TnP.countDocuments({
      deadline: { $gte: new Date(), $lte: soon },
      status:   { $in: ['new', 'interested'] },
    });

    res.json({ total, new: newCount, interested, applied, ignored, deadlineSoon });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/tnp/:id ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const opp = await TnP.findById(req.params.id).populate('job_id', 'title status match_score');
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opp);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /api/tnp/:id  (update status / notes / job_id) ─────────────
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes, job_id } = req.body;
    const opp = await TnP.findById(req.params.id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
    if (status) opp.status = status;
    if (notes  !== undefined) opp.notes  = notes;
    if (job_id !== undefined) opp.job_id = job_id;
    await opp.save();
    res.json(opp);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/tnp/:id/add-to-pipeline  ────────────────────────────────
// Creates a Job from the TnP opportunity and links them
router.post('/:id/add-to-pipeline', async (req, res) => {
  try {
    const opp = await TnP.findById(req.params.id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

    const job = new Job({
      title:    opp.role,
      company:  opp.company,
      location: opp.location,
      jd_text:  opp.email_body || opp.summary || `${opp.role} at ${opp.company}`,
      source:   'gmail',
      tags:     opp.skills_required.slice(0, 6),
    });
    await job.save();

    opp.job_id = job._id;
    opp.status = 'applied';
    await opp.save();

    res.status(201).json({ job, opportunity: opp });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE /api/tnp/:id ───────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const opp = await TnP.findByIdAndDelete(req.params.id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
    res.json({ message: 'Deleted', opp });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
