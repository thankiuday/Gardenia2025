// Simple PDF generation fallback without Puppeteer
const generateSimplePDF = async (registrationData, eventData) => {
  try {
    
    // Create a simple HTML content that can be converted to PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 20px; }
            .event-title { font-size: 24px; font-weight: bold; color: #1e40af; }
            .registration-id { font-size: 18px; color: #059669; margin: 10px 0; }
            .details { margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="event-title">Gardenia 2025</div>
            <div class="registration-id">Registration ID: ${registrationData.registrationId}</div>
        </div>
        
        <div class="details">
            <div class="detail-row">
                <span class="label">Event:</span> ${eventData.name || 'Event'}
            </div>
            <div class="detail-row">
                <span class="label">Participant Name:</span> ${registrationData.leader.name}
            </div>
            <div class="detail-row">
                <span class="label">Register Number:</span> ${registrationData.leader.registerNumber}
            </div>
            <div class="detail-row">
                <span class="label">Email:</span> ${registrationData.leader.email}
            </div>
            <div class="detail-row">
                <span class="label">Phone:</span> ${registrationData.leader.phone}
            </div>
            <div class="detail-row">
                <span class="label">Registration Date:</span> ${new Date().toLocaleDateString()}
            </div>
            <div class="detail-row">
                <span class="label">Payment Status:</span> ${registrationData.paymentStatus || 'PENDING'}
            </div>
        </div>
        
        <div class="footer">
            <p>This is your registration confirmation for Gardenia 2025.</p>
            <p>Please keep this for your records.</p>
        </div>
    </body>
    </html>
    `;
    
    // Return the HTML content as a string
    // In a real implementation, you might want to use a different PDF library
    return {
      html: htmlContent,
      type: 'html'
    };
    
  } catch (error) {
    console.error('Simple PDF generation error:', error);
    throw new Error(`Failed to generate simple PDF: ${error.message}`);
  }
};

module.exports = { generateSimplePDF };
