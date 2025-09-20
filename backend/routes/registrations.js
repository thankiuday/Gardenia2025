const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');
const { generatePDF } = require('../utils/pdfGen');
const { generateQRCode, generateRegistrationId, createQRPayload } = require('../utils/qrGen');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// POST /api/register - Create new registration
router.post('/', [
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('isGardenCityStudent').isBoolean().withMessage('Student type must be specified'),
  body('leader.name').notEmpty().withMessage('Leader name is required'),
  body('leader.email').isEmail().withMessage('Valid email is required'),
  body('leader.phone').notEmpty().withMessage('Phone number is required')
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

    const { eventId, isGardenCityStudent, leader, teamMembers = [] } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validate team size for group events
    if (event.type === 'Group') {
      const totalMembers = 1 + teamMembers.length; // leader + team members
      if (totalMembers < event.teamSize.min || totalMembers > event.teamSize.max) {
        return res.status(400).json({
          success: false,
          message: `Team size must be between ${event.teamSize.min} and ${event.teamSize.max} members`
        });
      }
    }

    // Generate registration ID
    const regId = generateRegistrationId();

    // Determine event date based on student type
    const finalEventDate = isGardenCityStudent ? event.dates.inhouse : event.dates.outside;

    // Create registration data
    const registrationData = {
      regId,
      eventId,
      isGardenCityStudent,
      leader,
      teamMembers,
      finalEventDate,
      status: 'APPROVED',
      paymentStatus: 'PENDING',
      qrPayload: ''
    };

    // Create QR payload
    const qrPayload = createQRPayload(registrationData, event);
    registrationData.qrPayload = JSON.stringify(qrPayload);

    // Save registration
    const registration = new Registration(registrationData);
    await registration.save();

    // Generate PDF and QR code
    try {
      const pdfBuffer = await generatePDF(registration, event);
      const qrCodeDataURL = await generateQRCode(qrPayload);

      // Save PDF to uploads directory
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const pdfFileName = `${regId}.pdf`;
      const pdfPath = path.join(uploadsDir, pdfFileName);
      fs.writeFileSync(pdfPath, pdfBuffer);

      // Update registration with PDF URL
      registration.pdfUrl = `/uploads/${pdfFileName}`;
      await registration.save();

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          registrationId: regId,
          event: event.title,
          pdfUrl: registration.pdfUrl,
          qrCode: qrCodeDataURL,
          paymentStatus: 'PENDING'
        }
      });

    } catch (pdfError) {
      console.error('Error generating PDF/QR:', pdfError);
      // Still return success but without PDF
      res.status(201).json({
        success: true,
        message: 'Registration successful, but PDF generation failed',
        data: {
          registrationId: regId,
          event: event.title,
          paymentStatus: 'PENDING'
        }
      });
    }

  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create registration'
    });
  }
});

// GET /api/register/:id/pdf - Get PDF by registration ID
router.get('/:id/pdf', async (req, res) => {
  try {
    const registration = await Registration.findOne({ regId: req.params.id });
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (!registration.pdfUrl) {
      return res.status(404).json({
        success: false,
        message: 'PDF not available'
      });
    }

    const pdfPath = path.join(__dirname, '../uploads', path.basename(registration.pdfUrl));
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    res.download(pdfPath);

  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch PDF'
    });
  }
});

// GET /api/register/:id - Get registration details by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findOne({ regId: req.params.id })
      .populate('eventId', 'title category type fee');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration'
    });
  }
});

module.exports = router;
