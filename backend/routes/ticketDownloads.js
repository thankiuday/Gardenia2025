const express = require('express');
const TicketDownload = require('../models/TicketDownload');
const Registration = require('../models/Registration');

const router = express.Router();

// POST /api/ticket-downloads/track - Track a ticket download
router.post('/track', async (req, res) => {
  try {
    const { registrationId, downloadType = 'manual' } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Verify registration exists
    const registration = await Registration.findOne({ regId: registrationId });
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Create download record
    const downloadRecord = new TicketDownload({
      registrationId,
      ipAddress,
      userAgent,
      downloadType
    });

    await downloadRecord.save();

    res.json({
      success: true,
      message: 'Download tracked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to track download. Please try again.'
    });
  }
});

// GET /api/ticket-downloads/stats - Get download statistics (Admin only)
router.get('/stats', async (req, res) => {
  try {
    // Get total downloads
    const totalDownloads = await TicketDownload.countDocuments();
    
    // Get unique downloads (by registration ID)
    const uniqueDownloads = await TicketDownload.distinct('registrationId').length;
    
    // Get downloads by type
    const manualDownloads = await TicketDownload.countDocuments({ downloadType: 'manual' });
    const autoDownloads = await TicketDownload.countDocuments({ downloadType: 'auto' });
    
    // Get downloads in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentDownloads = await TicketDownload.countDocuments({
      downloadedAt: { $gte: sevenDaysAgo }
    });

    // Get downloads by day for the last 7 days
    const downloadsByDay = await TicketDownload.aggregate([
      {
        $match: {
          downloadedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$downloadedAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalDownloads,
        uniqueDownloads,
        manualDownloads,
        autoDownloads,
        recentDownloads,
        downloadsByDay
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load download statistics. Please try again.'
    });
  }
});

module.exports = router;
