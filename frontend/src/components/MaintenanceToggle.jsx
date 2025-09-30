import React, { useState } from 'react';
import { setMaintenanceMode, bypassMaintenance, isMaintenanceActive } from '../utils/maintenance';

const MaintenanceToggle = () => {
  const [isActive, setIsActive] = useState(isMaintenanceActive());

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    setMaintenanceMode(newState);
  };

  const handleBypass = () => {
    bypassMaintenance();
  };

  if (process.env.NODE_ENV !== 'development' && !localStorage.getItem('admin_mode')) {
    return null; // Only show in development or admin mode
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Maintenance Control
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Maintenance Mode:</span>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? 'bg-red-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            Status: {isActive ? (
              <span className="text-red-600 font-medium">Active</span>
            ) : (
              <span className="text-green-600 font-medium">Inactive</span>
            )}
          </div>
          
          {isActive && (
            <button
              onClick={handleBypass}
              className="w-full text-xs bg-blue-100 text-blue-700 py-2 px-3 rounded hover:bg-blue-200 transition-colors"
            >
              Bypass Maintenance
            </button>
          )}
          
          <div className="text-xs text-gray-400 border-t pt-2">
            Only visible in development mode
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceToggle;
