import { Link } from 'react-router-dom';
import S3_ASSETS from '../config/s3-assets';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-emerald-600/5"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* University Logo */}
            <div className="mb-8">
              <div className="inline-block p-6 bg-white rounded-3xl shadow-2xl border border-gray-100">
                <img 
                  src={S3_ASSETS.logos.university} 
                  alt="Garden City University Logo" 
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Garden City University</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Empowering minds, inspiring innovation, and nurturing global leaders since 1992
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-blue-600 mb-2">32+</div>
                <div className="text-sm text-gray-600 font-medium">Years of Excellence</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-purple-600 mb-2">81</div>
                <div className="text-sm text-gray-600 font-medium">Countries</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-emerald-600 mb-2">A+</div>
                <div className="text-sm text-gray-600 font-medium">NAAC Grade</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="text-3xl font-bold text-orange-600 mb-2">UGC</div>
                <div className="text-sm text-gray-600 font-medium">Recognized</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Overview */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  A Legacy of <span className="text-blue-600">Excellence</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8"></div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Garden City University (GCU), located in Bengaluru, Karnataka, is a State Private University established in 2013 through the Karnataka State Act No. 47 of 2013 and is recognised by the University Grants Commission (UGC), Government of India.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    The University's legacy traces back to the esteemed Garden City College, founded in 1992 under the Garden City Education Trust by Dr. Joseph V.G. Over the years, it has been home to students from 81 countries, making it a truly global learning destination.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    GCU offers a diverse range of undergraduate, postgraduate, and doctoral programmes across its various schools, including Management, Commerce, Sciences, Media, Engineering, Health Sciences, Languages, Social Sciences, Hospitality, and Fashion & Apparel Design.
                  </p>
                </div>
              </div>
            </div>

            {/* University Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <img 
                  src={S3_ASSETS.logos.aboutGCU} 
                  alt="Garden City University Campus" 
                  className="w-full h-auto rounded-2xl shadow-lg object-cover"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🎓</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🌍</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Academic <span className="text-purple-600">Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With a strong emphasis on experiential learning, GCU promotes active pedagogy through industry-aligned programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Learning Approach */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Experiential Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Industry-aligned internships, live projects, and consultancy initiatives that connect academic learning with real-world practice.
              </p>
            </div>

            {/* Global Reach */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Students from 81 countries create a diverse, multicultural environment that enriches the learning experience.
              </p>
            </div>

            {/* Modern Infrastructure */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Modern Infrastructure</h3>
              <p className="text-gray-600 leading-relaxed">
                Industry-endorsed laboratories, well-stocked libraries, sports facilities, auditoria, and residential hostels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gardenia 2025 Festival */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-8 shadow-lg">
              <span className="text-white text-3xl">🎭</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Gardenia <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">2025</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
              A celebration of creativity, talent, and the five elements that define our existence
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
          </div>

          {/* Festival Theme */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-3xl p-12 mb-16 border border-purple-100">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                The Five Elements
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each element represents a unique aspect of human experience, creativity, and growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Fire */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center group-hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl">🔥</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Fire</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The element of passion, energy, and transformation. Events that ignite creativity and drive.
                  </p>
                </div>
              </div>

              {/* Air */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center group-hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl">💨</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Air</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The element of communication, intellect, and freedom. Events that inspire thought and expression.
                  </p>
                </div>
              </div>

              {/* Space */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center group-hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl">🌌</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Space</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The element of infinity, consciousness, and possibility. Events that expand horizons and dreams.
                  </p>
                </div>
              </div>

              {/* Earth */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center group-hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl">🌍</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Earth</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The element of stability, growth, and foundation. Events that ground us in tradition and values.
                  </p>
                </div>
              </div>

              {/* Water */}
              <div className="group">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center group-hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white text-2xl">💧</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Water</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The element of flow, emotion, and adaptability. Events that nurture creativity and healing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                Join the Celebration
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Experience the magic of Gardenia 2025 - where creativity meets tradition
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/events"
                  className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  Explore Events
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-800 transition-colors duration-200 shadow-lg border-2 border-purple-500"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;