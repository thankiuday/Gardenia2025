// Proper PDF generation using html-pdf-node (lighter alternative to Puppeteer)
const htmlPdf = require('html-pdf-node');

const generateProperPDF = async (registrationData, eventData, qrCodeDataURL) => {
  try {
    console.log('Generating proper PDF for registration:', registrationData.registrationId);
    
    // Create HTML content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            @page {
                margin: 15px;
                size: A4;
            }
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                line-height: 1.4;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
                border-bottom: 3px solid #1e40af;
                padding-bottom: 15px;
            }
            .event-logo {
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
            .event-info {
                flex: 1;
                margin-left: 20px;
            }
            .event-title {
                font-size: 24px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 5px;
            }
            .event-subtitle {
                font-size: 16px;
                color: #059669;
                margin-bottom: 10px;
            }
            .registration-id {
                font-size: 18px;
                font-weight: bold;
                color: #dc2626;
                background: #fef2f2;
                padding: 8px 12px;
                border-radius: 6px;
                display: inline-block;
            }
            .content {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 30px;
                margin: 30px 0;
            }
            .registration-details {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #1e40af;
            }
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 15px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 5px;
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
            .qr-section {
                text-align: center;
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                border: 2px dashed #d1d5db;
            }
            .qr-code {
                max-width: 200px;
                height: auto;
                margin: 10px 0;
            }
            .qr-label {
                font-size: 14px;
                color: #6b7280;
                margin-top: 10px;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 15px;
            }
            .team-members {
                margin-top: 15px;
            }
            .team-member {
                background: #f3f4f6;
                padding: 10px;
                margin: 5px 0;
                border-radius: 4px;
                border-left: 3px solid #059669;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="event-logo">
                <div style="font-size: 12px; text-align: center; color: #1e40af; font-weight: bold;">
                    GARDENIA<br>2025
                </div>
            </div>
            <div class="event-info">
                <div class="event-title">${eventData.title || eventData.name || 'Event Registration'}</div>
                <div class="event-subtitle">Garden City University</div>
                <div class="registration-id">Registration ID: ${registrationData.registrationId}</div>
            </div>
        </div>
        
        <div class="content">
            <h3>Participant Verified</h3>
            <p>Registration details confirmed</p>
            
            <h3>Event Information</h3>
            <p><strong>Event:</strong> ${eventData.title || 'N/A'}</p>
            <p><strong>Category:</strong> ${eventData.category || 'N/A'}</p>
            <p><strong>Date:</strong> ${eventData.date || '8th October 2025'}</p>
            <p><strong>Registration ID:</strong> ${registrationData.registrationId || registrationData.regId}</p>
            <p><strong>Event Type:</strong> ${eventData.type || 'N/A'}</p>
            <p><strong>Department:</strong> ${eventData.department || 'N/A'}</p>
            
            <h3>Participant Details</h3>
            <p><strong>Name:</strong> ${registrationData.leader.name}</p>
            <p><strong>Email:</strong> ${registrationData.leader.email}</p>
            <p><strong>Phone:</strong> ${registrationData.leader.phone}</p>
            <p><strong>Institution:</strong> Garden City University (${registrationData.leader.registerNumber})</p>
            
            <h3>Entry Decision</h3>
            <p><strong>Allow Entry</strong> | <strong>Deny Entry</strong></p>
            
            <h3>QR Code Verification</h3>
            ${qrCodeDataURL ? `<img src="${qrCodeDataURL}" alt="QR Code" style="max-width: 200px; height: auto;">` : '<p>QR Code not available</p>'}
            <p>Scan this QR code for verification</p>
        </div>
        
        <div class="footer">
            <p><strong>Gardenia 2025</strong> - Garden City University</p>
            <p>This is your official registration confirmation. Please keep this document safe.</p>
            <p>For any queries, contact: gardenia2025@gardencityuniversity.edu</p>
        </div>
    </body>
    </html>
    `;
    
    // PDF generation options
    const options = {
      format: 'A4',
      margin: {
        top: '15px',
        right: '15px',
        bottom: '15px',
        left: '15px'
      },
      printBackground: true,
      displayHeaderFooter: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    };
    
    // Generate PDF
    const file = { content: htmlContent };
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    
    console.log('Proper PDF generated successfully for registration:', registrationData.registrationId);
    return pdfBuffer;
    
  } catch (error) {
    console.error('Proper PDF generation error:', error);
    throw new Error(`Failed to generate proper PDF: ${error.message}`);
  }
};

module.exports = { generateProperPDF };
