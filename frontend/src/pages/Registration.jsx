import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allEvents } from '../data/events';
import axios from 'axios';

const Registration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showStudentTypeModal, setShowStudentTypeModal] = useState(true);
  const [isGardenCityStudent, setIsGardenCityStudent] = useState(null);
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
    const foundEvent = allEvents.find(e => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      navigate('/events');
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
      alert('Please fill in all required fields for the leader');
      return false;
    }

    if (isGardenCityStudent && !formData.leader.registerNumber) {
      alert('Please provide your register number');
      return false;
    }

    if (!isGardenCityStudent && !formData.leader.collegeName) {
      alert('Please provide your college name');
      return false;
    }

    if (event.type === 'Group') {
      const totalMembers = 1 + formData.teamMembers.length;
      if (totalMembers < event.teamSize.min || totalMembers > event.teamSize.max) {
        alert(`Team size must be between ${event.teamSize.min} and ${event.teamSize.max} members`);
        return false;
      }

      for (let i = 0; i < formData.teamMembers.length; i++) {
        const member = formData.teamMembers[i];
        if (!member.name) {
          alert(`Please provide name for team member ${i + 1}`);
          return false;
        }
        if (isGardenCityStudent && !member.registerNumber) {
          alert(`Please provide register number for team member ${i + 1}`);
          return false;
        }
        if (!isGardenCityStudent && !member.collegeName) {
          alert(`Please provide college name for team member ${i + 1}`);
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
        eventId: event._id || eventId, // Use MongoDB ID if available
        isGardenCityStudent,
        leader: formData.leader,
        teamMembers: formData.teamMembers
      };

      const response = await axios.post('http://localhost:5000/api/register', payload);
      
      if (response.data.success) {
        setRegistrationData(response.data.data);
        setRegistrationComplete(true);
      } else {
        alert('Registration failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
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
                  <span className="text-yellow-600 font-medium">{registrationData.paymentStatus}</span>
                </div>
              </div>
            </div>

            {registrationData.pdfUrl && (
              <div className="mb-6">
                <a
                  href={`http://localhost:5000${registrationData.pdfUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Ticket
                </a>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
                Are you a Garden City University student?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center">
                This helps us determine the correct event date and requirements for your registration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => handleStudentTypeSelection(true)}
                  className="flex-1 btn-primary text-sm sm:text-base"
                >
                  Yes, I'm a GCU student
                </button>
                <button
                  onClick={() => handleStudentTypeSelection(false)}
                  className="flex-1 btn-secondary text-sm sm:text-base"
                >
                  No, I'm from outside
                </button>
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
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {event.fee}
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
                      placeholder="Enter your register number"
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
                  {formData.teamMembers.length < event.teamSize.max - 1 && (
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="btn-secondary text-sm w-full sm:w-auto"
                    >
                      Add Member
                    </button>
                  )}
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
                              placeholder="Enter register number"
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
