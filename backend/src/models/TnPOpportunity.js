const mongoose = require('mongoose');

const tnpSchema = new mongoose.Schema(
  {
    company:        { type: String, required: true },
    role:           { type: String, required: true },
    location:       { type: String, default: 'Not specified' },
    ctc:            { type: String, default: null },          // "6–8 LPA"
    eligibility:    { type: String, default: null },          // "CGPA ≥ 7.5, All branches"
    deadline:       { type: Date,   default: null },
    skills_required:{ type: [String], default: [] },
    summary:        { type: String, default: '' },

    // Original email metadata
    email_subject:  { type: String, default: '' },
    email_body:     { type: String, default: '' },
    email_from:     { type: String, default: '' },
    email_date:     { type: Date,   default: null },

    // Tracking
    status: {
      type: String,
      enum: ['new', 'interested', 'applied', 'ignored'],
      default: 'new',
    },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
    notes:  { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TnPOpportunity', tnpSchema);
