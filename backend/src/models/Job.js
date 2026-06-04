const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Not specified' },
    jd_text: { type: String, required: true },
    source: { type: String, enum: ['gmail', 'manual', 'webhook', 'linkedin'], default: 'manual' },
    status: { type: String, enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected'], default: 'saved' },
    match_score: { type: Number, min: 0, max: 100, default: null },
    gap_skills: { type: [String], default: [] },
    matched_skills: { type: [String], default: [] },
    deadline: { type: Date, default: null },
    applied_on: { type: Date, default: null },
    follow_up_date: { type: Date, default: null },
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);