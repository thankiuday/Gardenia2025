const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  customId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Department Flagship Events', 'Signature Events', 'Sports Events']
  },
  type: {
    type: String,
    required: true,
    enum: ['Individual', 'Group']
  },
  teamSize: {
    min: {
      type: Number,
      required: true,
      default: 1
    },
    max: {
      type: Number,
      required: true,
      default: 1
    }
  },
  contacts: [{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false,
      default: ''
    },
    role: {
      type: String,
      required: true,
      enum: ['SPOC', 'Student In-Charge', 'Student co-ordinator – College-level', 'Student co-ordinator – School-level']
    }
  }],
  dates: {
    inhouse: {
      type: String,
      required: true
    },
    outside: {
      type: String,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  rules: [{
    type: String,
    required: true
  }],
  eligibility: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  club: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
