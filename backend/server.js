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

// Rate limiting - More permissive in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 500 : 1000, // Increased to 500 for production (was 100)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  },
  // Send custom headers to help clients handle rate limiting
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment and try again.',
      retryAfter: 60 // seconds
    });
  }
});

// Only apply rate limiting in production or if explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_RATE_LIMIT === 'true') {
  app.use('/api/', limiter);
  console.log('Rate limiting enabled');
} else {
  console.log('Rate limiting disabled for development');
}

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
    res.setTimeout(600000); // 10 minutes timeout for export operations
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

// Database connection with retry logic and improved error handling
const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(config.MONGODB_URI, {
        // Connection options for better reliability after Atlas upgrade
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
        // Atlas M10 specific optimizations
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        retryWrites: true, // Enable retryable writes
        retryReads: true, // Enable retryable reads
      });

      console.log(`Connected to MongoDB: ${conn.connection.host}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully');
      });

      return conn;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);

      if (i === retries - 1) {
        console.error('All MongoDB connection attempts failed. Please check:');
        console.error('1. MongoDB Atlas connection string format');
        console.error('2. Network access permissions in Atlas dashboard');
        console.error('3. Database user credentials and authentication method');
        console.error('4. MongoDB Atlas cluster status and region');
        console.error('5. If you recently upgraded from M0 to M10, verify the connection string');
        console.error('\nTroubleshooting steps:');
        console.error('- Check if your Atlas cluster connection string has changed after upgrade');
        console.error('- Verify IP whitelist in Atlas includes your VPS IP');
        console.error('- Test connection string directly: mongodb://username:password@host:port/database');
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Initialize database connection with retry logic
connectDB().catch((error) => {
  console.error('Final MongoDB connection error:', error.message);

  if (error.message.includes('option') && error.message.includes('not supported')) {
    console.error('\n🚨 DEPRECATED CONNECTION OPTION ERROR');
    console.error('This error has been fixed in the updated server.js');
    console.error('Please restart your application to use the corrected connection options.');
    console.error('\nIf you\'re seeing this after an update, the old server process might still be running.');
    console.error('Try: pm2 restart gardenia-backend');
  }

  // Don't exit the process, let it continue running
  // This allows the app to potentially recover if the database comes back online
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

// Enhanced error logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Log incoming requests in production (sampled)
  if (config.NODE_ENV === 'production' && Math.random() < 0.1) {
    console.log(`📨 ${req.method} ${req.path} - ${req.ip}`);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Log slow requests and errors
    if (duration > 5000 || statusCode >= 400) {
      console.log(`⏱️ ${req.method} ${req.path} - ${statusCode} - ${duration}ms`);
    }
  });

  next();
});

// Error handling middleware with enhanced logging
app.use((error, req, res, next) => {
  const timestamp = new Date().toISOString();
  const errorId = Math.random().toString(36).substring(7);

  // Enhanced error logging
  const errorInfo = {
    id: errorId,
    timestamp,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: error.message,
    stack: error.stack,
    statusCode: error.status || 500
  };

  console.error(`❌ Error [${errorId}]:`, JSON.stringify(errorInfo, null, 2));

  // In production, don't expose stack traces to clients
  if (config.NODE_ENV === 'development') {
    console.error('Full error:', error);
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      errorId,
      message: 'Please check your information and try again.',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      errorId,
      message: 'The requested information could not be found. Please check and try again.'
    });
  }

  // Handle MongoDB connection errors
  if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    return res.status(503).json({
      success: false,
      errorId,
      message: 'Database temporarily unavailable. Please try again in a moment.',
      retryAfter: 30
    });
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      errorId,
      message: 'File too large. Please choose a smaller file.'
    });
  }

  res.status(error.status || 500).json({
    success: false,
    errorId,
    message: error.message || 'Internal Server Error',
    ...(config.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Graceful shutdown handling
const server = app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`📊 Process ID: ${process.pid}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log it for monitoring
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit immediately, try to log and recover
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Memory usage monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  if (config.NODE_ENV === 'production') {
    console.log(`📊 Memory Usage: RSS=${memUsageMB.rss}MB, Heap=${memUsageMB.heapUsed}/${memUsageMB.heapTotal}MB, External=${memUsageMB.external}MB`);
  }

  // Force garbage collection if memory usage is high and gc is available
  if (memUsageMB.heapUsed > 1500 && global.gc) {
    console.log('🧹 Forcing garbage collection due to high memory usage');
    global.gc();
  }
}, 60000); // Check every minute

module.exports = app;
