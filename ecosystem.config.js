// PM2 Configuration for Gardenia 2025 - Hostinger VPS
module.exports = {
  apps: [
    {
      name: 'gardenia2025-backend',
      script: './backend/server.js',
      cwd: '/var/www/Gardenia2025',
      instances: 1,
      exec_mode: 'fork',
      env: {
        // Application Settings
        NODE_ENV: 'production',
        PORT: 5000,
        
        // Database Configuration
        MONGODB_URI: 'your_mongodb_connection_string',
        GARDENIA_2025_MONGODB_USERNAME: 'your_mongodb_username',
        GARDENIA_2025_MONGODB_PASSWORD: 'your_mongodb_password',
        
        // JWT Configuration
        JWT_SECRET: 'your_jwt_secret_key',
        
        // Frontend and CORS Settings
        FRONTEND_URL: 'https://your-domain.com',
        CORS_ALLOW_ALL: 'false',
        
        // AWS S3 Configuration
        AWS_ACCESS_KEY_ID: 'your_aws_access_key_id',
        AWS_SECRET_ACCESS_KEY: 'your_aws_secret_access_key',
        AWS_REGION: 'us-east-1',
        AWS_S3_BUCKET: 'your_s3_bucket_name',
        S3_BASE_URL: 'https://your-bucket.s3.us-east-1.amazonaws.com',
        
        // PDF Generation Configuration
        PUPPETEER_EXECUTABLE_PATH: '/usr/bin/google-chrome-stable',
        PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
        PDF_GENERATION_METHOD: 'puppeteer',
        
        // Chrome/Puppeteer Options
        CHROME_ARGS: '--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--disable-gpu,--disable-web-security,--disable-features=VizDisplayCompositor',
        
        // Memory and Performance Settings
        NODE_OPTIONS: '--max-old-space-size=2048',
        MAX_MEMORY_RESTART: '1G'
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
