const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const contactRoutes = require('./routes/contacts');
const adminRoutes = require('./routes/admin');
const visitorRoutes = require('./routes/visitors');
const ticketDownloadRoutes = require('./routes/ticketDownloads');

const app = express();

// Trust proxy for rate limiting (required for Render)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://gardenia2025-frontend.onrender.com',
      'https://gardenia2025.onrender.com',
      process.env.FRONTEND_URL,
      // Your VPS domain
      'https://gardenia.gardencity.university'
    ].filter(Boolean)
  : [
      'http://localhost:3000', 
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];

// CORS configuration

// CORS configuration - More permissive for development
if (process.env.CORS_ALLOW_ALL === 'true' || process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
} else {
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
}

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Timeout middleware for long-running operations like Excel export
app.use((req, res, next) => {
  // Set timeout for Excel export operations
  if (req.path.includes('/export')) {
    res.setTimeout(300000); // 5 minutes timeout for export operations
  } else {
    res.setTimeout(30000); // 30 seconds for other operations
  }
  next();
});

// Memory optimization middleware
app.use((req, res, next) => {
  // Force garbage collection before memory-intensive operations
  if (req.path.includes('/export') && global.gc) {
    global.gc();
  }
  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/ticket-downloads', ticketDownloadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV 
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (config.NODE_ENV === 'development') {
    console.error('Error:', error);
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Please check your information and try again.',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'The requested information could not be found. Please check and try again.'
    });
  }
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});

module.exports = app;
