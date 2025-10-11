import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import SkeletonLoader from '../components/SkeletonLoader';
import ImageLoader from '../components/ImageLoader';
import S3_ASSETS from '../config/s3-assets';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('No event ID provided');
          setLoading(false);
          return;
        }
        
        
        const response = await axios.get(`${API_ENDPOINTS.EVENTS}/${id}`);
        if (response.data.success) {
          // Map customId to id for frontend compatibility
          const eventWithId = {
            ...response.data.data,
            id: response.data.data.customId
          };
          setEvent(eventWithId);
        } else {
          setError('This event is no longer available or has been removed.');
        }
      } catch (err) {
        setError('We couldn\'t find this event. It may have been removed or there might be a connection issue.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    } else {
      setError('No event ID provided');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Event Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary text-sm sm:text-base min-h-[44px] sm:min-h-[48px] px-6 sm:px-8">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Link 
            to="/events" 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base transition-colors duration-200"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>

        <div className="card p-4 sm:p-6 lg:p-8">
          {/* Event Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                event.category === 'Department Flagship Events' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : event.category === 'Signature Events'
                  ? 'bg-gold-100 text-gold-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {event.category}
              </span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                event.type === 'Individual' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {event.type}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">{event.time}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Team Size: {event.type === 'Group' ? `${event.teamSize.min}-${event.teamSize.max}` : '1'} member{event.teamSize.max > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Event Image */}
          <div className="mb-6 sm:mb-8">
            <div className={`relative w-full bg-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-lg group ${
              event.title === 'Gardenia 2K25: The Rap Arena' 
                ? 'rap-arena-details-container' 
                : 'h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem]'
            }`}>
              <ImageLoader 
                src={event.title === 'Gardenia 2K25: The Rap Arena' ? S3_ASSETS.posters.rapArena : S3_ASSETS.events.getEventImage(event.title)} 
                alt={event.title}
                className="w-full h-full event-details-image object-cover"
                fallbackSrc={S3_ASSETS.events.default}
                lazy={false}
              />
              {/* Image overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">About the Event</h2>
            <div className="prose prose-sm sm:prose-base lg:prose-lg text-gray-600 max-w-none">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 sm:mb-4 leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>


          {/* Event Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Eligibility */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Eligibility</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-blue-800 text-sm sm:text-base leading-relaxed">{event.eligibility}</p>
              </div>
            </div>

            {/* Event Dates */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Event Dates</h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                {event.title === 'Gardenia 2K25: The Rap Arena' ? (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="font-medium text-gray-700 text-sm sm:text-base">Event Date:</span>
                    <span className="text-gray-900 text-sm sm:text-base font-medium">16th October 2025</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">GCU Students:</span>
                      <span className="text-gray-900 text-sm sm:text-base font-medium">{event.dates.inhouse}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">External Participants:</span>
                      <span className="text-gray-900 text-sm sm:text-base font-medium">{event.dates.outside}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rules and Regulations */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Rules & Regulations</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <ul className="space-y-2 sm:space-y-3">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-600 mt-1 flex-shrink-0">•</span>
                    <span className="text-red-800 text-sm sm:text-base leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          {event.title !== 'Gardenia 2K25: The Rap Arena' && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {event.contacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{contact.name}</h4>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded self-start sm:self-auto">
                        {contact.role}
                      </span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-start text-gray-600">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${contact.phone}`} className="hover:text-emerald-600 text-sm sm:text-base transition-colors duration-200 leading-tight">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            {event.registrationOpen === false ? (
              <div className="flex-1 bg-red-100 border border-red-300 text-red-700 text-center min-h-[48px] sm:min-h-[52px] flex items-center justify-center text-sm sm:text-base font-semibold rounded-lg cursor-not-allowed">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Registration Closed
              </div>
            ) : (
              <Link
                to={`/register/${event.id}`}
                className="flex-1 btn-primary text-center min-h-[48px] sm:min-h-[52px] flex items-center justify-center text-sm sm:text-base font-semibold"
              >
                Register Now
              </Link>
            )}
            <Link
              to="/events"
              className="flex-1 btn-secondary text-center min-h-[48px] sm:min-h-[52px] flex items-center justify-center text-sm sm:text-base font-semibold"
            >
              Browse Other Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
