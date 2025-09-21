// Load environment variables
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/gardenia2025',
  JWT_SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? (() => {
    console.error('JWT_SECRET environment variable is required for production');
    process.exit(1);
  })() : 'gardenia2025-dev-secret-key'),
  NODE_ENV: process.env.NODE_ENV || 'development'
};
