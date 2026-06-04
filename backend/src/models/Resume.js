const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'vedant' },
    text: { type: String, required: true },
    skills: { type: [String], default: [] },
    tag: { type: String, default: 'full-stack' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);