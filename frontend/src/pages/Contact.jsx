import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import useVisitorTracking from '../hooks/useVisitorTracking';
import useScrollToTop from '../hooks/useScrollToTop';
import { validatePhoneNumber, validateEmail, validateName } from '../utils/validation';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Track visitor
  useVisitorTracking('Contact');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Scroll to top on component mount and when submitted state changes
  useScrollToTop();

  // Scroll to top when form is successfully submitted
  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate the field as user types
    let validationResult = { isValid: true, message: '' };
    
    switch (name) {
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
      [name]: validationResult.isValid ? '' : validationResult.message
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhoneNumber(formData.phone);

    if (!nameValidation.isValid) {
      alert(`Name Error: ${nameValidation.message}`);
      return;
    }

    if (!emailValidation.isValid) {
      alert(`Email Error: ${emailValidation.message}`);
      return;
    }

    if (!phoneValidation.isValid) {
      alert(`Phone Number Error: ${phoneValidation.message}`);
      return;
    }

    if (!formData.message.trim()) {
      alert('Please enter your message.');
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await axios.post(API_ENDPOINTS.CONTACTS, formData);
      
      if (response.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setValidationErrors({ name: '', email: '', phone: '' });
      } else {
        throw new Error('Server returned an error');
      }
    } catch (error) {
      let errorMessage = 'We encountered an issue while sending your message.';
      
      if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server is temporarily unavailable. Please try again in a few moments.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
              Message Sent Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We'll get back to you as soon as possible.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about Gardenia 2025? We're here to help! 
            Get in touch with us for any inquiries or support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            
            {submitError && (
              <ErrorMessage
                title="Failed to Send Message"
                message={submitError}
                type="error"
                onRetry={() => setSubmitError(null)}
                showRetry={true}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={`input-field ${validationErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className={`input-field ${validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className={`input-field ${validationErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your 10-digit phone number (e.g., 9876543210)"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="input-field resize-none"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your inquiry, question, or feedback about Gardenia 2025. We'll get back to you as soon as possible!"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Get in Touch
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">
                      Garden City University<br />
                      16th KM, Old Madras Road<br />
                      Bangalore – 560 049
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">+91 (80) 66487600<br />+91 90-1992-1992</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">pro@gcu.edu.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Links
              </h3>
              
              <div className="space-y-4">
                <a href="/events" className="block text-primary-600 hover:text-primary-700 font-medium">
                  Browse Events
                </a>
                <a href="/about" className="block text-primary-600 hover:text-primary-700 font-medium">
                  About Gardenia 2025
                </a>
                <a href="/register" className="block text-primary-600 hover:text-primary-700 font-medium">
                  Registration Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
