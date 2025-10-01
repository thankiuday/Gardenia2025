import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import SkeletonLoader from '../components/SkeletonLoader';
import EventCard from '../components/EventCard';
import ErrorMessage from '../components/ErrorMessage';
import S3_ASSETS from '../config/s3-assets';

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Special Rap Arena event data
  const rapArenaEvent = {
    id: 'rap-arena-2025',
    customId: 'rap-arena-2025',
    title: 'Gardenia 2K25: The Rap Arena',
    category: 'Signature Events',
    type: 'Individual',
    teamSize: { min: 1, max: 1 },
    department: 'Student Affairs',
    club: 'Music & Arts Club',
    time: '16th October 2025 | 10.00 AM onwards',
    dates: {
      inhouse: '8th October 2025',
      outside: '16th October 2025'
    },
    description: 'Garden City University Presents GARDENIA 2K25 – The Rap Arena. The Signature Showdown of Gardenia. An elemental clash of words, rhythm, and power. Prizes Worth ₹50,000 (1st – ₹25,000 | 2nd – ₹15,000 | 3rd – ₹10,000). Special Guest: GUBBI – The Face of Kannada Rap. Date: 16th October 2025. Venue: Garden City University, OMR Campus. Gardenia- The Rap Arena – Claim the Crown. Own the Sound.',
    rules: [
      'No profanity or diss on the opponent\'s family or relative. Doing so will lead to a direct disqualification. The participants are expected to respect the decorum of Garden City University.',
      'The judge\'s decision is final and no discrepancies by the contestant will be encouraged.',
      'The Rap Arena competition will consist of 4 rounds:',
      '1. Round 1: Showcase round - Each participant will have a time duration of a maximum of 90 seconds to showcase what they got. They can perform an original rap or a cover. Original is encouraged. The participant should get their own beat for this round on a pen-drive or should mail it prior to the event.',
      '2. Round 2: Freestyle round - The participant is given a random beat and will have to perform for a maximum time duration of 60 seconds. They can either freestyle or perform a pre-written verse. Freestyle is encouraged.',
      '3. Round 3: Rap battle - The participants are paired and will have to battle each other for 2 rounds and the time duration is 60 seconds each. A random beat will be played for each participant. If there is a tie, they will have to go for another round of 30 seconds without the beat (acapella).',
      '4. Round 4: Final battle - The participants are paired and will have to battle each other for 2 rounds and the time duration is 45 seconds each. A random beat will be played for each participant. If there is a tie, they will have to go for another round of 30 seconds with the beat.'
    ],
    eligibility: 'Open to 9th, 10th, PU (11th & 12th), UG, and PG students.',
    contacts: [
      { name: 'Event Coordinator', phone: '9876543210', role: 'SPOC' }
    ],
    isSpecial: true // Flag to identify this as the special event
  };

  const categories = [
    { key: 'All', label: 'All Events' },
    { key: 'Department Flagship Events', label: 'Department Flagship Events' },
    { key: 'Signature Events', label: 'Signature Events' },
    { key: 'Sports Events', label: 'Sports Events' }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.EVENTS);
        if (response.data.success) {
          // Map customId to id for frontend compatibility
          const eventsWithId = response.data.data.map(event => ({
            ...event,
            id: event.customId
          }));
          setEvents(eventsWithId);
        } else {
          setError('We couldn\'t load the events right now. Please refresh the page to try again.');
        }
      } catch (err) {
        setError('We\'re having trouble loading the events. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Always add Rap Arena event at the beginning if it matches the filters
    const shouldShowRapArena = (
      (selectedCategory === 'All' || selectedCategory === 'Signature Events') &&
      (searchTerm.trim() === '' || 
       rapArenaEvent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       rapArenaEvent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       rapArenaEvent.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (shouldShowRapArena) {
      return [rapArenaEvent, ...filtered];
    }

    return filtered;
  }, [events, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            </div>
          </div>
          
          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
              </div>
            ))}
          </div>
          
          {/* Events Grid Skeleton */}
          <div className="grid-responsive">
            <SkeletonLoader type="event-card" count={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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


        {/* Mobile-Friendly Search and Filter */}
        <div className="mb-8 sm:mb-12 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[44px] text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Desktop: Horizontal buttons */}
          <div className="hidden sm:flex flex-wrap justify-center gap-3 lg:gap-4">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
                  selectedCategory === category.key
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Mobile: Dropdown select */}
          <div className="sm:hidden">
            <div className="relative max-w-md mx-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none min-h-[44px] text-base"
              >
                {categories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Section - Remove this after testing */}

        {/* Events Grid */}
        <div className="grid-responsive">
          {filteredEvents.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}

        {/* Registration Info */}
        <div className="mt-16 bg-emerald-50 rounded-xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-4">
            Ready to Register?
          </h3>
          <p className="text-emerald-700 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Don't miss out on the biggest event of the year! Registration is now open for all events. 
            Choose your favorites and secure your spot today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              to="/events" 
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-sm sm:text-base"
            >
              Browse All Events
            </Link>
            <Link 
              to="/contact" 
              className="btn-secondary border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-sm sm:text-base"
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
