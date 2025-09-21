const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
const TicketDownload = require('../models/TicketDownload');
const { body, validationResult } = require('express-validator');
const config = require('../config');

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }
    req.user = user;
    next();
  });
};

// POST /api/admin/login - Admin login
router.post('/login', [
  body('username').notEmpty().trim().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find admin user
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect username or password. Please try again.'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect username or password. Please try again.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username 
      },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        username: admin.username
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// GET /api/admin/stats - Get dashboard statistics (Protected)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total registrations
    const totalRegistrations = await Registration.countDocuments();
    
    // Get GCU vs Outside registrations
    const gcuRegistrations = await Registration.countDocuments({ isGardenCityStudent: true });
    const outsideRegistrations = await Registration.countDocuments({ isGardenCityStudent: false });
    
    // Get registration status counts
    const pendingRegistrations = await Registration.countDocuments({ status: 'PENDING' });
    const approvedRegistrations = await Registration.countDocuments({ status: 'APPROVED' });
    
    // Get registrations per event
    const registrationsPerEvent = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $unwind: '$event'
      },
      {
        $group: {
          _id: '$event.title',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get total contact queries
    const totalContacts = await Contact.countDocuments();

    // Get visitor statistics
    const totalVisitors = await Visitor.countDocuments();
    const uniqueVisitors = await Visitor.countDocuments({ isUnique: true });

    // Get ticket download statistics
    const totalTicketDownloads = await TicketDownload.countDocuments();
    const uniqueTicketDownloads = await TicketDownload.distinct('registrationId').length;
    const manualDownloads = await TicketDownload.countDocuments({ downloadType: 'manual' });
    const autoDownloads = await TicketDownload.countDocuments({ downloadType: 'auto' });

    res.json({
      success: true,
      data: {
        totalRegistrations,
        gcuRegistrations,
        outsideRegistrations,
        pendingRegistrations,
        approvedRegistrations,
        registrationsPerEvent,
        totalContacts,
        totalVisitors,
        uniqueVisitors,
        totalTicketDownloads,
        uniqueTicketDownloads,
        manualDownloads,
        autoDownloads
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load dashboard statistics. Please try again.'
    });
  }
});

// GET /api/admin/registrations - Get all registrations (Protected)
router.get('/registrations', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { studentType, search } = req.query;

    // Build filter object
    let filter = {};
    
    // Filter by student type
    if (studentType && studentType !== 'ALL') {
      if (studentType === 'GCU') {
        filter.isGardenCityStudent = true;
      } else if (studentType === 'EXTERNAL') {
        filter.isGardenCityStudent = false;
      }
    }

    // Search functionality
    if (search) {
      // First, find events that match the search term
      const Event = require('../models/Event');
      const matchingEvents = await Event.find({
        title: { $regex: search, $options: 'i' }
      }).select('_id');
      
      const matchingEventIds = matchingEvents.map(event => event._id);
      
      filter.$or = [
        { 'leader.name': { $regex: search, $options: 'i' } },
        { 'leader.email': { $regex: search, $options: 'i' } },
        { 'leader.phone': { $regex: search, $options: 'i' } },
        { regId: { $regex: search, $options: 'i' } },
        ...(matchingEventIds.length > 0 ? [{ eventId: { $in: matchingEventIds } }] : [])
      ];
    }

    const registrations = await Registration.find(filter)
      .populate('eventId', 'title category type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Registration.countDocuments(filter);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load registrations. Please try again.'
    });
  }
});

// PATCH /api/admin/registrations/:id/status - Update registration status (Protected)
router.patch('/registrations/:id/status', authenticateToken, [
  body('status').isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Invalid registration status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const registration = await Registration.findOne({ regId: id });
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    registration.status = status;
    await registration.save();

    res.json({
      success: true,
      message: 'Registration status updated successfully',
      data: {
        regId: registration.regId,
        status: registration.status
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to update registration status. Please try again.'
    });
  }
});

// GET /api/admin/contacts - Get all contact queries (Protected)
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    // Build filter object
    let filter = {};
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load contact messages. Please try again.'
    });
  }
});

module.exports = router;
