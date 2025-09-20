const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Gardenia 2025
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Elements – Live the Essence
          </p>
        </div>
      </section>

      {/* Garden City University Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Garden City University
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Garden City University is a premier institution committed to excellence in education and innovation. 
                Located in the heart of Bangalore, we have been nurturing minds and shaping futures for decades.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our university believes in holistic development, combining academic excellence with cultural 
                enrichment and creative expression. Gardenia 2025 is a testament to our commitment to 
                providing students with opportunities to explore, innovate, and excel.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
                  <div className="text-gray-600">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                  <div className="text-gray-600">Programs Offered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Alumni Worldwide</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
                  <div className="text-gray-600">Faculty Members</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-full max-w-sm bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg p-6">
                    <img 
                      src="/logo/garden_city_college_of_sc_and_mgt_studies_logo.jpeg" 
                      alt="Garden City University Logo" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Garden City University</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gardenia Festival Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Gardenia 2025 Festival
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A celebration of creativity, talent, and the five elements that define our existence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🔥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fire</h3>
              <p className="text-gray-600">
                The element of passion, energy, and transformation. Events that ignite creativity and innovation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 text-2xl">💨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Air</h3>
              <p className="text-gray-600">
                The element of freedom, communication, and intellect. Events that inspire thought and expression.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-2xl">🌌</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Space</h3>
              <p className="text-gray-600">
                The element of infinity, consciousness, and possibility. Events that expand horizons and dreams.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Earth</h3>
              <p className="text-gray-600">
                The element of stability, growth, and foundation. Events that ground us in tradition and values.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">💧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Water</h3>
              <p className="text-gray-600">
                The element of flow, emotion, and adaptability. Events that nurture creativity and healing.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Festival Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">3</div>
                <div className="text-gray-600">Event Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">30+</div>
                <div className="text-gray-600">Unique Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">2</div>
                <div className="text-gray-600">Festival Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
                <div className="text-gray-600">Expected Participants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Event Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse range of events across three main categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Department Flagship Events
              </h3>
              <p className="text-gray-600 mb-6">
                Showcase events organized by different departments, highlighting academic excellence and innovation.
              </p>
              <div className="text-sm text-gray-500">
                Events like Psychology Challenge, Fashion Design, Tourism Challenge, and more
              </div>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16a1 1 0 001 1h8a1 1 0 001-1V4M7 8h2v2H7V8zm4 0h2v2h-2V8zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Signature Events
              </h3>
              <p className="text-gray-600 mb-6">
                Cultural and artistic events that celebrate creativity, talent, and self-expression.
              </p>
              <div className="text-sm text-gray-500">
                Dance competitions, singing contests, art exhibitions, and fashion shows
              </div>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sports Events
              </h3>
              <p className="text-gray-600 mb-6">
                Competitive sports events that promote physical fitness, teamwork, and sportsmanship.
              </p>
              <div className="text-sm text-gray-500">
                Cricket, Basketball, Football, Badminton, Chess, and other exciting sports
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the Celebration
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Be part of Gardenia 2025 and experience the magic of the five elements. 
            Register for events, showcase your talent, and create unforgettable memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/events" 
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Explore Events
            </a>
            <a 
              href="/contact" 
              className="btn-secondary border-2 border-white text-green hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
