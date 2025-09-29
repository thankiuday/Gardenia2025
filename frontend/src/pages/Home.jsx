import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import S3_ASSETS from '../config/s3-assets';
import SkeletonLoader from '../components/SkeletonLoader';
import EventCard from '../components/EventCard';
import useVisitorTracking from '../hooks/useVisitorTracking';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track visitor
  useVisitorTracking('Home');

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
          setError('Failed to load events');
        }
      } catch (err) {
        console.error('Home: Error fetching events:', err);
        setError('Failed to load events');
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
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [events, selectedCategory, searchTerm]);

  const categories = [
    { key: 'All', label: 'All Events', icon: '🎯', color: 'bg-primary-600' },
    { key: 'Department Flagship Events', label: 'Department Flagship Events', icon: '🏆', color: 'bg-primary-600' },
    { key: 'Signature Events', label: 'Signature Events', icon: '⭐', color: 'bg-red-600' },
    { key: 'Sports Events', label: 'Sports Events', icon: '⚽', color: 'bg-green-600' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-700 to-primary-900 text-white overflow-hidden hero-mobile">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover hero-video"
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
        
        <div className="relative container-responsive py-8 sm:py-12 lg:py-16" id="main-content">
          <div className="text-center">
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full border-2 border-emerald-400/30 mb-6 sm:mb-8 fade-in relative overflow-hidden group">
              <div 
                className="absolute inset-0 border-2 border-transparent rounded-full opacity-30"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #059669, #047857, #10b981)',
                  backgroundSize: '300% 300%',
                  animation: 'movingBorder 3s ease-in-out infinite',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'xor',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor'
                }}
              ></div>
              <span className="relative z-10 text-xs sm:text-sm font-bold text-white/90">October 15th, 16th & 17th 2025</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-green-200 to-primary-200 bg-clip-text text-transparent leading-tight fade-in animate-delay-100">
              Gardenia 2025
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-4 sm:mb-6 font-bold text-white/95 fade-in animate-delay-200">
              Elements – Live the Essence
            </p>
            
            <p className="text-responsive mb-8 sm:mb-12 max-w-4xl mx-auto text-white/85 leading-relaxed fade-in animate-delay-300 font-bold">
              Join us for an extraordinary celebration of creativity, talent, and innovation. 
              Experience the five elements through our diverse range of events that will inspire, 
              challenge, and transform you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center fade-in animate-delay-400">
              <Link 
                to="/events" 
                className="group relative px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-emerald-500 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:bg-emerald-600 w-full sm:w-auto text-center min-h-[44px] flex items-center justify-center border-2 border-emerald-400/30 overflow-hidden"
              >
                <div 
                  className="absolute inset-0 border-2 border-transparent rounded-xl opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, #10b981, #059669, #047857, #10b981)',
                    backgroundSize: '300% 300%',
                    animation: 'movingBorder 3s ease-in-out infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor'
                  }}
                ></div>
                <span className="relative z-10 font-bold">Explore Events</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/about" 
                className="group relative px-6 sm:px-8 lg:px-10 py-3 sm:py-4 border-2 border-white/40 text-white font-semibold text-sm sm:text-base lg:text-lg rounded-xl backdrop-blur-sm hover:bg-white/15 hover:border-white/60 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center min-h-[44px] flex items-center justify-center overflow-hidden"
              >
                <div 
                  className="absolute inset-0 border-2 border-transparent rounded-xl opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, #ffffff, #e5e7eb, #d1d5db, #ffffff)',
                    backgroundSize: '300% 300%',
                    animation: 'movingBorder 3s ease-in-out infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor'
                  }}
                ></div>
                <span className="relative z-10 font-bold">Learn More</span>
              </Link>
            </div>
            
            {/* Stats Preview */}
            <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border-2 border-green-400/30 scale-in animate-delay-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/30 to-green-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div 
                  className="absolute inset-0 border-2 border-transparent rounded-xl opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, #4ade80, #10b981, #059669, #4ade80)',
                    backgroundSize: '300% 300%',
                    animation: 'movingBorder 3s ease-in-out infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor'
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">35+</div>
                  <div className="text-xs sm:text-sm font-bold text-green-300">Events</div>
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border-2 border-blue-400/30 scale-in animate-delay-200 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-primary-400/30 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div 
                  className="absolute inset-0 border-2 border-transparent rounded-xl opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, #3b82f6, #1d4ed8, #1e40af, #3b82f6)',
                    backgroundSize: '300% 300%',
                    animation: 'movingBorder 3s ease-in-out infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor'
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">3</div>
                  <div className="text-xs sm:text-sm font-bold text-primary-200">Categories</div>
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border-2 border-red-400/30 scale-in animate-delay-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/30 to-red-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div 
                  className="absolute inset-0 border-2 border-transparent rounded-xl opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, #ef4444, #dc2626, #b91c1c, #ef4444)',
                    backgroundSize: '300% 300%',
                    animation: 'movingBorder 3s ease-in-out infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor'
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">3</div>
                  <div className="text-xs sm:text-sm font-bold text-red-300">Days</div>
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border-2 border-purple-400/30 scale-in animate-delay-400 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-violet-400/30 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div 
                  className="absolute inset-0 border-2 border-transparent rounded-xl opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, #a855f7, #7c3aed, #6d28d9, #a855f7)',
                    backgroundSize: '300% 300%',
                    animation: 'movingBorder 3s ease-in-out infinite',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'xor',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor'
                  }}
                ></div>
                <div className="relative z-10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">1000+</div>
                  <div className="text-xs sm:text-sm font-bold text-primary-200">Participants</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-400/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-400/20 rounded-full blur-lg"></div>
      </section>

      {/* The Essence of Gardenia 2K25 Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-10 w-24 h-24 bg-green-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gold-200/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-emerald-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container-responsive relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-primary-100 to-green-100 rounded-full border-2 border-primary-200/50 mb-6 fade-in">
                <span className="text-sm font-bold text-primary-700">The Essence of Gardenia 2K25</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 fade-in animate-delay-100">
                <span className="bg-gradient-to-r from-primary-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                  "Elements"
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed fade-in animate-delay-200">
                Gardenia has always been about celebrating the identity of Garden City University, and this year's theme, "Elements," reflects exactly who we are.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8 fade-in animate-delay-300">
                <div className="space-y-6">
                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Unity in Diversity</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Just as Earth, Water, Fire, Air, and Space are the forces that hold the world together, our university is held together by the incredible diversity of its departments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability & Coexistence</h3>
                        <p className="text-gray-600 leading-relaxed">
                          "Elements" also speaks on sustainability and coexistence, reminding us that creativity, professionalism, and sportsmanship can only grow when we value balance, respect diversity, and nurture harmony.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl border-2 border-primary-200/50 shadow-lg">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">More Than Just a Theme</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Hence Gardenia Elements is more than just a theme; it is both a celebration of our identity and a call to build a sustainable, unified future.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual Elements */}
              <div className="relative fade-in animate-delay-400">
                {/* Elements Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Earth Element */}
                  <div className="group relative p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-2 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-element-float">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Earth</h4>
                      <p className="text-sm text-gray-600">Foundation & Growth</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Water Element */}
                  <div className="group relative p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-element-float">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">💧</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Water</h4>
                      <p className="text-sm text-gray-600">Flow & Adaptability</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Fire Element */}
                  <div className="group relative p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl border-2 border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-element-float">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🔥</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Fire</h4>
                      <p className="text-sm text-gray-600">Passion & Energy</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Air Element */}
                  <div className="group relative p-6 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-2xl border-2 border-sky-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-element-float">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">💨</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Air</h4>
                      <p className="text-sm text-gray-600">Freedom & Innovation</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Space Element - Centered */}
                <div className="mt-6 flex justify-center">
                  <div className="group relative p-6 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-element-float">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🌌</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Space</h4>
                      <p className="text-sm text-gray-600">Infinite Possibilities</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16 sm:mt-20 fade-in animate-delay-500">
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/events" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-green-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative z-10">Explore the Elements</span>
                </Link>
                
                <Link 
                  to="/about" 
                  className="group relative px-8 py-4 border-2 border-primary-600 text-primary-600 font-bold text-lg rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
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

          {/* Modern Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
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
                      className="block w-full pl-10 pr-3 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base placeholder-gray-500 min-h-[44px]"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 min-h-[44px]"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="sm:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base bg-white min-h-[44px]"
                  >
                    {categories.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Results Summary */}
              {(searchTerm || selectedCategory !== 'All') && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    {searchTerm ? (
                      <>Found <span className="font-semibold text-primary-600">{events.length}</span> event{events.length !== 1 ? 's' : ''} matching "<span className="font-semibold">{searchTerm}</span>"</>
                    ) : (
                      <>Showing <span className="font-semibold text-primary-600">{events.length}</span> event{events.length !== 1 ? 's' : ''} in <span className="font-semibold">{categories.find(c => c.key === selectedCategory)?.label}</span></>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid-responsive">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card">
                  <SkeletonLoader />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Failed to load events</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No events match your search for "${searchTerm}". Try adjusting your search terms.`
                  : 'No events available in this category at the moment.'
                }
              </p>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid-responsive">
              {filteredEvents.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  index={index}
                />
              ))}
            </div>
          )}

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
                {events.length}
              </div>
              <div className="text-sm sm:text-base text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">3</div>
              <div className="text-sm sm:text-base text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">3</div>
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
