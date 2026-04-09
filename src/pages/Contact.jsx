import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const images = [
    '/src/assets/image1.png',
    '/src/assets/image2.png',
    '/src/assets/image3.png',
    '/src/assets/image4.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 4000);
      } else {
        alert("Error saving message!");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Server is not running!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-10 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Hero Slider Section */}
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-2 drop-shadow-2xl"
          >
            Get In Touch
          </motion.h1>
          <p className="text-sm md:text-lg font-medium opacity-80 italic">Habesha Style</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-24 md:-mt-32 pb-10 relative z-30">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          
          {/* Info Side */}
          <div className="lg:col-span-1 space-y-3 order-2 lg:order-1">
            {[
              { icon: MapPin, title: 'Location', detail: 'Bahrdar, Amhara region', colorClass: 'text-green-600' },
              { icon: Phone, title: 'Phone', detail: '+251 911 234 567', colorClass: 'text-yellow-600' },
              { icon: Mail, title: 'Email', detail: 'info@habesha.com', colorClass: 'text-red-600' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5 }}
                className={`backdrop-blur-md p-5 rounded-[1.8rem] shadow-lg border flex items-center space-x-4 transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/95 border-gray-700' 
                    : 'bg-white/95 border-white'
                }`}
              >
                <div className={`p-3 rounded-xl shadow-inner ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${item.colorClass}`}>
                    <item.icon size={20} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] p-6 md:p-10 border transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-1 bg-green-700 rounded-full mr-3"></div>
                <h2 className={`text-xl md:text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Send a Message
                </h2>
              </div>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs font-bold flex items-center">
                    <CheckCircle size={16} className="mr-2" /> Message sent – we'll reply via email!
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold ml-2 uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text" name="name" required placeholder="Name"
                      value={formData.name} onChange={handleChange}
                      className={`w-full px-5 py-3.5 border border-transparent rounded-2xl outline-none transition-all text-sm shadow-sm ${
                        darkMode 
                          ? 'bg-gray-700 text-white focus:border-green-500 focus:bg-gray-600' 
                          : 'bg-gray-50 text-gray-800 focus:border-green-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold ml-2 uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email" name="email" required placeholder="Email"
                      value={formData.email} onChange={handleChange}
                      className={`w-full px-5 py-3.5 border border-transparent rounded-2xl outline-none transition-all text-sm shadow-sm ${
                        darkMode 
                          ? 'bg-gray-700 text-white focus:border-green-500 focus:bg-gray-600' 
                          : 'bg-gray-50 text-gray-800 focus:border-green-600 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`text-[11px] font-bold ml-2 uppercase ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    Subject
                  </label>
                  <input
                    type="text" name="subject" required placeholder="Subject"
                    value={formData.subject} onChange={handleChange}
                    className={`w-full px-5 py-3.5 border border-transparent rounded-2xl outline-none transition-all text-sm shadow-sm ${
                      darkMode 
                        ? 'bg-gray-700 text-white focus:border-green-500 focus:bg-gray-600' 
                        : 'bg-gray-50 text-gray-800 focus:border-green-600 focus:bg-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[11px] font-bold ml-2 uppercase ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`}>
                    Message
                  </label>
                  <textarea
                    name="message" required rows="4" placeholder="Message..."
                    value={formData.message} onChange={handleChange}
                    className={`w-full px-5 py-3.5 border border-transparent rounded-2xl outline-none transition-all text-sm resize-none shadow-sm ${
                      darkMode 
                        ? 'bg-gray-700 text-white focus:border-green-500 focus:bg-gray-600' 
                        : 'bg-gray-50 text-gray-800 focus:border-green-600 focus:bg-white'
                    }`}
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoading}
                  className="w-full py-4 rounded-[1.5rem] text-white font-bold text-lg shadow-xl bg-gradient-to-r from-green-800 to-green-950 flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> <span>Send Message</span></>}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;