import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, getFullUrl } from '../config/api';
import { downloadTicket, showDownloadInstructions } from '../utils/downloadHelper';
import useVisitorTracking from '../hooks/useVisitorTracking';

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
      email: '',
      phone: ''
    },
    teamMembers: []
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
        } else {
          navigate('/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
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
  };

  const addTeamMember = () => {
    if (event.type === 'Group' && formData.teamMembers.length < event.teamSize.max - 1) {
      setFormData({
        ...formData,
        teamMembers: [
          ...formData.teamMembers,
          { name: '', registerNumber: '', collegeName: '' }
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
  };

  const validateForm = () => {
    if (!formData.leader.name || !formData.leader.email || !formData.leader.phone) {
      alert('Please complete all required information for the team leader (Name, Email, and Phone Number)');
      return false;
    }

    if (isGardenCityStudent && !formData.leader.registerNumber) {
      alert('Please enter your Garden City University register number');
      return false;
    }

    if (!isGardenCityStudent && !formData.leader.collegeName) {
      alert('Please enter the name of your college or institution');
      return false;
    }

    if (event.type === 'Group') {
      const totalMembers = 1 + formData.teamMembers.length;
      if (totalMembers < event.teamSize.min || totalMembers > event.teamSize.max) {
        alert(`Your team must have between ${event.teamSize.min} and ${event.teamSize.max} members (including the team leader)`);
        return false;
      }

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
          alert(`Please enter the college name for team member ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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
                console.error('Registration ID is undefined');
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
              
              console.log('✅ Auto-download initiated via direct link');
            } catch (downloadError) {
              console.error('Auto-download failed:', downloadError);
              // Show user a message
              alert('Your ticket is ready! Please click the download button below to get your ticket.');
            }
          }, 1000); // Small delay to ensure UI is ready
        }
      } else {
        alert('Registration could not be completed. Please check your information and try again.');
      }
    } catch (error) {
      alert('We encountered an issue while processing your registration. Please try again in a few moments.');
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Registration Successful!
            </h1>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Registration Details</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">Registration ID:</span>
                  <span className="font-mono">{registrationData.registrationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Event:</span>
                  <span>{registrationData.event}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">Registered Successfully</span>
                </div>
              </div>
            </div>

            {registrationData.pdfUrl && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    try {
                      const registrationId = registrationData.registrationId;
                      if (!registrationId) {
                        console.error('Registration ID is undefined');
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
                      
                      console.log('✅ Manual download initiated via direct link');
                    } catch (error) {
                      console.error('Manual download failed:', error);
                      alert('Download failed. Please try again.');
                    }
                  }}
                  className="btn-primary inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Ticket
                </button>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/events')}
                className="btn-secondary"
              >
                Browse More Events
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
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
        {showStudentTypeModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-emerald-50 bg-opacity-95 flex items-start justify-center z-50 p-2 sm:p-4 pt-8 sm:pt-16">
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full mx-2 sm:mx-0 shadow-2xl mt-4 sm:mt-0">
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight px-1">
                  Are you a Garden City University student?
                </h2>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed px-1">
                  This helps us determine the correct event date and requirements for your registration.
                </p>
                
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => handleStudentTypeSelection(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Yes, I'm a GCU student
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleStudentTypeSelection(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base border border-gray-300 hover:border-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      No, I'm from outside
                    </div>
                  </button>
                </div>
                
                {/* Additional info for better UX */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500">
                    <strong>GCU Students:</strong> Event on 8th October 2025<br />
                    <strong>External Students:</strong> Event on 16-17 October 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

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

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Leader Information */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                {event.type === 'Group' ? 'Team Leader' : 'Participant'} Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.leader.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={formData.leader.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={formData.leader.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
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
                      value={formData.leader.registerNumber}
                      onChange={(e) => handleInputChange('registerNumber', e.target.value)}
                      placeholder="24MCAR107"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">
                      College Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={formData.leader.collegeName}
                      onChange={(e) => handleInputChange('collegeName', e.target.value)}
                      placeholder="Enter your college name"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Team Members (for Group events) */}
            {event.type === 'Group' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Team Members ({formData.teamMembers.length + 1}/{event.teamSize.max})
                  </h3>
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
                          <div className="form-group">
                            <label className="form-label">
                              College Name *
                            </label>
                            <input
                              type="text"
                              required
                              className="input-field"
                              value={member.collegeName}
                              onChange={(e) => updateTeamMember(index, 'collegeName', e.target.value)}
                              placeholder="Enter college name"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Member Button - Always visible at bottom */}
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
                      Add Team Member
                    </button>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Team Size:</strong> Minimum {event.teamSize.min}, Maximum {event.teamSize.max} members
                  </p>
                </div>
              </div>
            )}

            {/* Event Date Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Event Date</h4>
              <p className="text-sm text-gray-600">
                {isGardenCityStudent ? event.dates.inhouse : event.dates.outside}
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
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Register Now'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
