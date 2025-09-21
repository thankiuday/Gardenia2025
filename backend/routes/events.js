const express = require('express');
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// GET /api/events - Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ category: 1, title: 1 });
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load events. Please try again.'
    });
  }
});

// GET /api/events/:id - Get event by ID (supports both ObjectId and string ID)
router.get('/:id', async (req, res) => {
  try {
    let event;
    
    // Check if it's a valid MongoDB ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(req.params.id);
    } else {
      // If it's not an ObjectId, try to find by custom ID field
      event = await Event.findOne({ customId: req.params.id });
    }
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load event details. Please try again.'
    });
  }
});

// GET /api/events/category/:category - Get events by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Event.find({ category }).sort({ title: 1 });
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load events for this category. Please try again.'
    });
  }
});

// POST /api/events - Create new event (Admin only - will add auth later)
router.post('/', [
  body('title').notEmpty().withMessage('Event title is required'),
  body('category').isIn(['Department Flagship Events', 'Signature Events', 'Sports Events']).withMessage('Invalid category'),
  body('type').isIn(['Individual', 'Group']).withMessage('Invalid event type'),
  body('description').notEmpty().withMessage('Event description is required')
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

    const event = new Event(req.body);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to create event. Please try again.'
    });
  }
});

module.exports = router;
