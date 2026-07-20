import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 border-t border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
          
          {/* 1. About Section */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic">
              <span className="text-green-500">Habesha</span>
              <span className="text-red-600">Style</span>
            </h3>
            <p className={`text-xs leading-relaxed mb-6 max-w-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Bringing the beauty of Ethiopian fashion to the world. Quality traditional and modern clothing.
            </p>
            <div className="flex space-x-5">
              <Facebook className={`w-4 h-4 transition-colors cursor-pointer ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`} />
              <Twitter className={`w-4 h-4 transition-colors cursor-pointer ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`} />
              <Instagram className={`w-4 h-4 transition-colors cursor-pointer ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`} />
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-5 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><Link to="/about" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>About Us</Link></li>
              <li><Link to="/shop" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>Shop All</Link></li>
              <li><Link to="/traditional" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>Traditional</Link></li>
              <li><Link to="/contact" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>Contact</Link></li>
            </ul>
          </div>

          {/* 3. Customer Service */}
          <div>
            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-5 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Support
            </h4>
            <ul className="space-y-3">
              <li><Link to="/shipping" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>Shipping</Link></li>
              <li><Link to="/returns" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>Returns</Link></li>
              <li><Link to="/size-guide" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>Size Guide</Link></li>
              <li><Link to="/privacy-policy" className={`text-xs transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}>Privacy</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div className={`col-span-2 md:col-span-1 mt-4 md:mt-0 pt-6 md:pt-0 ${
            darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'
          } md:border-none`}>
            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-5 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Contact Us
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
              <li className={`flex items-start text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <MapPin className="w-3.5 h-3.5 mr-3 mt-0.5 text-red-600" />
                <span>Bahrdar, Ethiopia</span>
              </li>
              <li className={`flex items-center text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Phone className="w-3.5 h-3.5 mr-3 text-red-600" />
                <span>+251 927 993 894</span>
              </li>
              <li className={`flex items-center text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Mail className="w-3.5 h-3.5 mr-3 text-red-600" />
                <span>info@habeshastyle.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 ${
          darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'
        }`}>
          <p className={`text-[9px] font-bold uppercase tracking-widest text-center md:text-left ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            &copy; {currentYear} HabeshaStyle. All rights reserved.
          </p>
          <div className="flex gap-4 opacity-50">
             <span className={`text-[8px] font-black uppercase tracking-tighter italic ${
               darkMode ? 'text-gray-400' : 'text-gray-600'
             }`}>Quality</span>
             <span className={`text-[8px] font-black uppercase tracking-tighter italic ${
               darkMode ? 'text-gray-400' : 'text-gray-600'
             }`}>Tradition</span>
             <span className={`text-[8px] font-black uppercase tracking-tighter italic ${
               darkMode ? 'text-gray-400' : 'text-gray-600'
             }`}>Modern</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;