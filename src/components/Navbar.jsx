import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, ChevronDown, Sparkles, Sun, Moon, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ cartCount, onOpenCart, userInfo, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRefs = useRef({});
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getUserName = () => {
    const name = userInfo?.name || userInfo?.user?.name || "";
    return name ? name.split(' ')[0] : "";
  };

  const getCategoryPath = (categoryKey, gender = null) => {
    const params = new URLSearchParams();
    if (categoryKey === 'new-arrivals') {
      params.set('newArrival', 'true');
    } else if (categoryKey && categoryKey !== 'new-arrivals') {
      params.set('category', categoryKey);
    }
    if (gender && gender !== 'all') {
      params.set('gender', gender);
    }
    return `/shop?${params.toString()}`;
  };

  const genders = [
    { name: 'All', value: 'all' },
    { name: 'Women', value: 'Women' },
    { name: 'Men', value: 'Men' },
    { name: 'Kids', value: 'Kids' },
  ];

  const categories = [
    { name: 'New Arrivals', key: 'new-arrivals' },
    { name: 'Clothing', key: 'clothing' },
    { name: 'Shoes', key: 'shoes' },
    { name: 'Accessories', key: 'accessories' },
    { name: 'Home & Gift', key: 'home-gift' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleGenderClick = (categoryKey, genderValue) => {
    navigate(getCategoryPath(categoryKey, genderValue));
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900 border-b border-gray-800' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 md:h-16 flex justify-between items-center">
        
        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-1.5 rounded-lg transition-all ${
            darkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
          }`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo / Scrolled Call Us */}
        {isScrolled ? (
          <a
            href="tel:0927993894"
            className={`flex items-center gap-1.5 px-2.5 py-1 transition-all animate-in fade-in duration-200 ${
              darkMode ? 'bg-white/10 text-white' : 'bg-orange-50 text-orange-900 border border-orange-200'
            }`}
            style={{ borderRadius: '2px' }}
            title="Call Us"
          >
            <Phone size={13} className="text-orange-500 shrink-0" />
            <span className="text-[10px] md:text-xs font-bold tracking-tight">0927993894</span>
          </a>
        ) : (
          <Link to="/" className="group relative">
            <span className={`text-base md:text-lg font-black tracking-tighter ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              HABESHA<span className="text-orange-500">STYLE</span>
            </span>
            <Sparkles size={10} className="absolute -top-1 -right-3 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              {category.path ? (
                <Link 
                  to={category.path} 
                  className={`text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {category.name}
                </Link>
              ) : (
                <div className="relative py-2">
                  <button 
                    onClick={() => toggleDropdown(category.key)}
                    className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-300 ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {category.name} 
                    <ChevronDown size={10} className={`transition-transform duration-200 ${openDropdown === category.key ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                  </button>
                  <div className={`absolute top-full left-0 mt-2 w-36 border shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-xl ${
                    darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                  }`}>
                    {genders.map((g) => (
                      <button 
                        key={g.value} 
                        onClick={() => handleGenderClick(category.key, g.value)}
                        className={`block w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          darkMode ? 'text-gray-300 hover:text-orange-400 hover:bg-white/5' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded-full transition-all border ${
              darkMode ? 'bg-white/10 text-gray-300 border-white/20' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {userInfo ? (
            <div className="flex items-center gap-2">
              <div className={`hidden md:flex items-center gap-2 rounded-full pl-3 pr-2 py-1 border ${
                darkMode ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`text-[11px] font-medium ${darkMode ? 'text-orange-300' : 'text-gray-700'}`}>
                  {getUserName()}
                </span>
                <button 
                  onClick={onLogout}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={12} />
                </button>
              </div>
              <Link 
                to="/profile" 
                className={`p-1.5 rounded-full border transition-all ${
                  darkMode ? 'bg-white/10 border-white/20 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <User size={14} />
              </Link>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`p-1.5 rounded-full transition-colors ${
                darkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={14} />
            </Link>
          )}
          
          <button 
            onClick={onOpenCart} 
            className="relative p-1.5 bg-black text-white rounded-full transition-all shadow-md active:scale-95"
          >
            <ShoppingBag size={14} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-black border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="p-4 flex flex-col gap-4 border-t border-gray-100">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col gap-2 border-b border-gray-50 pb-2 last:border-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (category.path) navigate(category.path);
                    else handleGenderClick(category.key, 'all');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-[11px] font-black uppercase tracking-widest italic ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  {category.name}
                </button>
                {!category.path && (
                  <button 
                    onClick={() => toggleDropdown(category.key)}
                    className={`p-1 rounded-md transition-all ${
                      openDropdown === category.key ? 'bg-orange-500 text-white' : 'text-gray-400 bg-gray-50'
                    }`}
                  >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === category.key ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              {!category.path && openDropdown === category.key && (
                <div className="grid grid-cols-2 gap-2 mt-1 ml-1 animate-in slide-in-from-top-1">
                  {genders.map((gender) => (
                    <button
                      key={gender.value}
                      onClick={() => handleGenderClick(category.key, gender.value)}
                      className={`py-2 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${
                        darkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-500'
                      }`}
                    >
                      {gender.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;