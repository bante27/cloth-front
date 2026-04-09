import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ChevronRight, Home, Smartphone, Truck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicy = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-all font-sans border-none shadow-none ${
      darkMode ? 'bg-gray-950 text-gray-200' : 'bg-white text-gray-800'
    }`}>
      
      {/* 1. BREADCRUMBS - TINY ON MOBILE */}
      <div className={`py-2 md:py-4 border-b border-gray-50 shadow-none ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-end gap-1 md:gap-2 text-[8px] md:text-[10px] uppercase font-black opacity-40">
          <Home size={10} /> <ChevronRight size={8} /> <span>Privacy Policy</span>
        </div>
      </div>

      {/* 2. HEADER SECTION */}
      <div className="pt-8 md:pt-16 px-6 text-center shadow-none">
        <ShieldCheck size={30} className="mx-auto text-orange-500 mb-2 md:w-12 md:h-12" />
        <h1 className="text-xl md:text-4xl font-black uppercase tracking-tighter">
          Privacy <span className="text-orange-500">Policy</span>
        </h1>
        <p className="text-[9px] md:text-xs uppercase tracking-widest opacity-50 mt-2">
          Last Updated: April 2026 | Tigsh Collection, Bahir Dar
        </p>
      </div>

      {/* 3. CONTENT SECTION - SMALL TEXT ON MOBILE */}
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-16 shadow-none">
        <div className="space-y-8 md:space-y-12 text-[11px] md:text-base leading-relaxed text-justify shadow-none">
          
          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-sm md:text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-2">
              <Eye size={16} className="text-orange-500" /> 1. Introduction
            </h2>
            <p className="opacity-90">
              Welcome to <strong>us shopping</strong>. I am <strong>Tigst Asmamewu</strong>, and I value your trust. This Privacy Policy explains how my shopping platform collects, uses, and protects your personal information when you shop with us in Bahir Dar or across Ethiopia.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-sm md:text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-2">
              <FileText size={16} className="text-orange-500" /> 2. Information We Collect
            </h2>
            <p className="opacity-90">
              To provide you with the best shopping experience in our Bahir Dar store, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
              <li><strong>Contact Details:</strong> Your name, phone number, and delivery address in Ethiopia.</li>
              <li><strong>Order History:</strong> Details about the traditional cloths and apparel you purchase.</li>
              <li><strong>Device Data:</strong> IP address and browser type for security (Backend logging).</li>
            </ul>
          </section>

          {/* How We Use Your Data */}
          <section className="space-y-3">
            <h2 className="text-sm md:text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-2">
              <Truck size={16} className="text-orange-500" /> 3. How We Use Your Information
            </h2>
            <p className="opacity-90">
              Your information helps me, Tigst Asmamewu, to:
            </p>
            <ul className="list-disc pl-5 space-y-2 opacity-80">
              <li>Process your orders and manage local shipping from Bahir Dar.</li>
              <li>Send you updates about new Habesha cloth collections.</li>
              <li>Improve our website's performance and security.</li>
            </ul>
          </section>

          {/* Security */}
          <section className="space-y-3">
            <h2 className="text-sm md:text-xl font-bold flex items-center gap-2 border-b border-gray-100 pb-2">
              <Lock size={16} className="text-orange-500" /> 4. Data Security
            </h2>
            <p className="opacity-90">
              I use secure Backend protocols to protect your data. We do not sell or share your personal information with third parties for marketing. Your data is stored safely to ensure a secure shopping environment for all our customers in the Amhara region and beyond.
            </p>
          </section>

          {/* Contact Section */}
          <div className="mt-10 p-5 bg-gray-50 dark:bg-gray-900 border-l-4 border-orange-500 shadow-none">
            <h3 className="text-[10px] md:text-sm font-black uppercase mb-2">Questions or Concerns?</h3>
            <p className="text-[10px] md:text-sm mb-4">
              If you have any questions about how I handle your data, please contact me directly at my shop in Bahir Dar.
            </p>
            <div className="flex flex-wrap gap-4 text-xs md:text-base font-black">
              <span className="flex items-center gap-2"><Smartphone size={14} className="text-orange-500" /> 8420</span>
              <span className="opacity-60 italic">Email: tigsh.asmamewu@example.com</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. FOOTER MINI */}
      <div className={`py-6 text-center border-t border-gray-50 ${darkMode ? 'border-gray-900' : 'border-gray-100'}`}>
         <p className="text-[8px] md:text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">
           &copy; 2026 Tigsh Collection | Developed by Tigsh Asmamewu
         </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;