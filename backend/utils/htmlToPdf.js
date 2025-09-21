// Alternative PDF generation using html-pdf-node (lighter alternative)
const generatePDFFromHTML = async (registrationData, eventData, qrCodeDataURL) => {
  try {
    console.log('Generating PDF using HTML template for registration:', registrationData.registrationId);
    
    // Create beautiful HTML content matching the custom design
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
            .header-content {
                flex: 1;
                text-align: center;
                margin: 0 20px;
            }
            .festival-title {
                font-size: 28px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 5px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .event-title {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin-bottom: 8px;
            }
            .event-category {
                font-size: 14px;
                color: #666;
                background: #f3f4f6;
                padding: 4px 12px;
                border-radius: 20px;
                display: inline-block;
                margin-bottom: 10px;
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
            .content {
                margin: 20px 0;
            }
            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 10px;
                border-left: 4px solid #1e40af;
                padding-left: 12px;
                background: #f8fafc;
                padding: 8px 12px;
                border-radius: 4px;
            }
            .status-section {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid #e5e7eb;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 12px;
                color: white;
                background: #10b981;
            }
            .participant-section {
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
            .footer {
                margin-top: 30px;
                text-align: center;
                border-top: 2px solid #1e40af;
                padding-top: 15px;
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
            }
            .footer-title {
                font-weight: bold;
                color: #1e40af;
                font-size: 16px;
            }
            .footer-text {
                color: #374151;
                font-size: 14px;
                margin: 5px 0;
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
        </style>
    </head>
    <body>
        <div class="header">
            <div class="event-logo">
                <img src="https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png" alt="Gardenia 2025 Logo" />
            </div>
            <div class="header-content">
                <div class="festival-title">GARDENIA 2025</div>
                <div class="event-title">${eventData.name || 'Event Registration'}</div>
                <div class="event-category">Registration</div>
                <div style="font-size: 12px; color: #666;">Registration Ticket</div>
            </div>
            <div class="university-logo">
                <img src="https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg" alt="Garden City University Logo" />
            </div>
        </div>

        <div class="content">
            <div class="status-section">
                <div class="section-title">Registration Status</div>
                <div class="status-badge">Registered Successfully</div>
            </div>

            <div class="participant-section">
                <div class="section-title">Participant Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Registration ID</div>
                        <div class="info-value">${registrationData.registrationId}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Event</div>
                        <div class="info-value">${eventData.name || 'Event'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div class="info-value">${registrationData.leader.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Register Number</div>
                        <div class="info-value">${registrationData.leader.registerNumber}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${registrationData.leader.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value">${registrationData.leader.phone}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Registration Date</div>
                        <div class="info-value">${new Date().toLocaleDateString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Payment Status</div>
                        <div class="info-value">${registrationData.paymentStatus || 'PENDING'}</div>
                    </div>
                </div>
            </div>

            <div class="rules-section">
                <div class="rules-title">Event Rules & Regulations</div>
                <ul class="rules-list">
                    ${eventData.rules && eventData.rules.length > 0 ? 
                        eventData.rules.map(rule => `<li>${rule}</li>`).join('') : 
                        `
                        <li>Please arrive 30 minutes before the event start time</li>
                        <li>Bring a valid ID card for verification</li>
                        <li>Show this QR code at the entrance for entry</li>
                        <li>Keep this ticket safe until the event completion</li>
                        <li>Contact organizers for any queries or changes</li>
                        `
                    }
                </ul>
            </div>
        </div>

        <div class="footer">
            <div style="width: 60px; height: 60px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; background: white; border: 2px solid #1e40af;">
                <img src="https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png" alt="Gardenia 2025 Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" />
            </div>
            <div class="footer-title">Gardenia 2025</div>
            <div class="footer-text">Garden City College of Science and Management Studies</div>
            <div class="footer-text">This is your official registration confirmation</div>
            ${eventData.contacts && eventData.contacts.length > 0 ? `
            <div class="footer-text">Event Contact: ${eventData.contacts[0].name} (${eventData.contacts[0].role})</div>
            ${eventData.contacts[0].phone ? `<div class="footer-text">Phone: ${eventData.contacts[0].phone}</div>` : ''}
            ` : '<div class="footer-text">For queries: gardenia2025@gardencitycollege.edu</div>'}
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
