// PM2 Configuration for Gardenia 2025 - Hostinger VPS
// IMPORTANT: This file should NOT contain actual credentials
// All sensitive data should be in .env file on the server
module.exports = {
  apps: [
    {
      name: 'gardenia2025-backend',
      script: './backend/server.js',
      cwd: '/var/www/Gardenia2025',
      instances: 1,
      exec_mode: 'fork',
      env_file: '.env', // Load environment variables from .env file
      env: {
        // Application Settings
        NODE_ENV: 'production',
        PORT: 5000,
        
        // Database Configuration - Load from .env
        MONGODB_URL: process.env.MONGODB_URL,
        GARDENIA_2025_MONGODB_USERNAME: process.env.GARDENIA_2025_MONGODB_USERNAME,
        GARDENIA_2025_MONGODB_PASSWORD: process.env.GARDENIA_2025_MONGODB_PASSWORD,
        
        // JWT Configuration - Load from .env
        JWT_SECRET: process.env.JWT_SECRET,
        
        // Frontend and CORS Settings
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://gardenia.gardencity.university',
        CORS_ALLOW_ALL: process.env.CORS_ALLOW_ALL || 'false',
        
        // AWS S3 Configuration - Load from .env
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION || 'us-east-1',
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
        S3_BASE_URL: process.env.S3_BASE_URL,
        
        // PDF Generation Configuration
        PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
        PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD || 'true',
        PDF_GENERATION_METHOD: process.env.PDF_GENERATION_METHOD || 'puppeteer',
        
        // Chrome/Puppeteer Options
        CHROME_ARGS: process.env.CHROME_ARGS || '--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--disable-gpu,--disable-web-security,--disable-features=VizDisplayCompositor',
        
        // Memory and Performance Settings
        NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=2048',
        MAX_MEMORY_RESTART: process.env.MAX_MEMORY_RESTART || '1G'
      },
      error_file: '/var/log/pm2/gardenia2025-backend-error.log',
      out_file: '/var/log/pm2/gardenia2025-backend-out.log',
      log_file: '/var/log/pm2/gardenia2025-backend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=2048',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
