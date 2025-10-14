import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import SkeletonLoader from '../components/SkeletonLoader';

const QRScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allowEntryLoading, setAllowEntryLoading] = useState(false);
  const [denyEntryLoading, setDenyEntryLoading] = useState(false);

  useEffect(() => {
    // Check camera permission on component mount
    checkCameraPermission();
    
    return () => {
      // Cleanup scanner on unmount
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      // Request camera permission with specific constraints for better mobile experience
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Force back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
      setError('We need camera access to scan QR codes. Please allow camera permission and refresh the page.');
    }
  };

  const startScanner = async () => {
    if (!hasPermission) {
      setError('Camera access is needed to scan QR codes. Please allow camera permission.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setScannedData(null);
      setParticipantInfo(null);
      setScanCount(0);

      if (videoRef.current) {
        // Enhanced QR scanner configuration for better accuracy
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => handleScan(result.data),
          {
            // Enhanced scanning options for better accuracy
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Always use back camera
            maxScansPerSecond: 5, // Limit scan frequency to prevent spam
            calculateScanRegion: (video) => {
              // Define a centered scan region for better accuracy
              const smallerSide = Math.min(video.videoWidth, video.videoHeight);
              const scanRegionSize = Math.round(smallerSide * 0.7); // 70% of smaller side
              return {
                x: Math.round((video.videoWidth - scanRegionSize) / 2),
                y: Math.round((video.videoHeight - scanRegionSize) / 2),
                width: scanRegionSize,
                height: scanRegionSize,
              };
            },
            // Enhanced error handling
            onDecodeError: (error) => {
              // Silently handle decode errors to avoid spam
            },
          }
        );
        
        await qrScannerRef.current.start();
        setIsScanning(true);
      }
    } catch (err) {
      setError('We couldn\'t access your camera. Please check your camera permissions and try again.');
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = async (data) => {
    const now = Date.now();
    
    // Prevent rapid successive scans (debounce)
    if (now - lastScanTime < 1000) {
      return;
    }
    
    // Prevent processing if already processing
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);
      setLastScanTime(now);
      setScanCount(prev => prev + 1);
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Parse the QR code data - it contains a JSON object
      let registrationId;
      try {
        // Try to parse as JSON first (new format)
        const qrData = JSON.parse(data.trim());
        registrationId = qrData.regId;
        setScannedData(registrationId);
      } catch (parseError) {
        // Fallback: treat as plain registration ID (old format)
        registrationId = data.trim();
        setScannedData(registrationId);
      }

      if (!registrationId) {
        setError('This doesn\'t appear to be a valid Gardenia2025 QR code. Please check the QR code and try again.');
        return;
      }

      // Validate the registration
      const response = await axios.get(`${API_ENDPOINTS.REGISTER}/validate/${registrationId}`);
      
      if (response.data.success) {
        setParticipantInfo(response.data.data);
        setSuccess('Registration verified successfully!');
        
        // Stop scanning after successful verification
        stopScanner();
      } else {
        setError('This registration is not valid. Please check the QR code and try again.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('We couldn\'t find this registration in our system. Please check the QR code.');
      } else {
        setError('We\'re having trouble verifying this registration. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const allowEntry = async () => {
    if (!participantInfo) return;

    const startTime = Date.now();
    const minLoadingTime = 4000; // Minimum 4 seconds loading time

    try {
      setAllowEntryLoading(true);
      setError('');
      setSuccess('');
      
      // Make API call
      const response = await axios.post(`${API_ENDPOINTS.REGISTER}/entry-log`, {
        registrationId: participantInfo.regId,
        eventId: participantInfo.eventId,
        action: 'ENTRY_ALLOWED',
        timestamp: new Date().toISOString()
      });

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      if (response.data.success) {
        setSuccess('Entry allowed successfully!');
        // Reset after 3 seconds
        setTimeout(() => {
          setParticipantInfo(null);
          setScannedData(null);
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      setError('We couldn\'t log the entry. Please try again.');
    } finally {
      setAllowEntryLoading(false);
    }
  };

  const denyEntry = async () => {
    if (!participantInfo) return;

    const startTime = Date.now();
    const minLoadingTime = 4000; // Minimum 4 seconds loading time

    try {
      setDenyEntryLoading(true);
      setError('');
      setSuccess('');
      
      // Make API call
      const response = await axios.post(`${API_ENDPOINTS.REGISTER}/entry-log`, {
        registrationId: participantInfo.regId,
        eventId: participantInfo.eventId,
        action: 'ENTRY_DENIED',
        timestamp: new Date().toISOString()
      });

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      if (response.data.success) {
        setError('Entry denied and logged.');
        // Reset after 3 seconds
        setTimeout(() => {
          setParticipantInfo(null);
          setScannedData(null);
          setError('');
        }, 3000);
      }
    } catch (err) {
      setError('We couldn\'t log the entry denial. Please try again.');
    } finally {
      setDenyEntryLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setParticipantInfo(null);
    setError('');
    setSuccess('');
    setScanCount(0);
    stopScanner();
  };

  if (hasPermission === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <SkeletonLoader type="form" />
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Camera Permission Required</h2>
          <p className="text-gray-600 mb-4">Please allow camera access to scan QR codes for event entry verification.</p>
          <button
            onClick={checkCameraPermission}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Check Permission Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">QR Code Scanner</h1>
            <p className="text-gray-600 text-xs sm:text-sm">Gardenia 2025 - Event Entry Verification</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
        {/* Scanner Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 sm:mb-6">
          <div className="bg-primary-600 text-white p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold">Camera Scanner</h2>
            <p className="text-primary-100 text-xs sm:text-sm">Point camera at QR code to scan</p>
          </div>
          
          <div className="p-2 sm:p-4">
            {/* Video Container with Enhanced Overlay */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-3 sm:mb-4" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Enhanced Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner brackets for targeting with enhanced animations */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48">
                    {/* Top-left corner */}
                    <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-3 sm:border-t-4 border-l-3 sm:border-l-4 border-emerald-400 animate-pulse" style={{ animation: 'cornerPulse 2s infinite' }}></div>
                    {/* Top-right corner */}
                    <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-3 sm:border-t-4 border-r-3 sm:border-r-4 border-emerald-400 animate-pulse" style={{ animation: 'cornerPulse 2s infinite' }}></div>
                    {/* Bottom-left corner */}
                    <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-3 sm:border-b-4 border-l-3 sm:border-l-4 border-emerald-400 animate-pulse" style={{ animation: 'cornerPulse 2s infinite' }}></div>
                    {/* Bottom-right corner */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-3 sm:border-b-4 border-r-3 sm:border-r-4 border-emerald-400 animate-pulse" style={{ animation: 'cornerPulse 2s infinite' }}></div>
                    
                    {/* Enhanced scanning line animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" style={{ animation: 'scanLine 2s infinite linear' }}></div>
                    
                    {/* Center dot for targeting */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Enhanced instructions overlay */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm backdrop-blur-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="hidden sm:inline">Position QR code within the frame</span>
                      <span className="sm:hidden">Position QR code</span>
                    </div>
                  </div>
                  
                  {/* Top instruction */}
                  <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm backdrop-blur-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="hidden sm:inline">Scanning...</span>
                      <span className="sm:hidden">Scanning</span>
                    </div>
                  </div>
                </div>
              )}
              
              {!isScanning && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-400">Camera ready</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scanner Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  className="flex-1 bg-primary-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[48px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Start Scanning</span>
                  <span className="sm:hidden">Start Scan</span>
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="flex-1 bg-red-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[48px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">Stop Scanning</span>
                  <span className="sm:hidden">Stop Scan</span>
                </button>
              )}
              
              {(scannedData || participantInfo) && (
                <button
                  onClick={resetScanner}
                  className="flex-1 bg-gray-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[48px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              )}
            </div>

            {/* Enhanced Scan Status */}
            {isScanning && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm border border-emerald-200 shadow-sm">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Scanning... ({scanCount} attempts)</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Position QR code within the targeting frame</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-800 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-emerald-800 text-sm sm:text-base">{success}</p>
            </div>
          </div>
        )}

        {/* Enhanced Loading State */}
        {loading && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div 
                className="rounded-full h-6 w-6 sm:h-8 sm:w-8 border-3 sm:border-4 border-blue-200 border-t-blue-600"
                style={{
                  animation: 'spin 1s linear infinite'
                }}
              ></div>
              <div className="text-center">
                <p className="text-blue-800 font-semibold text-base sm:text-lg">Processing Registration...</p>
                <p className="text-blue-600 text-xs sm:text-sm mt-1">Please wait while we verify the participant</p>
              </div>
            </div>
          </div>
        )}

        {/* Participant Information - Wrapped in relative container for overlay */}
        {participantInfo && (
          <div className="relative">
            {/* Entry Action Loading Overlay - Absolute positioned */}
            {(allowEntryLoading || denyEntryLoading) && (
              <div className="absolute inset-0 z-50 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-emerald-600 text-white p-3 sm:p-4">
                  <h2 className="text-base sm:text-lg font-semibold">Processing Entry Action</h2>
                  <p className="text-emerald-100 text-xs sm:text-sm">Please wait while we log your decision</p>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <div 
                    className="rounded-full h-12 w-12 sm:h-16 sm:w-16 border-3 sm:border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-3 sm:mb-4"
                    style={{
                      animation: 'spin 1s linear infinite'
                    }}
                  ></div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {allowEntryLoading ? 'Allowing Entry...' : 'Denying Entry...'}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {allowEntryLoading 
                      ? 'Logging entry approval and updating records...' 
                      : 'Logging entry denial and updating records...'
                    }
                  </p>
                </div>
              </div>
            )}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold">Participant Verified</h2>
              <p className="text-emerald-100 text-xs sm:text-sm">Registration details confirmed</p>
            </div>
            
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Event Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Event Information</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Event:</span>
                      <span className="font-medium text-sm sm:text-base break-words">{participantInfo.eventId?.title || 'Event'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Category:</span>
                      <span className="font-medium text-sm sm:text-base">{participantInfo.eventId?.category || 'General'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Date:</span>
                      <span className="font-medium text-sm sm:text-base">{participantInfo.finalEventDate || 'TBA'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Registration ID:</span>
                      <span className="font-medium font-mono text-xs sm:text-sm break-all bg-gray-100 px-2 py-1 rounded">{participantInfo.regId || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Event Type:</span>
                      <span className="font-medium text-sm sm:text-base">{participantInfo.eventId?.type || 'Competition'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Department:</span>
                      <span className="font-medium text-sm sm:text-base">{participantInfo.eventId?.department || 'General'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Time:</span>
                      <span className="font-medium text-sm sm:text-base">{participantInfo.eventId?.time || 'TBA'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Location:</span>
                      <span className="font-medium text-sm sm:text-base break-words">{participantInfo.eventId?.location || 'Garden City University'}</span>
                    </div>
                  </div>
                </div>

                {/* Participant Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Participant Details</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Name:</span>
                      <span className="font-medium text-sm sm:text-base">{participantInfo.leader?.name || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Email:</span>
                      <span className="font-medium text-xs sm:text-sm break-all">{participantInfo.leader?.email || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Phone:</span>
                      <span className="font-medium text-sm sm:text-base">{participantInfo.leader?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Institution:</span>
                      <span className="font-medium text-sm sm:text-base break-words">
                        {participantInfo.isGardenCityStudent 
                          ? `Garden City University (${participantInfo.leader?.registerNumber || 'N/A'})`
                          : (participantInfo.leader?.collegeName || 'Garden City University')
                        }
                      </span>
                    </div>
                    {!participantInfo.isGardenCityStudent && (
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-600 text-xs sm:text-sm">Registration/Roll No:</span>
                        <span className="font-medium text-sm sm:text-base">{participantInfo.leader?.collegeRegisterNumber || 'N/A'}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-600 text-xs sm:text-sm">Status:</span>
                      <span className="font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          participantInfo.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {participantInfo.status || 'PENDING'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members (if any) */}
              {participantInfo.teamMembers && participantInfo.teamMembers.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3 sm:mb-4">Team Members</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {participantInfo.teamMembers.map((member, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="font-medium text-gray-900 text-sm sm:text-base break-words">{member.name || 'N/A'}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                          {participantInfo.isGardenCityStudent 
                            ? `Reg: ${member.registerNumber || 'N/A'}`
                            : `College/School: ${member.collegeName || 'N/A'}`
                          }
                        </div>
                        {!participantInfo.isGardenCityStudent && (
                          <div className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                            Reg/Roll: {member.collegeRegisterNumber || 'N/A'}
                          </div>
                        )}
                        {member.email && (
                          <div className="text-xs sm:text-sm text-gray-500 mt-1 break-all">
                            Email: {member.email}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={allowEntry}
                  disabled={allowEntryLoading || denyEntryLoading}
                  className="flex-1 bg-emerald-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[48px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Allow Entry</span>
                  <span className="sm:hidden">Allow</span>
                </button>
                <button
                  onClick={denyEntry}
                  disabled={allowEntryLoading || denyEntryLoading}
                  className="flex-1 bg-red-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[48px]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">Deny Entry</span>
                  <span className="sm:hidden">Deny</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        )}


        {/* Instructions */}
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gold-800 mb-2">Scanner Instructions</h3>
          <ul className="text-gold-700 text-xs sm:text-sm space-y-1">
            <li>• Ensure good lighting for better QR code detection</li>
            <li>• Hold the camera steady and point directly at the QR code</li>
            <li>• Position the QR code within the targeting frame</li>
            <li>• Allow camera permission when prompted</li>
            <li>• Verify participant details before allowing entry</li>
            <li>• All entry actions are logged for security purposes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;