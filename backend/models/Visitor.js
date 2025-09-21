const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  city: {
    type: String,
    default: 'Unknown'
  },
  isUnique: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
visitorSchema.index({ ip: 1, createdAt: 1 });
visitorSchema.index({ page: 1, createdAt: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);
