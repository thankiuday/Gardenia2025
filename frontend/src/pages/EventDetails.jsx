import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import SkeletonLoader from '../components/SkeletonLoader';

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
        console.error('EventDetails: Error fetching event:', err);
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/events" 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>

        <div className="card p-8">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.category === 'Department Flagship Events' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : event.category === 'Signature Events'
                  ? 'bg-gold-100 text-gold-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.type === 'Individual' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {event.type}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.time}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Team Size: {event.type === 'Group' ? `${event.teamSize.min}-${event.teamSize.max}` : '1'} member{event.teamSize.max > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>


          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Eligibility */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Eligibility</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">{event.eligibility}</p>
              </div>
            </div>

            {/* Event Dates */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Dates</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">GCU Students:</span>
                  <span className="text-gray-900">{event.dates.inhouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Outside Students:</span>
                  <span className="text-gray-900">{event.dates.outside}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rules and Regulations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Rules & Regulations</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <ul className="space-y-3">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">•</span>
                    <span className="text-red-800">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.contacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
                      {contact.role}
                    </span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${contact.phone}`} className="hover:text-emerald-600">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Link
              to={`/register/${event.id}`}
              className="flex-1 btn-primary text-center"
            >
              Register Now
            </Link>
            <Link
              to="/events"
              className="flex-1 btn-secondary text-center"
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
