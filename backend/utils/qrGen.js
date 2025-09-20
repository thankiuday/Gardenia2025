const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(data), {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

const generateRegistrationId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `GDN${year}-${random}`;
};

const createQRPayload = (registrationData, eventData) => {
  return {
    regId: registrationData.regId,
    name: registrationData.leader.name,
    event: eventData.title,
    type: eventData.type,
    affiliation: registrationData.isGardenCityStudent ? 'GCU' : 'Outside',
    status: registrationData.status,
    paymentStatus: registrationData.paymentStatus,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  generateQRCode,
  generateRegistrationId,
  createQRPayload
};
