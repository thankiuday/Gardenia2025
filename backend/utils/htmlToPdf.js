// Alternative PDF generation using html-pdf-node (lighter alternative)
const generatePDFFromHTML = async (registrationData, eventData, qrCodeDataURL) => {
  try {
    console.log('Generating PDF using HTML template for registration:', registrationData.registrationId);
    
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
            <!-- Participant Verification Status -->
            <div class="verification-section" style="background: #d1fae5; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                        <span style="color: white; font-size: 12px; font-weight: bold;">✓</span>
                    </div>
                    <h3 style="margin: 0; color: #065f46; font-size: 18px;">Participant Verified</h3>
                </div>
                <p style="margin: 0; color: #065f46; font-size: 14px;">Registration details confirmed</p>
            </div>

            <!-- Event Information -->
            <div class="event-info-section" style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">Event Information</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="detail-row">
                        <span class="detail-label">Event:</span>
                        <span class="detail-value">${eventData.title || 'N/A'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${eventData.category || 'N/A'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${eventData.date || '8th October 2025'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Registration ID:</span>
                        <span class="detail-value">${registrationData.registrationId || registrationData.regId}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Event Type:</span>
                        <span class="detail-value">${eventData.type || 'N/A'}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${eventData.department || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <!-- Participant Details -->
            <div class="participant-details-section" style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">Participant Details</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${registrationData.leader.name}</span>
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
                        <span class="detail-label">Institution:</span>
                        <span class="detail-value">Garden City University (${registrationData.leader.registerNumber})</span>
                    </div>
                </div>
            </div>

            <!-- Entry Decision -->
            <div class="entry-decision-section" style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #f59e0b;">
                <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px;">Entry Decision</h3>
                <div style="display: flex; gap: 20px;">
                    <button style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">Allow Entry</button>
                    <button style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">Deny Entry</button>
                </div>
            </div>
            
            <!-- QR Code Section -->
            <div class="qr-section" style="text-align: center; background: #f9fafb; padding: 20px; border-radius: 8px; border: 2px dashed #d1d5db;">
                <div class="section-title" style="margin-bottom: 15px; color: #1f2937; font-size: 16px; font-weight: bold;">QR Code Verification</div>
                ${qrCodeDataURL ? `<img src="${qrCodeDataURL}" alt="QR Code" class="qr-code" style="max-width: 200px; height: auto; margin: 10px 0;">` : '<div style="color: #6b7280;">QR Code not available</div>'}
                <div class="qr-label" style="font-size: 14px; color: #6b7280; margin-top: 10px;">Scan this QR code for verification</div>
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
