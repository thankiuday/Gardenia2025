const mongoose = require('mongoose');

const ticketDownloadSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    ref: 'Registration'
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  downloadType: {
    type: String,
    enum: ['manual', 'auto'],
    default: 'manual'
  }
}, {
  timestamps: true
});

// Index for faster queries
ticketDownloadSchema.index({ registrationId: 1 });
ticketDownloadSchema.index({ downloadedAt: 1 });
ticketDownloadSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('TicketDownload', ticketDownloadSchema);
