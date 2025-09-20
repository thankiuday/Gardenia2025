import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsByCategory } from '../data/events';
import S3_ASSETS from '../config/s3-assets';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('Department Flagship Events');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(eventsByCategory[selectedCategory] || []);
  }, [selectedCategory]);

  const categories = [
    { key: 'Department Flagship Events', label: 'Department Flagship Events', color: 'bg-primary-600' },
    { key: 'Signature Events', label: 'Signature Events', color: 'bg-red-600' },
    { key: 'Sports Events', label: 'Sports Events', color: 'bg-green-600' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={S3_ASSETS.video.hero} type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-primary-700/20 to-primary-900/30"></div>
        </div>
        
        <div className="relative container-responsive py-16 sm:py-20 lg:py-24" id="main-content">
          <div className="text-center">
            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 fade-in">
              <span className="text-sm font-medium text-white/90">March 15-16, 2025</span>
            </div>
            
            <h1 className="heading-responsive mb-6 bg-gradient-to-r from-white via-green-200 to-primary-200 bg-clip-text text-transparent leading-tight fade-in animate-delay-100">
              Gardenia 2025
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl mb-6 font-light text-white/95 fade-in animate-delay-200">
              Elements – Live the Essence
            </p>
            
            <p className="text-responsive mb-8 sm:mb-12 max-w-4xl mx-auto text-white/85 leading-relaxed fade-in animate-delay-300">
              Join us for an extraordinary celebration of creativity, talent, and innovation. 
              Experience the five elements through our diverse range of events that will inspire, 
              challenge, and transform you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center fade-in animate-delay-400">
              <Link 
                to="/events" 
                className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-green-500 text-white font-semibold text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:bg-green-600 w-full sm:w-auto text-center"
              >
                <span className="relative z-10">Explore Events</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/about" 
                className="group px-8 sm:px-10 py-3 sm:py-4 border-2 border-white/40 text-white font-semibold text-base sm:text-lg rounded-xl backdrop-blur-sm hover:bg-white/15 hover:border-white/60 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
              >
                Learn More
              </Link>
            </div>
            
            {/* Stats Preview */}
            <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 scale-in animate-delay-100">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">35+</div>
                <div className="text-xs sm:text-sm text-green-300">Events</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 scale-in animate-delay-200">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">3</div>
                <div className="text-xs sm:text-sm text-primary-200">Categories</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 scale-in animate-delay-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">2</div>
                <div className="text-xs sm:text-sm text-red-300">Days</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 scale-in animate-delay-400">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">1000+</div>
                <div className="text-xs sm:text-sm text-primary-200">Participants</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-400/20 rounded-full blur-lg"></div>
      </section>

      {/* Event Categories Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container-responsive">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="heading-responsive text-gray-900 mb-4">
              Event Categories
            </h2>
            <p className="text-responsive text-gray-600 max-w-2xl mx-auto">
              Discover events across different categories and find your perfect match
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  selectedCategory === category.key
                    ? `${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid-responsive">
            {events.map((event, index) => (
              <div key={event.id} className="card fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      event.type === 'Individual' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs text-gray-500">
                      {event.department}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/events/${event.id}`}
                      className="flex-1 btn-secondary text-sm px-3 sm:px-4 py-2 text-center"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/register/${event.id}`}
                      className="flex-1 btn-primary text-sm px-3 sm:px-4 py-2 text-center"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Events Button */}
          <div className="text-center mt-8 sm:mt-12">
            <Link 
              to="/events" 
              className="btn-primary px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
                {Object.values(eventsByCategory).flat().length}
              </div>
              <div className="text-sm sm:text-base text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">3</div>
              <div className="text-sm sm:text-base text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">2</div>
              <div className="text-sm sm:text-base text-gray-600">Event Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-sm sm:text-base text-gray-600">Expected Participants</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
