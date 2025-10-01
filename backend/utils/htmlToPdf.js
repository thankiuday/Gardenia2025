// Alternative PDF generation using html-pdf-node (lighter alternative)
const generatePDFFromHTML = async (registrationData, eventData, qrCodeDataURL) => {
  try {
    if (process.env.NODE_ENV === 'development') {
        console.log('Generating PDF using HTML template for registration:', registrationData.registrationId);
    }
    
    // Clear PUPPETEER_EXECUTABLE_PATH on Windows to force bundled Chromium
    if (process.platform === 'win32') {
      delete process.env.PUPPETEER_EXECUTABLE_PATH;
      if (process.env.NODE_ENV === 'development') {
        console.log('Cleared PUPPETEER_EXECUTABLE_PATH for Windows in htmlToPdf');
      }
    }
    
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
                <img src="${process.env.S3_BASE_URL || 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com'}/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg" alt="Garden City University Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" />
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
                    <span class="detail-label">Register No:</span>
                    <span class="detail-value">${registrationData.leader.registerNumber}</span>
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
                    <span class="detail-label">College:</span>
                    <span class="detail-value">${registrationData.leader.collegeName || 'Garden City College'}</span>
                </div>
                
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
                            ${member.registerNumber} | ${member.email}
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
    
    // For now, return the HTML content
    // In a production environment, you might want to use a service like html-pdf-node
    return {
      html: htmlContent,
      type: 'html'
    };
    
  } catch (error) {
    console.error('HTML PDF generation error:', error);
    throw new Error(`Failed to generate HTML PDF: ${error.message}`);
  }
};

module.exports = { generatePDFFromHTML };
