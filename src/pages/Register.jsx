import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import heroImg from '../assets/register-hero.png';

const Register = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    address: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post('/users/register', formData);
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      alert("Account created successfully!");
      navigate('/shop');
      // Optional: reload to update navbar state
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center py-12 px-4 ${
      darkMode ? 'bg-gray-900' : 'bg-[#F3F4F6]'
    }`}>
      <div className={`max-w-[850px] w-full rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        
        {/* Hero Image Section */}
        <div className="relative h-[380px] w-full overflow-hidden">
          <img 
            src={heroImg} 
            alt="Habesha Fashion Header"
            className="w-full h-full object-cover"
          />
          {/* Overlay: adapts to dark mode */}
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-t from-gray-900 via-transparent to-black/30' 
              : 'bg-gradient-to-t from-white via-transparent to-black/10'
          }`} />
          
          {/* Header Text on Image */}
          <div className="absolute bottom-10 left-12">
            <h1 className={`text-5xl font-black tracking-tighter uppercase italic leading-none ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Registration <span className="text-orange-600">Form</span>
            </h1>
            <p className={`text-[11px] font-black uppercase tracking-[0.3em] mt-3 inline-block px-4 py-1.5 rounded-full shadow-sm ${
              darkMode 
                ? 'bg-gray-800/90 text-gray-300 backdrop-blur-sm' 
                : 'bg-white/90 text-gray-700 backdrop-blur-sm'
            }`}>
              Join the Habesha Store Community
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={submitHandler} className="p-12 space-y-7">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className={`text-[11px] font-black uppercase tracking-widest ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <input 
                  type="text" required placeholder="First Name"
                  className={`w-full px-5 py-3.5 text-sm border-b-2 outline-none transition-all font-medium ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-orange-500' 
                      : 'bg-gray-50/30 border-gray-100 focus:border-orange-500'
                  }`}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <span className={`text-[9px] font-bold uppercase ml-1 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Legal First Name
                </span>
              </div>
              <div className="space-y-1">
                <input 
                  type="text" placeholder="Last Name"
                  className={`w-full px-5 py-3.5 text-sm border-b-2 outline-none transition-all font-medium ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-orange-500' 
                      : 'bg-gray-50/30 border-gray-100 focus:border-orange-500'
                  }`}
                />
                <span className={`text-[9px] font-bold uppercase ml-1 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Legal Last Name
                </span>
              </div>
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="space-y-2">
              <label className={`text-[11px] font-black uppercase tracking-widest ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                Email Address
              </label>
              <input 
                type="email" required placeholder="example@mail.com"
                className={`w-full px-5 py-3.5 text-sm border-b-2 outline-none transition-all font-medium ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-orange-500' 
                    : 'bg-gray-50/30 border-gray-100 focus:border-orange-500'
                }`}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-[11px] font-black uppercase tracking-widest ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                Security Password
              </label>
              <input 
                type="password" required placeholder="••••••••"
                className={`w-full px-5 py-3.5 text-sm border-b-2 outline-none transition-all font-medium ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-orange-500' 
                    : 'bg-gray-50/30 border-gray-100 focus:border-orange-500'
                }`}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className={`text-[11px] font-black uppercase tracking-widest ${
              darkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              Street Address
            </label>
            <input 
              type="text" placeholder="Addis Ababa, Ethiopia"
              className={`w-full px-5 py-3.5 text-sm border-b-2 outline-none transition-all font-medium ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-orange-500' 
                  : 'bg-gray-50/30 border-gray-100 focus:border-orange-500'
              }`}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          {/* Footer */}
          <div className={`pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t mt-10 ${
            darkMode ? 'border-gray-700' : 'border-gray-50'
          }`}>
            <button 
              type="submit" disabled={loading}
              className="w-full md:w-auto px-14 py-4 bg-black text-white text-[11px] font-bold rounded-full hover:bg-orange-600 transition-all uppercase tracking-[0.3em] disabled:opacity-50 shadow-xl active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
            </button>
            
            <p className={`text-[11px] font-black uppercase tracking-widest ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Already a member? <Link to="/login" className="text-orange-600 hover:text-black transition-colors ml-1">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;