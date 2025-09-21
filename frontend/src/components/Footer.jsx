import ElementalLogo from './ElementalLogo';
import S3_ASSETS from '../config/s3-assets';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container-responsive py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Garden City University Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={S3_ASSETS.logos.university}
                alt="Garden City University Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-white rounded p-1"
              />
              <h3 className="text-base sm:text-lg font-semibold">Garden City University</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering Minds<br />
              Inspiring Innovation
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/events" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Events
                </a>
              </li>
              <li>
                <a href="/brochure" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Brochure
                </a>
              </li>
              <li>
                <a href="/rules" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Rules & Regulations
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Gardenia 2025 Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white rounded p-1">
                <ElementalLogo className="w-10 h-8 sm:w-12 sm:h-10" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold">Gardenia 2025</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Elements – Live the Essence
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/garden_city_university/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors duration-200"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/school/garden-city-college-of-sc-and-mgt.-studies/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                title="Connect with us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* Website */}
              <a 
                href="https://www.gardencity.university/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                title="Visit our official website"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </a>
            </div>
          </div>
        </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center col-span-full">
            <p className="text-gray-300 text-xs sm:text-sm">
              © {currentYear} Garden City University. All rights reserved. | Gardenia 2025
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Developed by <span className="text-emerald-400 font-bold text-sm">NerdsAndGeeks</span>
            </p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
