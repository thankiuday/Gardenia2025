import { useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsByCategory } from '../data/events';

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { key: 'All', label: 'All Events' },
    { key: 'Department Flagship Events', label: 'Department Flagship Events' },
    { key: 'Signature Events', label: 'Signature Events' },
    { key: 'Sports Events', label: 'Sports Events' }
  ];

  const getFilteredEvents = () => {
    if (selectedCategory === 'All') {
      return Object.values(eventsByCategory).flat();
    }
    return eventsByCategory[selectedCategory] || [];
  };

  const events = getFilteredEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gardenia 2025 Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of events celebrating the five elements. 
            Find your passion and join the excitement!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="card hover:shadow-xl transition-all duration-300 group">
              <div className="p-6">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      event.category === 'Department Flagship Events' 
                        ? 'bg-blue-100 text-blue-800' 
                        : event.category === 'Signature Events'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }">
                      {event.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.type === 'Individual' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {event.type}
                  </span>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Team Size: {event.type === 'Group' ? `${event.teamSize.min}-${event.teamSize.max}` : '1'} member{event.teamSize.max > 1 ? 's' : ''}
                  </div>

                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                  {event.description}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    to={`/events/${event.id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/register/${event.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}

        {/* Registration Info */}
        <div className="mt-16 bg-primary-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-primary-900 mb-4">
            Ready to Register?
          </h3>
          <p className="text-primary-700 mb-6 max-w-2xl mx-auto">
            Don't miss out on the biggest event of the year! Registration is now open for all events. 
            Choose your favorites and secure your spot today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/events" 
              className="btn-primary bg-primary-600 hover:bg-primary-700"
            >
              Browse All Events
            </Link>
            <Link 
              to="/contact" 
              className="btn-secondary border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
            >
              Get Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
