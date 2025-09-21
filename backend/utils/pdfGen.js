const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generatePDF = async (registrationData, eventData, qrCodeDataURL) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Create HTML content for the PDF
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
            .event-logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 6px;
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
                margin: 20px 0;
            }
            .section {
                margin-bottom: 20px;
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
                <img src="https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png" alt="Gardenia 2025 Logo" />
            </div>
            <div class="header-content">
                <div class="festival-title">GARDENIA 2025</div>
                <div class="event-title">${eventData.title}</div>
                <div class="event-category">${eventData.category}</div>
                <div style="font-size: 12px; color: #666;">Registration Ticket</div>
            </div>
            <div class="university-logo">
                <img src="https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg" alt="Garden City University Logo" />
            </div>
        </div>

        <div class="content">
            <div class="status-section">
                <div class="section-title">Registration Status</div>
                <div class="status-grid">
                    <div class="status-item">
                        <div class="status-label">Registration</div>
                        <div class="status-badge status-approved">Registered Successfully</div>
                    </div>
                </div>
            </div>

            <div class="qr-section">
                <div class="qr-label">Registration QR Code</div>
                <div class="qr-code">
                    <img src="${qrCodeDataURL}" alt="QR Code" />
                </div>
                <div class="qr-description">
                    Scan this QR code for event verification and entry
                </div>
            </div>

            <div class="event-info-section">
                <div class="section-title">Event Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Registration ID</div>
                        <div class="info-value">${registrationData.regId}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Event Date</div>
                        <div class="info-value">${registrationData.finalEventDate}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Event Type</div>
                        <div class="info-value">${eventData.type}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Department</div>
                        <div class="info-value">${eventData.department}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Time</div>
                        <div class="info-value">${eventData.time}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Team Size</div>
                        <div class="info-value">${eventData.teamSize.min}-${eventData.teamSize.max} members</div>
                    </div>
                </div>
            </div>

            <div class="participant-section">
                <div class="section-title">Participant Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">${registrationData.isGardenCityStudent ? 'Register Number' : 'College Name'}</div>
                        <div class="info-value">${registrationData.isGardenCityStudent ? registrationData.leader.registerNumber : registrationData.leader.collegeName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Name</div>
                        <div class="info-value">${registrationData.leader.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value">${registrationData.leader.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone</div>
                        <div class="info-value">${registrationData.leader.phone}</div>
                    </div>
                </div>

                ${eventData.type === 'Group' && registrationData.teamMembers.length > 0 ? `
                <div class="team-members">
                    <div style="font-weight: bold; color: #374151; margin-bottom: 8px; font-size: 14px;">Team Members:</div>
                    ${registrationData.teamMembers.map(member => `
                        <div class="team-member">
                            <strong>${member.name}</strong>
                            ${registrationData.isGardenCityStudent ? `<br><small>Register Number: ${member.registerNumber}</small>` : `<br><small>College: ${member.collegeName}</small>`}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>

            <div class="rules-section">
                <div class="rules-title">Rules & Regulations</div>
                <ul class="rules-list">
                    ${eventData.rules.map(rule => `<li>${rule}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="footer">
            <div class="footer-logo">
                <img src="https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg" alt="Garden City University Logo" />
            </div>
            <div class="footer-title">Garden City University</div>
            <div class="footer-text">Gardenia 2025 - Elemental Festival</div>
            <div class="footer-text">For any queries, contact the event organizers</div>
            <div class="footer-text" style="font-size: 12px; color: #666; margin-top: 10px;">
                This is an official registration ticket. Please bring this ticket and valid ID to the event.
            </div>
        </div>
    </body>
    </html>
    `;

    await page.setContent(htmlContent);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    return pdfBuffer;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = { generatePDF };
