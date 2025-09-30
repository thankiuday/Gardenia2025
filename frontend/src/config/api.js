// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get full URL for file downloads
export const getFullUrl = (path) => {
  // If path is already a full URL (starts with http), return as is
  if (path && path.startsWith('http')) {
    return path;
  }
  // Otherwise, prepend the API base URL
  return `${API_BASE_URL}${path || ''}`;
};

export const API_ENDPOINTS = {
  EVENTS: `${API_BASE_URL}/api/events`,
  REGISTER: `${API_BASE_URL}/api/register`,
  REGISTRATIONS: `${API_BASE_URL}/api/register`,
  CONTACTS: `${API_BASE_URL}/api/contact`,
  ADMIN: {
    LOGIN: `${API_BASE_URL}/api/admin/login`,
    STATS: `${API_BASE_URL}/api/admin/stats`,
    REGISTRATIONS: `${API_BASE_URL}/api/admin/registrations`,
    CONTACTS: `${API_BASE_URL}/api/admin/contacts`,
  },
  TICKET_DOWNLOADS: `${API_BASE_URL}/api/ticket-downloads/track`,
  VISITORS: `${API_BASE_URL}/api/visitors/track`,
};

export default API_BASE_URL;

