import { Link } from 'react-router-dom';
import S3_ASSETS from '../config/s3-assets';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* Garden City University Section */}
      <section className="py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About Garden City University
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mb-8"></div>
            
            {/* AboutGCU Image */}
            <div className="max-w-4xl mx-auto mb-8">
              <img 
                src={S3_ASSETS.logos.aboutGCU} 
                alt="Garden City University" 
                className="w-full h-auto object-contain object-center rounded-lg shadow-lg"
                style={{ imageRendering: 'high-quality' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Content */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Garden City University (GCU), located in Bengaluru, Karnataka, is a State Private University established in 2013 through the Karnataka State Act No. 47 of 2013 and is recognised by the University Grants Commission (UGC), Government of India. The University's legacy traces back to the esteemed Garden City College, founded in 1992 under the Garden City Education Trust by Dr. Joseph V.G.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Over the years, it has been home to students from 81 countries, making it a truly global learning destination. GCU offers a diverse range of undergraduate, postgraduate, and doctoral programmes across its various schools, including Management, Commerce, Sciences, Media, Engineering, Health Sciences, Languages, Social Sciences, Hospitality, and Fashion & Apparel Design.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-lg text-gray-700 leading-relaxed">
                  With a strong emphasis on experiential learning, GCU promotes active pedagogy through industry-aligned internships, live projects, international immersion programmes, and consultancy initiatives that connect academic learning with real-world practice.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <p className="text-lg text-gray-700 leading-relaxed">
                  The campus is equipped with modern infrastructure, including industry-endorsed laboratories, well-stocked libraries, sports facilities, auditoria, residential hostels, and vibrant cafeterias. Guided by its mission to nurture future-ready professionals, the University has established strong industry linkages and houses a proactive placement cell.
                </p>
              </div>
            </div>

            {/* Stats & Logo */}
            <div className="space-y-8">
              {/* University Logo */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-12 text-center shadow-xl border border-primary-200">
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
                  <img 
                    src={S3_ASSETS.logos.university} 
                    alt="Garden City University Logo" 
                    className="w-full h-auto object-contain max-w-xs mx-auto"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Garden City University</h3>
                <p className="text-primary-600 font-medium">Empowering Minds, Inspiring Innovation</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl font-bold text-primary-600 mb-2">32+</div>
                  <div className="text-gray-600 font-medium">Years of Excellence</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl font-bold text-primary-600 mb-2">81</div>
                  <div className="text-gray-600 font-medium">Countries Represented</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl font-bold text-primary-600 mb-2">A-Grade</div>
                  <div className="text-gray-600 font-medium">NAAC Accredited</div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl font-bold text-primary-600 mb-2">UGC</div>
                  <div className="text-gray-600 font-medium">Recognized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gardenia Festival Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-white via-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Gardenia 2025 Festival
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto font-light">
              A celebration of creativity, talent, and the five elements that define our existence
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mt-8"></div>
          </div>

          {/* Festival Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-20">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">
                Greetings from Garden City University & Team Gardenia 2K25!
              </h3>
            </div>
            
            <div className="p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Conceptualized by Dr. Joseph V. G., Chancellor of Garden City University and Honorary Consul General of the Republic of Maldives in Bangalore, Gardenia has evolved into India's Biggest Youth Festival, a legacy event that has hosted unforgettable performances by icons such as Akshay Kumar, Tamannaah Bhatia, Lucky Ali, Tusshar Kapoor, Rannvijay, and Vivek Oberoi.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      More than just a festival, Gardenia is a gateway to India's youth market, a celebration of culture, creativity, and innovation. In 2025, we return bigger, bolder, and more impactful than ever. From 15th to 17th October 2025, Garden City University will welcome over 10,000 young participants and future leaders for an electrifying on-ground extravaganza.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      But Gardenia is more than an event – it's a gateway to the youth market of India.
                    </p>
                  </div>
                </div>
                
                {/* Festival Highlights Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Festival Highlights</h4>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600 mb-1">3</div>
                        <div className="text-gray-600 text-sm">Event Categories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600 mb-1">30+</div>
                        <div className="text-gray-600 text-sm">Unique Events</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600 mb-1">3</div>
                        <div className="text-gray-600 text-sm">Festival Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600 mb-1">10,000+</div>
                        <div className="text-gray-600 text-sm">Expected Participants</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200 text-center">
                    <div className="text-primary-600 text-sm font-semibold mb-2">FESTIVAL DATES</div>
                    <div className="text-2xl font-bold text-gray-900">15th - 17th October 2025</div>
                    <div className="text-primary-600 text-sm mt-2">Garden City University</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Five Elements Section */}
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              The Five Elements
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the essence of our festival through the five fundamental elements
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-20">
            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">🔥</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fire</h3>
                <p className="text-gray-600 leading-relaxed">
                  The element of passion, energy, and transformation. Events that ignite creativity and innovation.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">💨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Air</h3>
                <p className="text-gray-600 leading-relaxed">
                  The element of freedom, communication, and intellect. Events that inspire thought and expression.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">🌌</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Space</h3>
                <p className="text-gray-600 leading-relaxed">
                  The element of infinity, consciousness, and possibility. Events that expand horizons and dreams.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">🌍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Earth</h3>
                <p className="text-gray-600 leading-relaxed">
                  The element of stability, growth, and foundation. Events that ground us in tradition and values.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl">💧</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Water</h3>
                <p className="text-gray-600 leading-relaxed">
                  The element of flow, emotion, and adaptability. Events that nurture creativity and healing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Event Categories
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto font-light">
              Explore our diverse range of events across three main categories
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mt-8"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Department Flagship Events
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Showcase events organized by different departments, highlighting academic excellence and innovation.
                </p>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-700 font-medium">
                    Psychology Challenge, Fashion Design, Tourism Challenge, and more
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16a1 1 0 001 1h8a1 1 0 001-1V4M7 8h2v2H7V8zm4 0h2v2h-2V8zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Signature Events
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Cultural and artistic events that celebrate creativity, talent, and self-expression.
                </p>
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                  <div className="text-sm text-purple-700 font-medium">
                    Dance competitions, singing contests, art exhibitions, and fashion shows
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Sports Events
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Competitive sports events that promote physical fitness, teamwork, and sportsmanship.
                </p>
                <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                  <div className="text-sm text-green-700 font-medium">
                    Cricket, Basketball, Football, Badminton, Chess, and other exciting sports
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizing Team Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Organizing Team
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto font-light">
              Meet the dedicated team behind Gardenia 2025
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mt-8"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">
                Regards,
              </h3>
            </div>
            
            <div className="p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 border border-primary-200 shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-primary-600 mb-4">Convenor</h4>
                    <p className="text-xl text-gray-800 font-semibold">Prof. Ashwini S</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 border border-primary-200 shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-primary-600 mb-6">Co-convenors</h4>
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl p-4 border border-primary-200 shadow-sm">
                        <p className="text-lg text-gray-800 font-semibold">Prof. Ritika Prabhu</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-primary-200 shadow-sm">
                        <p className="text-lg text-gray-800 font-semibold">Dr. Shwetha Sasidharan (PT)</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-primary-200 shadow-sm">
                        <p className="text-lg text-gray-800 font-semibold">Prof. Vivekananda S</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Join the Celebration
          </h2>
          <p className="text-xl sm:text-2xl text-primary-100 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            Be part of Gardenia 2025 and experience the magic of the five elements. 
            Register for events, showcase your talent, and create unforgettable memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/events" 
              className="group bg-white text-primary-600 hover:bg-gray-50 px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 min-h-[56px] flex items-center justify-center w-full sm:w-auto"
            >
              <span className="mr-3">Explore Events</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              to="/contact" 
              className="group border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-h-[56px] flex items-center justify-center w-full sm:w-auto"
            >
              <span className="mr-3">Contact Us</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-primary-200 to-white rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
