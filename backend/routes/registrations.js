const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const TicketDownload = require('../models/TicketDownload');
const AllowedEntry = require('../models/AllowedEntry');
const DeclineEntry = require('../models/DeclineEntry');
const { body, validationResult } = require('express-validator');
const { generatePDF } = require('../utils/pdfGen');
const { generateQRCode, generateRegistrationId, createQRPayload } = require('../utils/qrGen');
const { uploadTicketToS3, getPublicTicketUrl, isS3Available } = require('../utils/s3Upload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// POST /api/register - Create new registration
router.post('/', [
  body('eventId').notEmpty().withMessage('Valid event ID is required'),
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

    // Validate event exists (support both ObjectId and string ID)
    let event;
    if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid MongoDB ObjectId
      event = await Event.findById(eventId);
    } else {
      // String ID - find by customId field
      event = await Event.findOne({ customId: eventId });
    }
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if registration is open for this event
    if (event.registrationOpen === false) {
      return res.status(403).json({
        success: false,
        message: 'Registration for this event is currently closed'
      });
    }

    // Special check for Rap Arena - Allow ONLY external students
    if (event.title === 'Gardenia 2K25: The Rap Arena' && isGardenCityStudent === true) {
      return res.status(403).json({
        success: false,
        message: 'Registration for Rap Arena is currently open only for external students. GCU students cannot register at this time.'
      });
    }

    // Validate team size for group events and individual/group events
    if (event.type === 'Group' || event.type === 'Individual/Group') {
      const totalMembers = 1 + teamMembers.length; // leader + team members
      if (totalMembers < event.teamSize.min || totalMembers > event.teamSize.max) {
        return res.status(400).json({
          success: false,
          message: `Team size must be between ${event.teamSize.min} and ${event.teamSize.max} members`
        });
      }
    }

    // Generate registration ID
    const regId = await generateRegistrationId();

    // Determine event date based on student type
    // Special handling for Rap Arena event - fixed date for all students
    const finalEventDate = event.title === 'Gardenia 2K25: The Rap Arena' 
      ? '16th October 2025' 
      : (isGardenCityStudent ? event.dates.inhouse : event.dates.outside);

    // Create registration data
    const registrationData = {
      regId,
      eventId: event._id, // Use the actual event ObjectId, not the string customId
      isGardenCityStudent,
      leader,
      teamMembers,
      finalEventDate,
      status: 'APPROVED',
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
      const qrCodeDataURL = await generateQRCode(qrPayload);
      let pdfBuffer;
      let isHTMLFallback = false;
      
      try {
        // Try custom PDF generation with Puppeteer first (your preferred method)
        const pdfData = { 
          ...registration.toObject(), 
          regId: regId,
          leader: registrationData.leader,
          teamMembers: registrationData.teamMembers,
          finalEventDate: registrationData.finalEventDate,
          status: registrationData.status,
          createdAt: new Date()
        };
        pdfBuffer = await generatePDF(pdfData, event, qrCodeDataURL);
      } catch (puppeteerError) {
        try {
          // Try proper PDF generation with html-pdf-node
          const { generateProperPDF } = require('../utils/properPdfGen');
          const pdfData = { ...registration.toObject(), registrationId: regId };
          pdfBuffer = await generateProperPDF(pdfData, event, qrCodeDataURL);
        } catch (properPdfError) {
          // Fallback to HTML generation
          const { generatePDFFromHTML } = require('../utils/htmlToPdf');
          const pdfData = { ...registration.toObject(), registrationId: regId };
          const htmlPDF = await generatePDFFromHTML(pdfData, event, qrCodeDataURL);
          pdfBuffer = Buffer.from(htmlPDF.html, 'utf8');
          isHTMLFallback = true;
        }
      }

      const fileName = isHTMLFallback ? `${regId}.html` : `${regId}.pdf`;
      const contentType = isHTMLFallback ? 'text/html' : 'application/pdf';
      let fileUrl = '';

      // Try S3 upload first, fallback to local storage
      try {
        // Check if S3 is configured and available
        if (isS3Available()) {
          fileUrl = await uploadTicketToS3(pdfBuffer, fileName);
        } else {
          throw new Error('S3 not configured, falling back to local storage');
        }
      } catch (s3Error) {
        
        // Fallback to local storage
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, pdfBuffer);
        fileUrl = `/uploads/${fileName}`;
      }

      // Update registration with file URL
      registration.pdfUrl = fileUrl;
      await registration.save();

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          registrationId: regId,
          event: event.title,
          pdfUrl: registration.pdfUrl,
          fileType: isHTMLFallback ? 'html' : 'pdf',
          qrCode: qrCodeDataURL,
          paymentStatus: 'PENDING'
        }
      });

    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
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
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to complete registration. Please check your information and try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/registrations/test-qr - Generate a test QR code for debugging
router.get('/test-qr', async (req, res) => {
  try {
    const { generateQRCode, createQRPayload, generateRegistrationId } = require('../utils/qrGen');
    
    // Create a test registration in the database first
    const testRegId = generateRegistrationId();
    
    // Find any existing event to use for testing
    const testEvent = await Event.findOne();
    if (!testEvent) {
      return res.status(404).json({
        success: false,
        message: 'No events found. Please create an event first.'
      });
    }
    
    // Create test registration data
    const testRegistrationData = {
      regId: testRegId,
      eventId: testEvent._id,
      isGardenCityStudent: true,
      leader: {
        name: 'Test User',
        registerNumber: '24TEST001',
        email: 'test@example.com',
        phone: '9876543210'
      },
      teamMembers: [],
      finalEventDate: testEvent.dates.inhouse,
      status: 'APPROVED',
      qrPayload: ''
    };
    
    // Create QR payload
    const qrPayload = createQRPayload(testRegistrationData, testEvent);
    testRegistrationData.qrPayload = JSON.stringify(qrPayload);
    
    // Save test registration to database
    const testRegistration = new Registration(testRegistrationData);
    await testRegistration.save();
    
    // Generate QR code
    const qrCodeDataURL = await generateQRCode(qrPayload);
    
    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        payload: qrPayload,
        registrationId: testRegId,
        message: 'Test registration created successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to generate test QR code. Please try again.',
      error: error.message
    });
  }
});

