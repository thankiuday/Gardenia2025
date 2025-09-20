const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  regId: {
    type: String,
    required: true,
    unique: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  isGardenCityStudent: {
    type: Boolean,
    required: true
  },
  leader: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    registerNumber: {
      type: String,
      trim: true
    },
    collegeName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  teamMembers: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    registerNumber: {
      type: String,
      trim: true
    },
    collegeName: {
      type: String,
      trim: true
    }
  }],
  finalEventDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'APPROVED'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'DONE'],
    default: 'PENDING'
  },
  qrPayload: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
registrationSchema.index({ regId: 1 });
registrationSchema.index({ eventId: 1 });
registrationSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
