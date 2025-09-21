const express = require('express');
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().trim().withMessage('Phone number is required'),
  body('message').notEmpty().trim().withMessage('Message is required')
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

    const { name, email, phone, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        submittedAt: contact.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to send your message. Please try again.'
    });
  }
});

module.exports = router;