// GET /api/registrations/debug - List all registrations for debugging
router.get('/debug', async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('eventId', 'title category')
      .select('regId leader.name eventId status')
      .lean();
    
    res.json({
      success: true,
      data: {
        count: registrations.length,
        registrations: registrations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load registrations. Please try again.',
      error: error.message
    });
  }
});

// GET /api/registrations/validate/:regId - Validate registration by QR code
router.get('/validate/:regId', async (req, res) => {
  try {
    const { regId } = req.params;
    
    const registration = await Registration.findOne({ regId })
      .populate('eventId', 'title category department type time teamSize rules dates description eligibility')
      .lean();
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }
    
    // Ensure all required fields are present with fallback values
    const responseData = {
      ...registration,
      eventId: {
        title: registration.eventId?.title || 'Event',
        category: registration.eventId?.category || 'General',
        department: registration.eventId?.department || 'General',
        type: registration.eventId?.type || 'Competition',
        time: registration.eventId?.time || 'TBA',
        date: registration.eventId?.date || 'TBA',
        location: 'Garden City University', // Default location since field doesn't exist in Event model
        dates: registration.eventId?.dates || { inhouse: 'TBA', outside: 'TBA' },
        teamSize: registration.eventId?.teamSize || { min: 1, max: 1 },
        rules: registration.eventId?.rules || [],
        description: registration.eventId?.description || '',
        eligibility: registration.eventId?.eligibility || ''
      },
      leader: {
        name: registration.leader?.name || 'N/A',
        email: registration.leader?.email || 'N/A',
        phone: registration.leader?.phone || 'N/A',
        registerNumber: registration.leader?.registerNumber || 'N/A',
        collegeName: registration.leader?.collegeName || 'Garden City University',
        collegeRegisterNumber: registration.leader?.collegeRegisterNumber || 'N/A'
      },
      teamMembers: registration.teamMembers || [],
      finalEventDate: registration.finalEventDate || 'TBA',
      regId: registration.regId || 'N/A',
      status: registration.status || 'PENDING',
      isGardenCityStudent: registration.isGardenCityStudent || false
    };
    
    res.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to verify registration. Please check the QR code and try again.'
    });
  }
});

