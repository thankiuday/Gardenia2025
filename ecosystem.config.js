// PM2 Configuration for Gardenia 2025 - Hostinger VPS
module.exports = {
  apps: [
    {
      name: 'gardenia2025-backend',
      script: './backend/server.js',
      cwd: '/var/www/gardenia2025',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        CORS_ALLOW_ALL: 'false'
      },
      error_file: '/var/log/pm2/gardenia2025-backend-error.log',
      out_file: '/var/log/pm2/gardenia2025-backend-out.log',
      log_file: '/var/log/pm2/gardenia2025-backend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
