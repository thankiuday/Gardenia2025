const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
const TicketDownload = require('../models/TicketDownload');
const { body, validationResult } = require('express-validator');
const config = require('../config');
const XLSX = require('xlsx');

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
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: 'customId',
          as: 'eventByCustomId'
        }
      },
      {
        $addFields: {
          event: {
            $cond: {
              if: { $gt: [{ $size: '$event' }, 0] },
              then: '$event',
              else: '$eventByCustomId'
            }
          }
        }
      },
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $ne: ['$event.title', null] },
              then: '$event.title',
              else: 'Unknown Event'
            }
          },
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
    const uniqueTicketDownloadsArray = await TicketDownload.distinct('registrationId');
    const uniqueTicketDownloads = uniqueTicketDownloadsArray.length;
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
      .populate({
        path: 'eventId',
        select: 'title category type customId',
        options: { strictPopulate: false }
      })
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

// GET /api/admin/registrations/export - Export registrations to Excel (Protected)
router.get('/registrations/export', authenticateToken, async (req, res) => {
  let startTime = Date.now();
  console.log('Excel export started at:', new Date().toISOString());
  
  // Set production-optimized headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    const { studentType, search } = req.query;
    
    // Validate studentType parameter
    if (studentType && !['GCU', 'EXTERNAL', 'ALL'].includes(studentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student type. Must be GCU, EXTERNAL, or ALL.',
        timestamp: new Date().toISOString()
      });
    }

    // Build filter object (same logic as regular registrations endpoint)
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

    console.log('Fetching registrations with filter:', JSON.stringify(filter));
    
    // Fetch all registrations matching the filter (no pagination for export)
    const registrations = await Registration.find(filter)
      .populate({
        path: 'eventId',
        select: 'title category type customId',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${registrations.length} registrations for export`);
    
    // Production memory and performance checks
    if (registrations.length > 50000) {
      return res.status(413).json({
        success: false,
        message: 'Dataset too large for export. Please use filters to reduce the data size.',
        recordCount: registrations.length,
        maxAllowed: 50000,
        timestamp: new Date().toISOString()
      });
    }
    
    if (registrations.length > 10000) {
      console.warn(`Large dataset detected: ${registrations.length} registrations. Using memory optimization.`);
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    }

    // Prepare data for Excel export with memory optimization
    const excelData = [];
    
    console.log('Processing registrations for Excel export...');
    
    try {
      registrations.forEach((registration, index) => {
        try {
          // Validate registration data before processing
          if (!registration || !registration.regId) {
            console.warn(`Skipping invalid registration at index ${index}`);
            return;
          }

          // Create base data with conditional fields based on student type
          const baseData = {
            'S.No': index + 1,
            'Registration ID': registration.regId || 'N/A',
            'Event Title': registration.eventId?.title || 'N/A',
            'Event Type': registration.eventId?.type || 'N/A',
            'Registration Date': registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A',
            'Registration Time': registration.createdAt ? new Date(registration.createdAt).toLocaleTimeString() : 'N/A',
            'Student Type': registration.isGardenCityStudent ? 'GCU Student' : 'External Participant',
            'Team Size': registration.teamMembers ? registration.teamMembers.length + 1 : 1,
            'Leader Name': registration.leader?.name || 'N/A',
            'Leader Email': registration.leader?.email || 'N/A',
            'Leader Phone': registration.leader?.phone || 'N/A',
            'Status': registration.status || 'N/A'
          };

          // Add student-specific fields
          if (registration.isGardenCityStudent) {
            // For GCU students, only include register number
            baseData['Leader Register Number'] = registration.leader?.registerNumber || 'N/A';
          } else {
            // For external students, include college/school information
            baseData['Leader College/School Name'] = registration.leader?.collegeName || 'N/A';
            baseData['Leader College/School Registration Number'] = registration.leader?.collegeRegisterNumber || 'N/A';
          }

          // For individual registrations
          if (!registration.teamMembers || registration.teamMembers.length === 0) {
            const individualData = { ...baseData };
            
            // Add team member fields based on student type
            if (registration.isGardenCityStudent) {
              individualData['Team Member Names'] = '';
              individualData['Team Member Register Numbers'] = '';
            } else {
              individualData['Team Member Names'] = '';
              individualData['Team Member College/School Names'] = '';
              individualData['Team Member College/School Registration Numbers'] = '';
            }
            
            excelData.push(individualData);
          } else {
            // For group registrations, combine all team members with comma separation
            const teamMemberNames = registration.teamMembers.map(member => member?.name || 'N/A').join(', ');
            const groupData = { ...baseData };
            
            if (registration.isGardenCityStudent) {
              // For GCU students, only include register numbers
              const teamMemberRegisterNumbers = registration.teamMembers.map(member => 
                member?.registerNumber || 'N/A'
              ).join(', ');
              
              groupData['Team Member Names'] = teamMemberNames;
              groupData['Team Member Register Numbers'] = teamMemberRegisterNumbers;
            } else {
              // For external students, include college/school information
              const teamMemberCollegeNames = registration.teamMembers.map(member => 
                member?.collegeName || 'N/A'
              ).join(', ');
              const teamMemberCollegeRegNumbers = registration.teamMembers.map(member => 
                member?.collegeRegisterNumber || 'N/A'
              ).join(', ');
              
              groupData['Team Member Names'] = teamMemberNames;
              groupData['Team Member College/School Names'] = teamMemberCollegeNames;
              groupData['Team Member College/School Registration Numbers'] = teamMemberCollegeRegNumbers;
            }

            excelData.push(groupData);
          }
        } catch (rowError) {
          console.error(`Error processing registration at index ${index}:`, rowError);
          // Add a row with error information instead of skipping
          excelData.push({
            'S.No': index + 1,
            'Registration ID': 'ERROR',
            'Event Title': 'Error processing registration',
            'Event Type': 'N/A',
            'Registration Date': 'N/A',
            'Registration Time': 'N/A',
            'Student Type': 'N/A',
            'Team Size': 0,
            'Leader Name': 'Error',
            'Leader Email': 'N/A',
            'Leader Phone': 'N/A',
            'Leader Roll Number': 'N/A',
            'Leader College/School Name': 'N/A',
            'Leader College/School Registration Number': 'N/A',
            'Status': 'ERROR',
            'Team Member Names': '',
            'Team Member Roll Numbers': '',
            'Team Member College/School Names': '',
            'Team Member College/School Registration Numbers': ''
          });
        }
      });
      
      console.log(`Processed ${excelData.length} rows for Excel export`);
    } catch (dataProcessingError) {
      console.error('Error processing registration data:', dataProcessingError);
      throw new Error('Failed to process registration data for export');
    }

    // Create workbook and worksheet with error handling
    console.log('Creating Excel workbook...');
    let wb, ws, excelBuffer;
    
    try {
      wb = XLSX.utils.book_new();
      ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths - dynamic based on data structure
      const colWidths = [
        { wch: 8 },   // S.No
        { wch: 15 },  // Registration ID
        { wch: 25 },  // Event Title
        { wch: 12 },  // Event Type
        { wch: 12 },  // Registration Date
        { wch: 12 },  // Registration Time
        { wch: 15 },  // Student Type
        { wch: 10 },  // Team Size
        { wch: 20 },  // Leader Name
        { wch: 25 },  // Leader Email
        { wch: 15 },  // Leader Phone
        { wch: 20 },  // Leader Register Number (GCU) or Leader College/School Name (External)
        { wch: 25 },  // Leader College/School Registration Number (External only)
        { wch: 10 },  // Status
        { wch: 30 },  // Team Member Names
        { wch: 30 },  // Team Member Register Numbers (GCU) or Team Member College/School Names (External)
        { wch: 30 }   // Team Member College/School Registration Numbers (External only)
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
      
      console.log('Generating Excel buffer...');
      
      // Production-optimized Excel generation
      const writeOptions = {
        type: 'buffer',
        bookType: 'xlsx',
        compression: true, // Enable compression to reduce memory usage
        cellStyles: false, // Disable cell styling for better performance
        Props: {
          Title: `Gardenia 2025 Registrations - ${studentType || 'All'} Students`,
          Subject: 'Event Registrations Export',
          Author: 'Gardenia 2025 System',
          CreatedDate: new Date(),
          Company: 'Garden City University'
        }
      };
      
      excelBuffer = XLSX.write(wb, writeOptions);
      
      console.log(`Excel buffer generated successfully. Size: ${excelBuffer.length} bytes`);
      
    } catch (excelError) {
      console.error('Error creating Excel file:', excelError);
      throw new Error('Failed to create Excel file. Please try again.');
    }

    // Set production-optimized headers for file download
    const currentDate = new Date().toISOString().split('T')[0];
    const studentTypeLabel = studentType === 'GCU' ? 'GCU_Students' : studentType === 'EXTERNAL' ? 'External_Students' : 'All_Students';
    const filename = `Gardenia2025_Registrations_${studentTypeLabel}_${currentDate}.xlsx`;
    
    console.log(`Sending Excel file: ${filename}`);
    
    // Production-optimized response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Export-Timestamp', new Date().toISOString());
    res.setHeader('X-Export-Record-Count', excelData.length.toString());
    res.setHeader('X-Export-Student-Type', studentType || 'ALL');
    res.setHeader('X-Export-File-Size', excelBuffer.length.toString());
    res.setHeader('Accept-Ranges', 'none'); // Disable range requests for exports
    
    // Send the Excel file with explicit status and end
    res.status(200).end(excelBuffer, 'binary');
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Excel export completed successfully in ${duration}ms. Records: ${excelData.length}`);

  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error('Excel export error:', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      studentType: req.query.studentType,
      search: req.query.search
    });
    
    // Determine the specific error type for better user feedback
    let errorMessage = 'Unable to export registrations. Please try again.';
    let statusCode = 500;
    
    if (error.message.includes('memory') || error.message.includes('Memory') || error.message.includes('ENOMEM')) {
      errorMessage = 'Export failed due to large dataset. Please try filtering the data or contact support.';
      statusCode = 413; // Payload Too Large
    } else if (error.message.includes('timeout') || error.message.includes('Timeout') || error.message.includes('ETIMEDOUT')) {
      errorMessage = 'Export timed out. Please try again with a smaller dataset.';
      statusCode = 408; // Request Timeout
    } else if (error.message.includes('database') || error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Database connection issue. Please try again in a few moments.';
      statusCode = 503; // Service Unavailable
    } else if (error.message.includes('Failed to process registration data')) {
      errorMessage = 'Data processing error. Some registrations may be corrupted. Please contact support.';
      statusCode = 422; // Unprocessable Entity
    } else if (error.message.includes('Failed to create Excel file')) {
      errorMessage = 'Excel file creation failed. Please try again or contact support.';
      statusCode = 500;
    } else if (error.message.includes('Invalid student type')) {
      errorMessage = 'Invalid export parameters. Please refresh the page and try again.';
      statusCode = 400;
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown',
      duration: `${duration}ms`
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
