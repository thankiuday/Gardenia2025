// Maintenance mode configuration

export const MAINTENANCE_CONFIG = {
  // Set to true to enable maintenance mode
  isMaintenanceMode: false,
  
  // Maintenance mode settings
  settings: {
    // Custom message for maintenance
    customMessage: "We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.",
    
    // Estimated completion time (optional)
    estimatedCompletion: null, // e.g., "2024-01-15T10:00:00Z"
    
    // Allow specific IP addresses to bypass maintenance mode
    allowedIPs: [
      // Add your IP addresses here
      // "192.168.1.100",
      // "10.0.0.50"
    ],
    
    // Allow specific user agents to bypass (for bots, etc.)
    allowedUserAgents: [
      // "Googlebot",
      // "Bingbot"
    ],
    
    // Show contact information
    showContactInfo: true,
    
    // Show social media links
    showSocialLinks: true,
    
    // Auto-refresh interval in seconds (0 = no auto-refresh)
    autoRefreshInterval: 30,
    
    // Maintenance page title
    pageTitle: "Under Maintenance - Gardenia 2025"
  }
};

// Function to check if maintenance mode should be active
export const isMaintenanceActive = () => {
  // Check environment variable first
  if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
    return true;
  }
  
  // Check local storage for admin override
  if (localStorage.getItem('bypass_maintenance') === 'true') {
    return false;
  }
  
  // Check configuration
  return MAINTENANCE_CONFIG.isMaintenanceMode;
};

// Function to set maintenance mode (for admin use)
export const setMaintenanceMode = (enabled) => {
  MAINTENANCE_CONFIG.isMaintenanceMode = enabled;
  
  // Store in localStorage for persistence
  localStorage.setItem('maintenance_mode', enabled.toString());
  
  // Reload page to apply changes
  window.location.reload();
};

// Function to bypass maintenance mode (for admin use)
export const bypassMaintenance = () => {
  localStorage.setItem('bypass_maintenance', 'true');
  window.location.reload();
};

// Function to get maintenance settings
export const getMaintenanceSettings = () => {
  return MAINTENANCE_CONFIG.settings;
};

// Function to update maintenance settings
export const updateMaintenanceSettings = (newSettings) => {
  MAINTENANCE_CONFIG.settings = {
    ...MAINTENANCE_CONFIG.settings,
    ...newSettings
  };
  
  // Store in localStorage for persistence
  localStorage.setItem('maintenance_settings', JSON.stringify(MAINTENANCE_CONFIG.settings));
};
