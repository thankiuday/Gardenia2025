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
    throw new Error('Failed to generate QR code');
  }
};

const generateRegistrationId = async () => {
  const Registration = require('../models/Registration');
  const year = new Date().getFullYear();
  let regId;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    regId = `GDN${year}-${random}`;
    
    // Check if this ID already exists
    const existingRegistration = await Registration.findOne({ regId });
    if (!existingRegistration) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    // Fallback: use timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    regId = `GDN${year}-${timestamp}`;
  }
  
  return regId;
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
