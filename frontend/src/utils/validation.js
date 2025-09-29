// Validation utilities for form inputs

/**
 * Validates Indian phone numbers
 * Supports various formats:
 * - 10-digit numbers (9876543210)
 * - With country code (+91 9876543210)
 * - With spaces or hyphens (+91-9876-543-210)
 * - With parentheses (+91 (9876) 543210)
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) return { isValid: false, message: 'Phone number is required' };
  
  // Remove all non-digit characters except +
  const cleanedPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it starts with +91 (India country code)
  if (cleanedPhone.startsWith('+91')) {
    // Should be +91 followed by exactly 10 digits
    if (cleanedPhone.length === 13 && /^\+91\d{10}$/.test(cleanedPhone)) {
      return { isValid: true, message: '' };
    }
    return { isValid: false, message: 'Please enter a valid 10-digit phone number after +91' };
  }
  
  // Check if it's exactly 10 digits
  if (cleanedPhone.length === 10 && /^\d{10}$/.test(cleanedPhone)) {
    return { isValid: true, message: '' };
  }
  
  // Check if it starts with 91 and has 12 digits total
  if (cleanedPhone.startsWith('91') && cleanedPhone.length === 12 && /^91\d{10}$/.test(cleanedPhone)) {
    return { isValid: true, message: '' };
  }
  
  return { 
    isValid: false, 
    message: 'Please enter a valid 10-digit Indian phone number (e.g., 9876543210 or +91 9876543210)' 
  };
};

/**
 * Validates email addresses
 */
export const validateEmail = (email) => {
  if (!email) return { isValid: false, message: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates names (should not be empty and should contain only letters, spaces, and common name characters)
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and periods
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Formats phone number for display (adds +91 prefix if not present)
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/[^\d]/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if it doesn't match expected patterns
};

/**
 * Cleans phone number input (removes spaces, hyphens, parentheses)
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '');
};
