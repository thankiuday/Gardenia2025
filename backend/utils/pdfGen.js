const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generatePDF = async (registrationData, eventData, qrCodeDataURL) => {
  let browser;
  try {
    if (process.env.NODE_ENV === 'development') {
        console.log('Starting PDF generation for registration:', registrationData.regId || registrationData.registrationId);
        console.log('Registration data keys:', Object.keys(registrationData));
        console.log('Event data keys:', Object.keys(eventData));
    }
    
    // Clear PUPPETEER_EXECUTABLE_PATH on Windows to force bundled Chromium
    if (process.platform === 'win32') {
      delete process.env.PUPPETEER_EXECUTABLE_PATH;
      if (process.env.NODE_ENV === 'development') {
        console.log('Cleared PUPPETEER_EXECUTABLE_PATH for Windows');
      }
    }
    
    // Configure Puppeteer for both Windows and Ubuntu VPS
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-default-browser-check',
        '--disable-ipc-flooding-protection',
        '--disable-background-networking',
        '--disable-field-trial-config',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-domain-reliability',
        '--disable-logging',
        '--disable-notifications',
        '--disable-popup-blocking'
      ],
      timeout: 60000,
      protocolTimeout: 60000
    };

    // Detect operating system and configure accordingly
    const isWindows = process.platform === 'win32';
    const isLinux = process.platform === 'linux';
    
    let executablePath = null;
    
    if (isLinux) {
      // For Linux (Ubuntu VPS), try to find Chrome
      executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      
      if (!executablePath) {
        // Try common Chrome paths on Ubuntu
        const possiblePaths = [
          '/usr/bin/google-chrome',
          '/usr/bin/google-chrome-stable',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/opt/google/chrome/chrome'
        ];
        
        const fs = require('fs');
        
        // First try static paths
        for (const staticPath of possiblePaths) {
          if (fs.existsSync(staticPath)) {
            executablePath = staticPath;
            break;
          }
        }
      }
    }
    // For Windows, always use bundled Chromium (don't set executablePath)
    
    if (executablePath && require('fs').existsSync(executablePath)) {
      launchOptions.executablePath = executablePath;
      if (process.env.NODE_ENV === 'development') {
          console.log('Using Chrome executable:', executablePath);
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
          console.log('Using bundled Chromium for PDF generation');
      }
      // Don't set executablePath, let Puppeteer use its bundled Chromium
    }

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    
    // Enable network requests for images
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      request.continue();
    });

    // Create HTML content for the PDF
    try {
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <style>
            @page {
                margin: 20px;
                size: A4;
            }
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                line-height: 1.4;
                border: 1px solid #e5e7eb;
            }
            .header {
                display: flex;
                align-items: flex-start;
                margin-bottom: 30px;
                border-bottom: 2px solid #1e40af;
                padding-bottom: 20px;
                gap: 20px;
            }
            .event-logo {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border: 2px solid #1e40af;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                flex-shrink: 0;
                overflow: hidden;
            }
            .event-logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 6px;
            }
            .header-content {
                flex: 1;
            }
            .event-title {
                font-size: 28px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 8px;
                line-height: 1.2;
            }
            .university-name {
                font-size: 16px;
                color: #059669;
                margin-bottom: 15px;
                font-weight: 500;
            }
            .registration-id {
                font-size: 18px;
                font-weight: bold;
                color: white;
                background: #dc2626;
                padding: 8px 16px;
                border-radius: 8px;
                display: inline-block;
            }
            .university-logo {
                width: 100px;
                height: 100px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                background: white;
                border: 2px solid #1e40af;
            }
            .university-logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 6px;
            }
            .qr-section {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e5e7eb;
                text-align: center;
            }
            .qr-code {
                width: 120px;
                height: 120px;
                border: 2px solid #1e40af;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: white;
                margin: 10px auto;
            }
            .qr-code img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 6px;
            }
            .qr-label {
                font-size: 14px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 10px;
            }
            .qr-description {
                font-size: 12px;
                color: #666;
                margin-top: 8px;
            }
            .content {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 40px;
                margin: 30px 0;
            }
            .registration-details {
                background: #f8fafc;
                padding: 25px;
                border-radius: 8px;
                border-left: 4px solid #1e40af;
            }
            .section-title {
                font-size: 20px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 20px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
            }
            .detail-row {
                display: flex;
                margin-bottom: 10px;
                align-items: center;
            }
            .detail-label {
                font-weight: bold;
                color: #374151;
                min-width: 120px;
                margin-right: 10px;
            }
            .detail-value {
                color: #1f2937;
                flex: 1;
            }
            .status-section {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #e5e7eb;
            }
            .status-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }
            .status-item {
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
            }
            .status-label {
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 12px;
                color: white;
            }
            .status-approved {
                background: #10b981;
            }
            .status-pending {
                background: #f59e0b;
                color: white;
            }
            .event-info-section {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #e5e7eb;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 12px;
            }
            .info-item {
                padding: 10px;
                background: white;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
            }
            .info-label {
                font-weight: bold;
                color: #374151;
                margin-bottom: 4px;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .info-value {
                color: #1f2937;
                font-size: 14px;
            }
            .participant-section {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #e5e7eb;
            }
            .team-members {
                margin-top: 10px;
            }
            .team-member {
                padding: 10px;
                background: white;
                margin-bottom: 8px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
            }
            .rules-section {
                background: #fef3c7;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #f59e0b;
            }
            .rules-title {
                font-size: 16px;
                font-weight: bold;
                color: #92400e;
                margin-bottom: 10px;
                border-left: 4px solid #f59e0b;
                padding-left: 12px;
            }
            .rules-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .rules-list li {
                padding: 6px 0;
                color: #92400e;
                font-size: 13px;
                border-bottom: 1px solid #fbbf24;
                padding-left: 20px;
                position: relative;
            }
            .rules-list li:before {
                content: "•";
                color: #f59e0b;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            .rules-list li:last-child {
                border-bottom: none;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                border-top: 2px solid #1e40af;
                padding-top: 15px;
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
            }
            .footer-logo {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
                background: white;
                border: 2px solid #1e40af;
            }
            .footer-logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 6px;
            }
            .footer-text {
                color: #374151;
                font-size: 14px;
                margin: 5px 0;
            }
            .footer-title {
                font-weight: bold;
                color: #1e40af;
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="event-logo">
                <img src="${process.env.S3_BASE_URL || 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com'}/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg" 
                     alt="Garden City University Logo" 
                     style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; background: #ea580c; color: white; font-size: 24px; font-weight: bold; border-radius: 6px;">
                    GCU
                </div>
            </div>
            <div class="header-content">
                <div class="event-title">${eventData.title}</div>
                <div class="university-name">Garden City University</div>
                <div class="registration-id">Registration ID: ${registrationData.regId || registrationData.registrationId}</div>
            </div>
        </div>

        <div class="content">
            <div class="registration-details">
                <div class="section-title">Registration Details</div>
                
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${registrationData.leader.name}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Register No:</span>
                    <span class="detail-value">${registrationData.leader.registerNumber || registrationData.leader.collegeRegisterNumber}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${registrationData.leader.email}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${registrationData.leader.phone}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Registration Date:</span>
                    <span class="detail-value">${new Date(registrationData.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Category:</span>
                    <span class="detail-value">${eventData.category}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Type:</span>
                    <span class="detail-value">${eventData.type || 'Individual'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${eventData.department || 'General'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Date:</span>
                    <span class="detail-value">${registrationData.finalEventDate || eventData.dates?.outside || 'TBA'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Time:</span>
                    <span class="detail-value">${eventData.time || 'TBA'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">Garden City University, OMR Campus</span>
                </div>
            </div>
            
            <div class="qr-section">
                <div class="section-title">QR Code</div>
                ${qrCodeDataURL ? `<img src="${qrCodeDataURL}" alt="QR Code" class="qr-code">` : '<div style="color: #6b7280;">QR Code not available</div>'}
                <div class="qr-label">Scan this QR code for verification</div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Gardenia 2025 - Garden City University</strong></p>
            <p>This is your official registration confirmation. Please keep this document safe.</p>
            <p>For any queries, contact: gardenia2025@gardencityuniversity.edu</p>
        </div>
    </body>
    </html>
    `;

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    } catch (htmlError) {
      console.error('HTML template generation error:', htmlError);
      throw new Error(`Failed to generate HTML template: ${htmlError.message}`);
    }

    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Wait for all images to load
    try {
      await page.waitForFunction(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
      }, { timeout: 10000 });
    } catch (error) {
      console.log('Images took too long to load, proceeding with PDF generation');
    }

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: true
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('PDF buffer generated, size:', pdfBuffer.length);
      console.log('PDF buffer type:', typeof pdfBuffer);
      console.log('PDF buffer is Buffer:', Buffer.isBuffer(pdfBuffer));
    }

    await browser.close();
    if (process.env.NODE_ENV === 'development') {
        console.log('PDF generated successfully for registration:', registrationData.regId || registrationData.registrationId);
        console.log('PDF buffer size:', pdfBuffer.length, 'bytes');
    }
    return pdfBuffer;

  } catch (error) {
    console.error('PDF generation error:', error);
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error closing browser:', closeError);
        }
      }
    }
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = { generatePDF };
