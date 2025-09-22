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
            <div class="registration-details">
                <div class="section-title">Registration Details</div>
                
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${registrationData.leader.name}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">${registrationData.isGardenCityStudent ? 'Register No:' : 'Registration/Roll No:'}</span>
                    <span class="detail-value">${registrationData.isGardenCityStudent ? registrationData.leader.registerNumber : registrationData.leader.collegeRegisterNumber}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${registrationData.leader.email}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${registrationData.leader.phone}</span>
                </div>
                
                ${!registrationData.isGardenCityStudent ? `
                <div class="detail-row">
                    <span class="detail-label">College/School:</span>
                    <span class="detail-value">${registrationData.leader.collegeName || 'N/A'}</span>
                </div>
                ` : ''}
                
                <div class="detail-row">
                    <span class="detail-label">Registration Date:</span>
                    <span class="detail-value">${new Date().toLocaleDateString()}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Category:</span>
                    <span class="detail-value">${eventData.category || 'General'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Type:</span>
                    <span class="detail-value">${eventData.type || 'Competition'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${eventData.department || 'General'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Date:</span>
                    <span class="detail-value">${eventData.date || 'TBA'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Event Time:</span>
                    <span class="detail-value">${eventData.time || 'TBA'}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${eventData.location || 'Garden City University'}</span>
                </div>
                
                ${registrationData.teamMembers && registrationData.teamMembers.length > 0 ? `
                <div class="team-members">
                    <div class="section-title">Team Members</div>
                    ${registrationData.teamMembers.map(member => `
                        <div class="team-member">
                            <strong>${member.name}</strong><br>
                            ${registrationData.isGardenCityStudent 
                                ? `Register No: ${member.registerNumber}` 
                                : `College/School: ${member.collegeName}<br>Registration/Roll No: ${member.collegeRegisterNumber}`
                            }
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            
            <div class="qr-section">
                <div class="section-title">QR Code</div>
                ${qrCodeDataURL ? `<img src="${qrCodeDataURL}" alt="QR Code" class="qr-code">` : '<div style="color: #6b7280;">QR Code not available</div>'}
                <div class="qr-label">Scan this QR code for verification</div>
            </div>
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
