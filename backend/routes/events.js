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
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// GET /api/events/:id - Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
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
      message: 'Failed to fetch event'
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
    console.error('Error fetching events by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events by category'
    });
  }
});

// POST /api/events - Create new event (Admin only - will add auth later)
router.post('/', [
  body('title').notEmpty().withMessage('Event title is required'),
  body('category').isIn(['Department Flagship Events', 'Signature Events', 'Sports Events']).withMessage('Invalid category'),
  body('type').isIn(['Individual', 'Group']).withMessage('Invalid event type'),
  body('fee').notEmpty().withMessage('Registration fee is required'),
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
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

module.exports = router;
