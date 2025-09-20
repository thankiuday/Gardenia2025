const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
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
        message: 'Invalid or expired token'
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
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
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
    console.error('Error during admin login:', error);
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
    
    // Get payment status counts
    const pendingPayments = await Registration.countDocuments({ paymentStatus: 'PENDING' });
    const completedPayments = await Registration.countDocuments({ paymentStatus: 'DONE' });
    
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

    res.json({
      success: true,
      data: {
        totalRegistrations,
        gcuRegistrations,
        outsideRegistrations,
        pendingPayments,
        completedPayments,
        registrationsPerEvent,
        totalContacts
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// GET /api/admin/registrations - Get all registrations (Protected)
router.get('/registrations', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const registrations = await Registration.find()
      .populate('eventId', 'title category type fee')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Registration.countDocuments();

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
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

// PATCH /api/admin/registrations/:id/payment - Update payment status (Protected)
router.patch('/registrations/:id/payment', authenticateToken, [
  body('paymentStatus').isIn(['PENDING', 'DONE']).withMessage('Invalid payment status')
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
    const { paymentStatus } = req.body;

    const registration = await Registration.findOne({ regId: id });
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    registration.paymentStatus = paymentStatus;
    await registration.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        regId: registration.regId,
        paymentStatus: registration.paymentStatus
      }
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
});

// GET /api/admin/contacts - Get all contact queries (Protected)
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

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
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
});

module.exports = router;
