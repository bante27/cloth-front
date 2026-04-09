import React from 'react';
import { Instagram, Send, Linkedin, Phone, ChevronRight, Home, Globe, ShoppingBag, MapPin, CheckCircle, User, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import storyImg from '../assets/image5.jpg'; 

const About = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-all font-sans border-none shadow-none ${
      darkMode ? 'bg-gray-950 text-gray-200' : 'bg-white text-gray-800'
    }`}>
      
      {/* 1. BREADCRUMBS - TINY ON MOBILE */}
      <div className={`py-2 md:py-4 border-b border-gray-50 shadow-none ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-end gap-1 md:gap-2 text-[8px] md:text-[10px] uppercase font-black opacity-40">
          <Home size={10} /> <ChevronRight size={8} /> <span>About Us</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="py-8 md:py-16 shadow-none">
        <div className="max-w-5xl mx-auto px-6 shadow-none">
          
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start shadow-none">
            
            {/* TEXT CONTENT - SPECIFIC TO TIGSH ASMAMEW & BAHIR DAR SHOPPING */}
            <div className="space-y-6 md:space-y-8 text-[11px] md:text-base leading-relaxed shadow-none">
              <div className="space-y-4 md:space-y-5 shadow-none text-justify">
                
                {/* FOUNDER TAG */}
                <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full">
                   <User size={10} className="md:w-3" />
                   <span className="text-[8px] md:text-[10px] font-black uppercase">Founder: Tigsh Asmamewu</span>
                </div>

                <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-orange-600">
                  Welcome to my <span className="text-gray-900 dark:text-white">clothing store</span>
                </h1>

                <p className="opacity-90">
                  Welcome! I am <strong>Tigst Asmamewu</strong>, and I am proud to bring you the finest 
                  online shopping experience straight from the beautiful city of <strong>Bahir Dar, Amhara Region</strong>. 
                  My project is more than just an e-commerce platform; it is a dedicated digital storefront for my 
                  physical shop, bringing the rich heritage of Ethiopian clothing to your screen.
                </p>

                <p className="opacity-90">
                  At my shop, we specialize in authentic <strong>Bahir Dar hand-woven apparel</strong>. 
                  Every piece is selected with care, featuring the delicate 'Tibeb' patterns that our 
                  region is famous for. Whether you are looking for traditional Habesha Kemis, modern 
                  Amhara-inspired casual wear, or high-quality local fabrics, my shop provides the 
                  best quality at fair prices.
                </p>

                <p className="opacity-90">
                  By developing this digital shopping platform, I aim to simplify how you access 
                  premium Bahir Dar fashion. We work closely with master weavers around Lake Tana 
                  to ensure every thread represents the soul of Ethiopia. My shop is committed to 
                  quality, honesty, and promoting the unique beauty of our local artisans.
                </p>
                
                {/* HIGHLIGHT BOX */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 md:p-5 border-l-4 border-orange-500 italic text-[10px] md:text-sm">
                  "I personally guarantee that every order from my Bahir Dar shop reaches you 
                  within 3 working days, anywhere in Ethiopia."
                </div>
              </div>

              {/* PRODUCT FEATURES */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                 <Feature text="Bahir Dar Handmade" />
                 <Feature text="Premium Habesha Tibeb" />
                 <Feature text="Amhara Cultural Styles" />
                 <Feature text="Direct From My Shop" />
              </div>

              {/* CONTACT & SUPPORT - SMALL ICONS */}
              <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4 md:space-y-6">
                <div className="space-y-3">
                  <h3 className="font-black uppercase text-[7px] md:text-[9px] opacity-30 tracking-[0.4em]">Connect With Tigsh</h3>
                  <div className="flex items-center gap-3 text-lg md:text-2xl font-black">
                    <Phone size={18} className="text-orange-500 md:w-5" />
                    <span>8420</span>
                  </div>
                </div>

                <div className="grid gap-2 pt-1">
                  <SocialLink icon={<Instagram size={12}/>} label="Instagram" link="instagram.com/tigsh_collection" />
                  <SocialLink icon={<Send size={12}/>} label="Telegram" link="t.me/tigsh_collection" />
                  <SocialLink icon={<Linkedin size={12}/>} label="LinkedIn" link="linkedin.com/in/tigsh-asmamewu" />
                </div>
              </div>
            </div>

            {/* IMAGE SECTION - SMALL ON MOBILE */}
            <div className="flex justify-center md:justify-end order-first md:order-last">
              <div className="relative">
                <div className={`
                  overflow-hidden rounded-none shadow-none border-none
                  w-44 h-56 md:w-72 md:h-96 
                  ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}
                `}>
                  <img 
                    src={storyImg} 
                    alt="Tigsh Asmamewu Shop" 
                    className="w-full h-full object-cover grayscale-[10%]"
                  />
                </div>
                {/* LOCATION TAG */}
                <div className="absolute -bottom-2 -left-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 flex items-center gap-1.5 shadow-none">
                  <MapPin size={10} className="text-orange-500" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Shop in Bahir Dar</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Small Feature Component
const Feature = ({ text }) => (
  <div className="flex items-center gap-1.5">
    <Star size={10} className="text-orange-500" />
    <span className="text-[9px] md:text-[11px] font-bold opacity-70">{text}</span>
  </div>
);

// Reusable Social Link
const SocialLink = ({ icon, label, link }) => (
  <div className="flex items-center gap-2">
    <span className="text-orange-500">{icon}</span>
    <div className="text-[10px] md:text-xs">
      <span className="font-bold">{label}: </span>
      <span className="text-blue-600 truncate max-w-[150px] inline-block align-bottom">{link}</span>
    </div>
  </div>
);

export default About;