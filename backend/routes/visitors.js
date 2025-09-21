const express = require('express');
const Visitor = require('../models/Visitor');
const router = express.Router();

// POST /api/visitors/track - Track a visitor
router.post('/track', async (req, res) => {
  try {
    const { page, referrer } = req.body;
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';

    // Check if this is a unique visitor (same IP in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingVisitor = await Visitor.findOne({
      ip: ip,
      createdAt: { $gte: oneDayAgo }
    });

    const isUnique = !existingVisitor;

    // Create visitor record
    const visitor = new Visitor({
      ip,
      userAgent,
      page,
      referrer: referrer || '',
      isUnique
    });

    await visitor.save();

    res.json({
      success: true,
      message: 'Visitor tracked successfully',
      data: {
        isUnique,
        totalVisitors: await Visitor.countDocuments()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to track visitor. Please try again.'
    });
  }
});

// GET /api/visitors/stats - Get visitor statistics (Admin only)
router.get('/stats', async (req, res) => {
  try {
    // Get total visitors
    const totalVisitors = await Visitor.countDocuments();
    
    // Get unique visitors (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const uniqueVisitors = await Visitor.countDocuments({
      isUnique: true,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get visitors by page
    const visitorsByPage = await Visitor.aggregate([
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get visitors by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const visitorsByDay = await Visitor.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
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
        totalVisitors,
        uniqueVisitors,
        visitorsByPage,
        visitorsByDay
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load visitor statistics. Please try again.'
    });
  }
});

module.exports = router;