// POST /api/registrations/entry-log - Log entry/exit actions
router.post('/entry-log', async (req, res) => {
  try {
    const { registrationId, eventId, action, timestamp, reason } = req.body;
    
    // Validate required fields
    if (!registrationId || !eventId || !action || !timestamp) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Validate action type
    const validActions = ['ENTRY_ALLOWED', 'ENTRY_DENIED', 'EXIT'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Please try again.'
      });
    }
    
    // Fetch the complete registration data
    const registration = await Registration.findOne({ regId: registrationId })
      .populate('eventId', 'title category department type time dates description')
      .lean();
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }
    
    // Check for duplicate entry based on action (silently ignore duplicates)
    if (action === 'ENTRY_ALLOWED') {
      const existingAllowedEntry = await AllowedEntry.findOne({ registrationId: registrationId });
      if (existingAllowedEntry) {
        // Return success without saving (silently ignore duplicate)
        return res.json({
          success: true,
          message: 'Entry allowed and logged successfully',
          data: {
            id: existingAllowedEntry._id,
            registrationId: existingAllowedEntry.registrationId,
            action: existingAllowedEntry.action,
            timestamp: existingAllowedEntry.scannedAt,
            isDuplicate: true // Internal flag (not shown to user)
          }
        });
      }
    } else if (action === 'ENTRY_DENIED') {
      const existingDeclinedEntry = await DeclineEntry.findOne({ registrationId: registrationId });
      if (existingDeclinedEntry) {
        // Return success without saving (silently ignore duplicate)
        return res.json({
          success: true,
          message: 'Entry denied and logged successfully',
          data: {
            id: existingDeclinedEntry._id,
            registrationId: existingDeclinedEntry.registrationId,
            action: existingDeclinedEntry.action,
            timestamp: existingDeclinedEntry.scannedAt,
            isDuplicate: true // Internal flag (not shown to user)
          }
        });
      }
    }
    
    // Prepare the entry log data with all participant information
    const entryLogData = {
      registrationId: registrationId,
      regId: registration.regId,
      eventId: registration.eventId._id,
      eventDetails: {
        title: registration.eventId?.title || 'Event',
        category: registration.eventId?.category || 'General',
        department: registration.eventId?.department || 'General',
        type: registration.eventId?.type || 'Competition',
        time: registration.eventId?.time || 'TBA',
        location: 'Garden City University',
        date: registration.finalEventDate || 'TBA'
      },
      isGardenCityStudent: registration.isGardenCityStudent,
      leader: {
        name: registration.leader?.name || 'N/A',
        registerNumber: registration.leader?.registerNumber || '',
        collegeName: registration.leader?.collegeName || '',
        collegeRegisterNumber: registration.leader?.collegeRegisterNumber || '',
        email: registration.leader?.email || 'N/A',
        phone: registration.leader?.phone || 'N/A'
      },
      teamMembers: registration.teamMembers || [],
      finalEventDate: registration.finalEventDate || 'TBA',
      status: registration.status || 'APPROVED',
      action: action,
      scannedAt: new Date(timestamp),
      loggedAt: new Date()
    };
    
    // Save to appropriate schema based on action
    let savedEntry;
    if (action === 'ENTRY_ALLOWED') {
      const allowedEntry = new AllowedEntry(entryLogData);
      savedEntry = await allowedEntry.save();
    } else if (action === 'ENTRY_DENIED') {
      entryLogData.reason = reason || 'No reason provided';
      const declineEntry = new DeclineEntry(entryLogData);
      savedEntry = await declineEntry.save();
    }
    
    res.json({
      success: true,
      message: `Entry ${action === 'ENTRY_ALLOWED' ? 'allowed' : 'denied'} and logged successfully`,
      data: {
        id: savedEntry._id,
        registrationId: savedEntry.registrationId,
        action: savedEntry.action,
        timestamp: savedEntry.scannedAt
      }
    });
    
  } catch (error) {
    console.error('Entry log error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to log entry. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    // Track the download
    try {
      const downloadRecord = new TicketDownload({
        registrationId: req.params.id,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        downloadType: 'manual'
      });
      await downloadRecord.save();
    } catch (trackingError) {
      // Don't fail the download if tracking fails
    }

    // If it's an S3 URL, fetch and serve the file directly
    if (registration.pdfUrl.startsWith('https://')) {
      try {
        const https = require('https');
        const url = require('url');
        
        const parsedUrl = url.parse(registration.pdfUrl);
        const options = {
          hostname: parsedUrl.hostname,
          port: 443,
          path: parsedUrl.path,
          method: 'GET'
        };

        // Download the file to memory first, then serve it
        const chunks = [];
        
        const request = https.request(options, (response) => {
          // Check if the S3 response is successful
          if (response.statusCode !== 200) {
            console.error('S3 returned error:', response.statusCode);
            return res.status(500).json({
              success: false,
              message: 'Unable to download ticket. Please try again.'
            });
          }

          // Collect chunks
          response.on('data', (chunk) => {
            chunks.push(chunk);
          });

          response.on('end', () => {
            try {
              // Combine all chunks into a buffer
              const pdfBuffer = Buffer.concat(chunks);
              
              // Send the PDF buffer as binary data with proper headers
              res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Gardenia2025-Ticket-${registration.regId}.pdf"`,
                'Content-Length': pdfBuffer.length,
                'Cache-Control': 'no-cache',
                'Accept-Ranges': 'bytes',
                'X-Content-Type-Options': 'nosniff'
              });
              res.end(pdfBuffer);
              
            } catch (error) {
              console.error('Error serving PDF buffer:', error);
              if (!res.headersSent) {
                res.status(500).json({
                  success: false,
                  message: 'Unable to download ticket. Please try again.'
                });
              }
            }
          });

          response.on('error', (error) => {
            console.error('Error downloading S3 file:', error);
            if (!res.headersSent) {
              res.status(500).json({
                success: false,
                message: 'Unable to download ticket. Please try again.'
              });
            }
          });
        });

        request.on('error', (error) => {
          console.error('Error fetching S3 file:', error);
          res.status(500).json({
            success: false,
            message: 'Unable to download ticket. Please try again.'
          });
        });

        request.end();
        return;
      } catch (error) {
        console.error('Error processing S3 URL:', error);
        res.status(500).json({
          success: false,
          message: 'Unable to download ticket. Please try again.'
        });
        return;
      }
    }

    // Fallback for local files (for backward compatibility)
    const pdfPath = path.join(__dirname, '../uploads', path.basename(registration.pdfUrl));
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found'
      });
    }

    res.download(pdfPath);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to download ticket. Please try again.'
    });
  }
});

