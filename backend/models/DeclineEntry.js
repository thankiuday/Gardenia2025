const mongoose = require('mongoose');

const declineEntrySchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    ref: 'Registration'
  },
  regId: {
    type: String,
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  eventDetails: {
    title: { type: String, default: '' },
    category: { type: String, default: '' },
    department: { type: String, default: '' },
    type: { type: String, default: '' },
    time: { type: String, default: '' },
    location: { type: String, default: '' },
    date: { type: String, default: '' }
  },
  isGardenCityStudent: {
    type: Boolean,
    required: true
  },
  leader: {
    name: { type: String, default: '' },
    registerNumber: { type: String, default: '' },
    collegeName: { type: String, default: '' },
    collegeRegisterNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  teamMembers: [{
    name: { type: String, default: '' },
    registerNumber: { type: String, default: '' },
    collegeName: { type: String, default: '' },
    collegeRegisterNumber: { type: String, default: '' },
    email: { type: String, default: '' }
  }],
  finalEventDate: { type: String, default: '' },
  status: {
    type: String,
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'APPROVED'
  },
  action: {
    type: String,
    default: 'ENTRY_DENIED'
  },
  reason: {
    type: String,
    default: ''
  },
  scannedAt: {
    type: Date,
    required: true
  },
  loggedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
declineEntrySchema.index({ regId: 1 });
declineEntrySchema.index({ registrationId: 1 });
declineEntrySchema.index({ eventId: 1 });
declineEntrySchema.index({ scannedAt: -1 });

module.exports = mongoose.model('DeclineEntry', declineEntrySchema);

