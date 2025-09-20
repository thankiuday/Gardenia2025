const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generatePDF = async (registrationData, eventData) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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
                margin: 20px;
                size: A4;
            }
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background: white;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 15px;
            }
            .logo {
                width: 80px;
                height: 80px;
                background: #8B4513;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
            }
            .event-info {
                text-align: center;
                flex: 1;
                margin: 0 20px;
            }
            .event-title {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }
            .event-category {
                font-size: 16px;
                color: #666;
                margin-bottom: 10px;
            }
            .qr-code {
                width: 100px;
                height: 100px;
                border: 2px solid #333;
            }
            .content {
                margin: 30px 0;
            }
            .section {
                margin-bottom: 25px;
            }
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
                border-left: 4px solid #8B4513;
                padding-left: 10px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }
            .info-item {
                padding: 10px;
                background: #f9f9f9;
                border-radius: 5px;
            }
            .info-label {
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }
            .info-value {
                color: #666;
            }
            .team-members {
                margin-top: 15px;
            }
            .team-member {
                padding: 8px;
                background: #f0f0f0;
                margin-bottom: 5px;
                border-radius: 3px;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                border-top: 2px solid #333;
                padding-top: 15px;
                font-style: italic;
                color: #666;
            }
            .status-badge {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                color: white;
            }
            .status-approved {
                background: #28a745;
            }
            .status-pending {
                background: #ffc107;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">G</div>
            <div class="event-info">
                <div class="event-title">GARDENIA 2025</div>
                <div class="event-category">${eventData.title}</div>
                <div style="font-size: 14px; color: #666;">Registration Confirmation</div>
            </div>
            <div class="qr-code">
                <!-- QR Code will be inserted here -->
                <div style="width: 100%; height: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666;">
                    QR Code
                </div>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <div class="section-title">Registration Details</div>
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
                        <div class="info-label">Registration Fee</div>
                        <div class="info-value">${eventData.fee}</div>
                    </div>
                </div>
            </div>

            <div class="section">
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
            </div>

            ${eventData.type === 'Group' && registrationData.teamMembers.length > 0 ? `
            <div class="section">
                <div class="section-title">Team Members</div>
                <div class="team-members">
                    ${registrationData.teamMembers.map(member => `
                        <div class="team-member">
                            <strong>${member.name}</strong>
                            ${registrationData.isGardenCityStudent ? `<br>Register Number: ${member.registerNumber}` : `<br>College: ${member.collegeName}`}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <div class="section">
                <div class="section-title">Status</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Registration Status</div>
                        <div class="info-value">
                            <span class="status-badge status-approved">${registrationData.status}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Payment Status</div>
                        <div class="info-value">
                            <span class="status-badge ${registrationData.paymentStatus === 'DONE' ? 'status-approved' : 'status-pending'}">
                                ${registrationData.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p><strong>Approved by Garden City University – Gardenia 2025</strong></p>
            <p>For any queries, contact the event organizers</p>
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
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

module.exports = { generatePDF };
