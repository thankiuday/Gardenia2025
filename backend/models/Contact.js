const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Your name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Your email address is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Your phone number is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please enter your message'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
