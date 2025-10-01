import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS, getFullUrl } from '../config/api';
import useVisitorTracking from '../hooks/useVisitorTracking';
import RegistrationButton from '../components/RegistrationButton';
import ErrorMessage from '../components/ErrorMessage';
import { validatePhoneNumber, validateEmail, validateName } from '../utils/validation';

const Registration = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showStudentTypeModal, setShowStudentTypeModal] = useState(true);
  const [isGardenCityStudent, setIsGardenCityStudent] = useState(null);
  
  // Track visitor
  useVisitorTracking(`Registration-${eventId}`);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    leader: {
      name: '',
      registerNumber: '',
      collegeName: '',
      collegeRegisterNumber: '',
      email: '',
      phone: ''
    },
    teamMembers: []
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    leader: {
      name: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.EVENTS}/${eventId}`);
        if (response.data.success) {
          // Map customId to id for frontend compatibility
          const eventWithId = {
            ...response.data.data,
            id: response.data.data.customId
          };
          setEvent(eventWithId);
          
          // Scroll to top when page loads and modal should appear
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }, 100);
        } else {
          navigate('/events');
        }
      } catch (error) {
        navigate('/events');
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, navigate]);

  const handleStudentTypeSelection = (isGCUStudent) => {
    setIsGardenCityStudent(isGCUStudent);
    setShowStudentTypeModal(false);
    // Scroll to top when modal closes
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 300); // Wait for modal exit animation
  };

  const addTeamMember = () => {
    // Check if we can add more team members based on event type and current count
    const canAddMember = 
      (event.type === 'Group' && formData.teamMembers.length < event.teamSize.max - 1) ||
      (event.type === 'Individual/Group' && formData.teamMembers.length < event.teamSize.max - 1);
    
    if (canAddMember) {
      setFormData({
        ...formData,
        teamMembers: [
          ...formData.teamMembers,
          { name: '', registerNumber: '', collegeName: '', collegeRegisterNumber: '' }
        ]
      });
    }
  };

  const removeTeamMember = (index) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index)
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      leader: {
        ...formData.leader,
        [field]: value
      }
    });

    // Validate the field as user types
    let validationResult = { isValid: true, message: '' };
    
    switch (field) {
      case 'name':
        validationResult = validateName(value);
        break;
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'phone':
        validationResult = validatePhoneNumber(value);
        break;
      default:
        break;
    }

    setValidationErrors({
      ...validationErrors,
      leader: {
        ...validationErrors.leader,
        [field]: validationResult.isValid ? '' : validationResult.message
      }
    });
  };

  const validateForm = () => {
    // Validate required fields
    const nameValidation = validateName(formData.leader.name);
    const emailValidation = validateEmail(formData.leader.email);
    const phoneValidation = validatePhoneNumber(formData.leader.phone);

    if (!nameValidation.isValid) {
      alert(`Name Error: ${nameValidation.message}`);
      return false;
    }

    if (!emailValidation.isValid) {
      alert(`Email Error: ${emailValidation.message}`);
      return false;
    }

    if (!phoneValidation.isValid) {
      alert(`Phone Number Error: ${phoneValidation.message}`);
      return false;
    }

    if (isGardenCityStudent && !formData.leader.registerNumber) {
      alert('Please enter your Garden City University register number');
      return false;
    }

    if (!isGardenCityStudent && !formData.leader.collegeName) {
      alert('Please enter the name of your college/school or institution');
      return false;
    }

    if (!isGardenCityStudent && !formData.leader.collegeRegisterNumber) {
      alert('Please enter your college registration/roll number');
      return false;
    }

    // Handle team size validation for different event types
    if (event.type === 'Group' || event.type === 'Individual/Group') {
      const totalMembers = 1 + formData.teamMembers.length;
      if (totalMembers < event.teamSize.min || totalMembers > event.teamSize.max) {
        if (event.type === 'Individual/Group') {
          alert(`You can participate individually or with a team of ${event.teamSize.max} members maximum. Current team size: ${totalMembers}`);
        } else {
          alert(`Your team must have between ${event.teamSize.min} and ${event.teamSize.max} members (including the team leader)`);
        }
        return false;
      }
    } else if (event.type === 'Individual') {
      // For Individual events, ensure no team members are added
      if (formData.teamMembers.length > 0) {
        alert('This is an individual event. Please remove any team members.');
        return false;
      }
    }

    // Validate team members for Group and Individual/Group events
    if (event.type === 'Group' || event.type === 'Individual/Group') {
      for (let i = 0; i < formData.teamMembers.length; i++) {
        const member = formData.teamMembers[i];
        if (!member.name) {
          alert(`Please enter the name for team member ${i + 1}`);
          return false;
        }
        if (isGardenCityStudent && !member.registerNumber) {
          alert(`Please enter the Garden City University register number for team member ${i + 1}`);
          return false;
        }
        if (!isGardenCityStudent && !member.collegeName) {
          alert(`Please enter the college/school name for team member ${i + 1}`);
          return false;
        }
        if (!isGardenCityStudent && !member.collegeRegisterNumber) {
          alert(`Please enter the college registration/roll number for team member ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      throw new Error('Please fill in all required fields correctly.');
    }

    setLoading(true);

    try {
      const payload = {
        eventId: event.id, // Use string ID from static data
        isGardenCityStudent,
        leader: formData.leader,
        teamMembers: formData.teamMembers
      };

      const response = await axios.post(API_ENDPOINTS.REGISTER, payload);
      
      if (response.data.success) {
        setRegistrationData(response.data.data);
        setRegistrationComplete(true);
        
        // Scroll to top when registration is complete
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }, 500);
        
        // Auto-download ticket if PDF URL is available
        if (response.data.data.pdfUrl) {
          setTimeout(async () => {
            // Track auto-download
            try {
              await axios.post(API_ENDPOINTS.TICKET_DOWNLOADS, {
                registrationId: response.data.data.registrationId,
                downloadType: 'auto'
              });
            } catch (trackingError) {
              // Don't fail the download if tracking fails
            }

            // Force download using a more reliable method
            try {
              const registrationId = response.data.data.registrationId;
              if (!registrationId) {
                alert('Your ticket is ready! Please click the download button below to get your ticket.');
                return;
              }
              
              const downloadUrl = `${API_ENDPOINTS.REGISTRATIONS}/${registrationId}/pdf`;
              const fileName = `Gardenia2025-Ticket-${registrationId}.pdf`;
              
              // Method 1: Try direct link with download attribute
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = fileName;
              link.style.display = 'none';
              link.target = '_blank';
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
            } catch (downloadError) {
              // Show user a message
              alert('Your ticket is ready! Please click the download button below to get your ticket.');
            }
          }, 1000); // Small delay to ensure UI is ready
        }
      } else {
        throw new Error('Registration could not be completed. Please check your information and try again.');
      }
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error('We encountered an issue while processing your registration. Please try again in a few moments.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading-spinner"></div>
          <p className="text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (registrationComplete && registrationData) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="card p-4 sm:p-6 lg:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Registration Successful!
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Registration Details</h3>
              <div className="space-y-2 sm:space-y-3 text-left">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="font-medium text-sm sm:text-base">Registration ID:</span>
                  <span className="font-mono text-sm sm:text-base break-all sm:break-normal">{registrationData.registrationId}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="font-medium text-sm sm:text-base">Event:</span>
                  <span className="text-sm sm:text-base">{registrationData.event}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="font-medium text-sm sm:text-base">Status:</span>
                  <span className="text-green-600 font-medium text-sm sm:text-base">Registered Successfully</span>
                </div>
              </div>
            </div>

            {registrationData.pdfUrl && (
              <div className="mb-4 sm:mb-6">
                <button
                  onClick={() => {
                    try {
                      const registrationId = registrationData.registrationId;
                      if (!registrationId) {
                        alert('Download failed. Registration ID not found.');
                        return;
                      }
                      
                      const downloadUrl = `${API_ENDPOINTS.REGISTRATIONS}/${registrationId}/pdf`;
                      const fileName = `Gardenia2025-Ticket-${registrationId}.pdf`;
                      
                      // Create direct download link
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = fileName;
                      link.style.display = 'none';
                      link.target = '_blank';
                      
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                    } catch (error) {
                      alert('Download failed. Please try again.');
                    }
                  }}
                  className="btn-primary inline-flex items-center justify-center w-full sm:w-auto min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-semibold px-4 sm:px-6"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Ticket
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/events')}
                className="btn-secondary w-full sm:w-auto min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-semibold px-4 sm:px-6"
              >
                Browse More Events
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-primary w-full sm:w-auto min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-semibold px-4 sm:px-6"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container-responsive max-w-4xl">
        {/* Student Type Modal */}
        <AnimatePresence>
          {showStudentTypeModal && (
            <motion.div 
              className="fixed inset-0 bg-gradient-to-br from-gray-50 to-emerald-50 bg-opacity-95 flex items-start justify-center z-50 p-2 sm:p-4 pt-4 sm:pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onAnimationStart={() => {
                // Ensure page is scrolled to top when modal starts appearing
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth'
                });
              }}
            >
              <motion.div 
                className="bg-white rounded-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full mx-2 sm:mx-0 shadow-2xl mt-2 sm:mt-4"
                initial={{ y: -100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -100, opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 25,
                  duration: 0.5 
                }}
              >
              {/* Close button for better UX */}
              <button
                onClick={() => navigate('/events')}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close modal and go to events"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Modal Content */}
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </motion.div>
                
                <motion.h2 
                  className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight px-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Are you a Garden City University student?
                </motion.h2>
                
                <motion.p 
                  className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed px-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  This helps us determine the correct event date and requirements for your registration.
                </motion.p>
                
                <motion.div 
                  className="space-y-2 sm:space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <motion.button
                    onClick={() => handleStudentTypeSelection(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Yes, I'm a GCU student
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleStudentTypeSelection(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base border border-gray-300 hover:border-gray-400"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      No, I'm an external participant
                    </div>
                  </motion.button>
                </motion.div>
                
                {/* Additional info for better UX */}
                <motion.div 
                  className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <p className="text-xs sm:text-sm text-gray-500">
                    {event.title === 'Gardenia 2K25: The Rap Arena' ? (
                      <>
                        <strong>All Participants:</strong> Event on 16th October 2025
                      </>
                    ) : (
                      <>
                        <strong>GCU Students:</strong> Event on {event.dates.inhouse}<br />
                        <strong>External Participants:</strong> Event on {event.dates.outside}
                      </>
                    )}
                  </p>
                </motion.div>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Form */}
        <div className="card p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="heading-responsive text-gray-900 mb-3 sm:mb-4">
              Register for {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
              <span className="px-2 sm:px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
                {event.category}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                {event.type}
              </span>
            </div>
          </div>

          <form className="space-y-6 sm:space-y-8">
            {/* Leader Information */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {event.type === 'Group' ? 'Team Leader' : 
                 event.type === 'Individual/Group' ? 'Participant (Team Leader if adding members)' : 
                 'Participant'} Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className={`input-field ${validationErrors.leader.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.leader.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                  {validationErrors.leader.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.leader.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className={`input-field ${validationErrors.leader.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.leader.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                  {validationErrors.leader.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.leader.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className={`input-field ${validationErrors.leader.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    value={formData.leader.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your 10-digit phone number (e.g., 9876543210)"
                    autoComplete="tel"
                  />
                  {validationErrors.leader.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.leader.phone}</p>
                  )}
                </div>

                {isGardenCityStudent ? (
                  <div className="form-group">
                    <label className="form-label">
                      Register Number *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.leader.registerNumber}
                      onChange={(e) => handleInputChange('registerNumber', e.target.value)}
                      placeholder="24MCAR107"
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        College/School Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={formData.leader.collegeName}
                        onChange={(e) => handleInputChange('collegeName', e.target.value)}
                        placeholder="Enter your college/school name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Registration/Roll Number *
                      </label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={formData.leader.collegeRegisterNumber}
                        onChange={(e) => handleInputChange('collegeRegisterNumber', e.target.value)}
                        placeholder="Enter your college registration/roll number"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Team Members (for Group and Individual/Group events) */}
            {(event.type === 'Group' || event.type === 'Individual/Group') && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {event.type === 'Individual/Group' ? 'Team Members (Optional)' : 'Team Members'} ({formData.teamMembers.length + 1}/{event.teamSize.max})
                    </h3>
                    {event.type === 'Individual/Group' && (
                      <p className="text-sm text-gray-600 mt-1">
                        You can participate individually or add team members (up to {event.teamSize.max} total)
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                        <h4 className="font-medium text-gray-900">
                          Team Member {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-600 hover:text-red-800 text-sm w-full sm:w-auto text-left sm:text-right"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                            placeholder="Enter team member's name"
                          />
                        </div>

                        {isGardenCityStudent ? (
                          <div className="form-group">
                            <label className="form-label">
                              Register Number *
                            </label>
                            <input
                              type="text"
                              required
                              className="input-field"
                              value={member.registerNumber}
                              onChange={(e) => updateTeamMember(index, 'registerNumber', e.target.value)}
                              placeholder="24MCAR107"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="form-group">
                              <label className="form-label">
                                College/School Name *
                              </label>
                              <input
                                type="text"
                                required
                                className="input-field"
                                value={member.collegeName}
                                onChange={(e) => updateTeamMember(index, 'collegeName', e.target.value)}
                                placeholder="Enter college/school name"
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Registration/Roll Number *
                              </label>
                              <input
                                type="text"
                                required
                                className="input-field"
                                value={member.collegeRegisterNumber}
                                onChange={(e) => updateTeamMember(index, 'collegeRegisterNumber', e.target.value)}
                                placeholder="Enter registration/roll number"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Member Button - Show based on event type and current count */}
                {formData.teamMembers.length < event.teamSize.max - 1 && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {event.type === 'Individual/Group' ? 'Add Team Member (Optional)' : 'Add Team Member'}
                    </button>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    {event.type === 'Individual/Group' ? (
                      <>
                        <strong>Participation:</strong> You can participate individually or with a team of up to {event.teamSize.max} members
                      </>
                    ) : (
                      <>
                        <strong>Team Size:</strong> Minimum {event.teamSize.min}, Maximum {event.teamSize.max} members
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Individual Event Information */}
            {event.type === 'Individual' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-green-800">
                    <strong>Individual Event:</strong> This is a solo competition. No team members required.
                  </p>
                </div>
              </div>
            )}

            {/* Event Date Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Event Date</h4>
              <p className="text-sm text-gray-600">
                {event.title === 'Gardenia 2K25: The Rap Arena' 
                  ? '16th October 2025' 
                  : (isGardenCityStudent ? event.dates.inhouse : event.dates.outside)
                }
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <RegistrationButton
                onSubmit={handleSubmit}
                disabled={loading}
                className="flex-1"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