// GET /api/register/:id - Get registration details by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findOne({ regId: req.params.id })
      .populate('eventId', 'title category type');
    
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
    res.status(500).json({
      success: false,
      message: 'Unable to load registration details. Please try again.'
    });
  }
});

// GET /api/register/allowed-entries - Get all allowed entries
router.get('/entries/allowed', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const allowedEntries = await AllowedEntry.find()
      .populate('eventId', 'title category department')
      .sort({ scannedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AllowedEntry.countDocuments();

    res.json({
      success: true,
      data: {
        entries: allowedEntries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching allowed entries:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load allowed entries. Please try again.'
    });
  }
});

// GET /api/register/declined-entries - Get all declined entries
router.get('/entries/declined', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const declinedEntries = await DeclineEntry.find()
      .populate('eventId', 'title category department')
      .sort({ scannedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await DeclineEntry.countDocuments();

    res.json({
      success: true,
      data: {
        entries: declinedEntries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching declined entries:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load declined entries. Please try again.'
    });
  }
});

// GET /api/register/entries/stats - Get entry statistics
router.get('/entries/stats', async (req, res) => {
  try {
    const allowedCount = await AllowedEntry.countDocuments();
    const declinedCount = await DeclineEntry.countDocuments();
    
    // Get stats by event
    const allowedByEvent = await AllowedEntry.aggregate([
      {
        $group: {
          _id: '$eventId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $unwind: '$event'
      },
      {
        $project: {
          eventTitle: '$event.title',
          count: 1
        }
      }
    ]);

    const declinedByEvent = await DeclineEntry.aggregate([
      {
        $group: {
          _id: '$eventId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $unwind: '$event'
      },
      {
        $project: {
          eventTitle: '$event.title',
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        total: {
          allowed: allowedCount,
          declined: declinedCount,
          total: allowedCount + declinedCount
        },
        byEvent: {
          allowed: allowedByEvent,
          declined: declinedByEvent
        }
      }
    });
  } catch (error) {
    console.error('Error fetching entry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load entry statistics. Please try again.'
    });
  }
});

module.exports = router;
