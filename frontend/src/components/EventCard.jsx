import { memo } from 'react';
import { Link } from 'react-router-dom';
import ImageLoader from './ImageLoader';
import S3_ASSETS from '../config/s3-assets';

const EventCard = memo(({ event, index = 0 }) => {
  return (
    <div 
      className="card hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Event Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden flex-shrink-0 image-container">
        <ImageLoader 
          src={S3_ASSETS.events.getEventImage(event.title)} 
          alt={event.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300 event-card-image"
          fallbackSrc={S3_ASSETS.events.default}
          lazy={true}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.type === 'Individual' 
              ? 'bg-orange-100 text-orange-800' 
              : event.type === 'Individual/Group'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {event.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.category === 'Department Flagship Events' 
              ? 'bg-emerald-100 text-emerald-800' 
              : event.category === 'Signature Events'
              ? 'bg-gold-100 text-gold-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {event.category.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Card Content - Flex to push buttons to bottom */}
      <div className="p-6 flex flex-col flex-1">
        {/* Event Title - Fixed height */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h3>

        {/* Event Details - Fixed height */}
        <div className="space-y-2 mb-6 min-h-[8rem]">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{event.time}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Team Size: {
              event.type === 'Individual' 
                ? '1 member'
                : event.type === 'Individual/Group'
                ? `${event.teamSize.min}-${event.teamSize.max} members (Singles/Doubles)`
                : `${event.teamSize.min}-${event.teamSize.max} members`
            }</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{event.department}</span>
          </div>

          {/* Contact Information */}
          {event.contacts && event.contacts.length > 0 && (
            <div className="space-y-1">
              {event.contacts.slice(0, 2).map((contact, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{contact.name}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full flex-shrink-0">
                        {contact.role === 'SPOC' ? 'SPOC' : contact.role === 'Student In-Charge' ? 'Student' : contact.role.split(' ')[0]}
                      </span>
                    </div>
                    {contact.phone && (
                      <div className="text-xs text-gray-500 truncate">
                        📞 {contact.phone}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {event.contacts.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{event.contacts.length - 2} more contact{event.contacts.length - 2 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions - Pushed to bottom */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <Link
            to={`/events/${event.id}`}
            className="flex-1 btn-secondary text-center text-sm sm:text-base"
          >
            View Details
          </Link>
          <Link
            to={`/register/${event.id}`}
            className="flex-1 btn-primary text-center text-sm sm:text-base"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
