import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Star, ChevronRight, ArrowRight, Sparkles,
  Truck, Shield, Clock, Flame, Eye, Heart, AlertCircle,
  Mail, CheckCircle2, Timer
} from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

// Import your hero images (unchanged)
import hero1 from '../assets/image.png';
import hero2 from '../assets/image1.png';
import hero3 from '../assets/image2.png';
import hero4 from '../assets/image4.jpg';
import hero5 from '../assets/image3.png';

// ----------------------------------------------------------------------
// Colour palette
// ----------------------------------------------------------------------
const COLORS = {
  primary: '#1A3A3A',
  primaryLight: '#2A5A5A',
  accent: '#D4A373',
  accentLight: '#E8C9A0',
  bgLight: '#F8F5F0',
  textDark: '#1E1E1E',
  textLight: '#FFFFFF',
  border: '#E2DCD5',
};

// ----------------------------------------------------------------------
// Font loader (unchanged)
// ----------------------------------------------------------------------
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
    .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
    .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  `}</style>
);

// ----------------------------------------------------------------------
// Product Card – unchanged
// ----------------------------------------------------------------------
const ProductCard = React.memo(({ product, onQuickAdd }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const isOutOfStock = product.countInStock <= 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price - (product.price * product.discount) / 100
    : null;

  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      onClick={handleCardClick}
      className={`font-body group relative cursor-pointer overflow-hidden transition-all duration-300 border ${
        darkMode
          ? 'bg-[#1E1A17] border-[#332D28] hover:border-[#D4A373]/50'
          : 'bg-white border-[#E2DCD5] hover:border-[#D4A373]/60'
      } ${isOutOfStock ? 'opacity-70' : ''}`}
      style={{ borderRadius: '2px' }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D4A373] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span
            className="text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1"
            style={{ backgroundColor: COLORS.primary, borderRadius: '2px' }}
          >
            New
          </span>
        )}
        {hasDiscount && (
          <span
            className="text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1"
            style={{ backgroundColor: '#B84A4A', borderRadius: '2px' }}
          >
            −{product.discount}%
          </span>
        )}
        {product.isBestSeller && (
          <span
            className="text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1"
            style={{ backgroundColor: COLORS.accent, borderRadius: '2px' }}
          >
            Trending
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
        style={{ borderRadius: '2px' }}
      >
        <Heart size={13} className="text-[#1E1E1E] hover:text-[#B84A4A] transition-colors" />
      </button>

      <div className={`relative aspect-square overflow-hidden ${darkMode ? 'bg-[#141110]' : 'bg-[#F1EBDC]'}`}>
        <img
          src={product.imageFront || '/placeholder.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            product.imageBack ? 'group-hover:opacity-0 group-hover:scale-[1.04]' : 'group-hover:scale-[1.04]'
          }`}
          loading="lazy"
        />
        {product.imageBack && (
          <img
            src={product.imageBack}
            alt={`${product.name} back view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-[1.04]"
            loading="lazy"
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-[#B84A4A] text-white font-bold text-[9px] px-3 py-1.5 tracking-widest uppercase" style={{ borderRadius: '2px' }}>
              Sold Out
            </div>
          </div>
        )}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <span
              className="bg-white text-[#1E1E1E] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#D4A373] hover:text-white transition-colors"
              style={{ borderRadius: '2px' }}
            >
              <Eye size={12} /> Quick
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${darkMode ? 'text-[#D4A373]' : 'text-[#96602B]'}`}>
            {product.category || 'Clothing'}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={`${
                  i < fullStars || (i === fullStars && hasHalfStar)
                    ? 'text-[#D4A373] fill-[#D4A373]'
                    : darkMode ? 'text-[#3A332C] fill-[#3A332C]' : 'text-[#DDD3BC] fill-[#DDD3BC]'
                }`}
              />
            ))}
            <span className={`text-[8px] ml-0.5 font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              ({product.numReviews || 0})
            </span>
          </div>
        </div>

        <h3 className={`font-display font-semibold text-sm leading-snug line-clamp-1 mb-1 ${
          isOutOfStock ? 'text-gray-400' : darkMode ? 'text-[#F7F1E6]' : 'text-[#1E1E1E]'
        }`}>
          {product.name}
        </h3>

        <p className={`text-[10px] line-clamp-2 mb-2 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {product.description || 'Handmade with traditional detail.'}
        </p>

        <div className={`flex items-center justify-between pt-2 border-t ${darkMode ? 'border-[#332D28]' : 'border-[#EEE6D4]'}`}>
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-400 line-through">
                  Br {(product.price || 0).toLocaleString()}
                </span>
                <span className="font-display text-sm font-bold" style={{ color: '#B84A4A' }}>
                  Br {(discountedPrice || 0).toLocaleString()}
                </span>
              </div>
            ) : (
              <span className={`font-display text-sm font-bold ${isOutOfStock ? 'text-gray-400' : darkMode ? 'text-[#F7F1E6]' : 'text-[#1E1E1E]'}`}>
                Br {(product.price || 0).toLocaleString()}
              </span>
            )}
          </div>
          {!isOutOfStock && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickAdd(product); }}
              className="text-white p-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: COLORS.primary, borderRadius: '2px' }}
            >
              <ShoppingBag size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';

const ProductSkeleton = () => {
  const { darkMode } = useTheme();
  return (
    <div className="animate-pulse border border-transparent p-2">
      <div className={`aspect-square ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} style={{ borderRadius: '2px' }} />
      <div className="p-3">
        <div className={`h-2 w-1/4 mb-2 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        <div className={`h-3 w-3/4 mb-1 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        <div className={`h-2 w-full mb-3 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        <div className="flex justify-between items-center">
          <div className={`h-4 w-16 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
          <div className={`h-6 w-6 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Countdown (unchanged)
// ----------------------------------------------------------------------
const useMidnightCountdown = () => {
  const getRemaining = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.max(0, midnight.getTime() - now.getTime());
  };
  const [remaining, setRemaining] = useState(getRemaining());
  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return { hours, minutes, seconds };
};

const DealCountdown = ({ darkMode }) => {
  const { hours, minutes, seconds } = useMidnightCountdown();
  const Unit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span
        className={`font-display text-base font-bold tabular-nums px-2 py-0.5 ${darkMode ? 'bg-[#1E1A17] text-[#D4A373]' : 'bg-white text-[#B84A4A]'}`}
        style={{ borderRadius: '2px' }}
      >
        {value}
      </span>
      <span className="text-[7px] uppercase tracking-widest mt-0.5 font-bold text-gray-400">{label}</span>
    </div>
  );
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border ${darkMode ? 'bg-[#241417] border-[#4A2530]' : 'bg-[#FBEEEE] border-[#EDD6D6]'}`} style={{ borderRadius: '2px' }}>
      <Timer size={14} style={{ color: '#B84A4A' }} className="flex-shrink-0" />
      <div className="flex items-center gap-1.5">
        <Unit value={hours} label="hrs" />
        <span className="text-gray-300 text-xs">:</span>
        <Unit value={minutes} label="min" />
        <span className="text-gray-300 text-xs">:</span>
        <Unit value={seconds} label="sec" />
      </div>
      <span className="text-[8px] font-bold uppercase tracking-wide ml-1 hidden sm:inline" style={{ color: '#B84A4A' }}>
        left today
      </span>
    </div>
  );
};

// ----------------------------------------------------------------------
// Newsletter (unchanged)
// ----------------------------------------------------------------------
const NewsletterSignup = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(() => {
    const isSubscribed = localStorage.getItem('newsletter_subscribed');
    return isSubscribed === 'true' ? 'done' : 'idle';
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setStatus('submitting');
    try {
      await API.post('/coupons/subscribe', { email });
      localStorage.setItem('newsletter_subscribed', 'true');
      setStatus('done');
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 mb-16" style={{ backgroundColor: COLORS.primary, borderRadius: '2px' }}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D4A373]" />
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-12 md:py-16">
        <div className="inline-flex items-center justify-center w-10 h-10 mb-4" style={{ backgroundColor: 'rgba(212,163,115,0.15)', borderRadius: '2px' }}>
          <Mail size={16} style={{ color: COLORS.accent }} />
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2 text-white">
          Stay Ahead
        </h3>
        <p className="text-xs text-gray-300 mb-6 font-body">
          One email a week. New arrivals, a welcome discount, nothing else.
        </p>

        {status === 'done' ? (
          <div className="inline-flex items-center gap-2 font-semibold text-xs text-white max-w-md mx-auto px-4 py-3" style={{ backgroundColor: 'rgba(63,93,69,0.2)', border: `1px solid #3F5D45`, borderRadius: '2px' }}>
            <CheckCircle2 size={14} style={{ color: '#7FBF8E' }} /> You're subscribed — check your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
              placeholder="your@email.com"
              className={`flex-1 px-4 py-2.5 text-xs font-medium outline-none transition bg-[#1E1A17] text-white border placeholder:text-gray-600 focus:border-[#D4A373] ${status === 'error' ? 'border-[#B84A4A]' : 'border-[#332D28]'}`}
              style={{ borderRadius: '2px' }}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-5 py-2.5 font-bold text-xs flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-95 disabled:opacity-60 text-[#1E1E1E]"
              style={{ backgroundColor: COLORS.accent, borderRadius: '2px' }}
            >
              {status === 'submitting' ? 'Subscribing…' : 'Subscribe'} <ArrowRight size={14} />
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-[9px] font-semibold mt-2 text-white inline-block px-3 py-1" style={{ backgroundColor: '#B84A4A', borderRadius: '2px' }}>
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------
// Home – HERO SLIDESHOW KEPT, progress indicators and line removed
// ----------------------------------------------------------------------
const Home = ({ addToCart }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const HERO_DURATION = 5000;

  // ORIGINAL hero slides – untouched
  const heroSlides = useMemo(() => [
    { image: hero1, tag: 'Premium Cultural Wear', titleEN: 'Upgrade Your Style.', desc: 'Look your best with our top collection. Find real handmade items updated daily.' },
    { image: hero2, tag: 'Modern & Trendy', titleEN: 'Own Your Tradition.', desc: 'Enjoy a mix of traditional cloth and modern fashion styles.' },
    { image: hero3, tag: 'Handcrafted Luxury', titleEN: 'Pure Quality.', desc: 'Every item has a story. Get high quality clothing delivered straight to your home.' },
    { image: hero4, tag: 'Wedding & Festive', titleEN: 'Elegant Outfits.', desc: 'Explore stunning custom clothing styles perfect for special days and luxury weddings.' },
    { image: hero5, tag: 'Seasonal Outfits', titleEN: 'Timeless Looks.', desc: 'See special clothes handmade by expert weavers using safe materials.' },
  ], []);

  // Slideshow timer – unchanged
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, HERO_DURATION);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Product fetching – unchanged
  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const effectivePrice = (p) =>
      p.discount && p.discount > 0 ? p.price - (p.price * p.discount) / 100 : p.price;
    const byLowestPriceFirst = (a, b) => effectivePrice(a) - effectivePrice(b);

    try {
      const { data } = await API.get('/products?limit=60');
      const allProducts = Array.isArray(data) ? data : data.products || [];

      let featured = allProducts.filter(p => (p.rating || 0) >= 4.5 || p.isFeatured === true);
      if (featured.length < 4) featured = allProducts.slice(0, 6);
      featured = [...featured].sort(byLowestPriceFirst);
      setFeaturedProducts(featured.slice(0, 6));

      let newArrivals = allProducts.filter(p => p.isNew === true);
      if (newArrivals.length === 0) {
        newArrivals = [...allProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      newArrivals = [...newArrivals].sort(byLowestPriceFirst);
      setNewProducts(newArrivals.slice(0, 6));

      const deals = allProducts.filter(p => p.discount && p.discount > 0).sort(byLowestPriceFirst);
      setDealProducts(deals.slice(0, 6));
    } catch (err) {
      console.error('Home fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Could not connect to database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHomeData(); }, [fetchHomeData]);

  const handleQuickAdd = useCallback((product) => {
    if (product.countInStock <= 0) {
      alert('This item is currently out of stock.');
      return;
    }
    addToCart({ ...product, qty: 1 });
  }, [addToCart]);

  const sectionAccent = { emerald: '#3F5D45', orange: COLORS.accent, red: '#B84A4A' };

  const renderProductSection = (title, subtitle, eyebrow, products, viewAllLink, tone = 'orange', extra = null) => {
    const accent = sectionAccent[tone];
    return (
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-4 h-[2px]" style={{ backgroundColor: accent }} />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{eyebrow}</span>
            </div>
            <h2 className={`font-display text-2xl md:text-3xl font-semibold tracking-tight ${darkMode ? 'text-[#F7F1E6]' : 'text-[#1E1E1E]'}`}>
              {title}
            </h2>
            {subtitle && <p className={`font-body text-xs md:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
          </div>
          <Link
            to={viewAllLink}
            className="font-body font-bold flex items-center gap-1 hover:gap-2 transition-all text-xs group border-b-2 border-transparent pb-0.5"
            style={{ color: accent }}
          >
            See All <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {extra && <div className="mb-6">{extra}</div>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className={`font-body text-center py-12 border-2 border-dashed ${darkMode ? 'border-[#332D28] text-gray-500' : 'border-[#E2DCD5] text-gray-400'}`}>
            No products found right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`font-body min-h-screen transition-colors duration-300 overflow-x-hidden ${darkMode ? 'bg-[#161311]' : 'bg-[#F8F5F0]'}`}>
      <FontLoader />

      {/* ------------------------------------------------------------
          HERO – slideshow with triangle, NO progress indicators or line
          ------------------------------------------------------------ */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-14 overflow-hidden" style={{ backgroundColor: COLORS.primary }}>
        {/* Triangle decorative shape */}
        <div
          className="absolute bottom-0 right-0 w-1/2 h-full z-0 pointer-events-none"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            backgroundColor: COLORS.accent,
            opacity: 0.12,
          }}
        />

        {/* Image slideshow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              src={heroSlides[heroIndex].image}
              alt="Hero backdrop"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${COLORS.primary} 5%, rgba(26,58,58,0.5) 45%, rgba(0,0,0,0.5) 100%)` }} />
        </div>

        {/* Content – icons removed earlier, now also no progress line */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-2">
          <div className="min-h-[320px] flex flex-col justify-center items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-5" style={{ backgroundColor: 'rgba(212,163,115,0.15)', border: `1px solid ${COLORS.accent}`, borderRadius: '2px' }}>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: COLORS.accent }}>
                {heroSlides[heroIndex].tag}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-4 tracking-tight text-[#F7F1E6]">
              {heroSlides[heroIndex].titleEN}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {heroSlides[heroIndex].desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/shop?category=Clothing')}
                className="w-full sm:w-auto text-[#1E1E1E] px-8 py-3 font-bold flex items-center justify-center gap-2 transition transform hover:scale-[1.02] active:scale-95 text-sm"
                style={{ backgroundColor: COLORS.accent, borderRadius: '2px' }}
              >
                Shop Now
              </button>
              <Link
                to="/shop?category=Clothing&newArrival=true"
                className="w-full sm:w-auto px-8 py-3 font-bold flex items-center justify-center gap-2 transition text-[#F7F1E6] hover:bg-[#F7F1E6] hover:text-[#1E1E1E] text-sm"
                style={{ border: '1.5px solid rgba(247,241,230,0.5)', borderRadius: '2px' }}
              >
                New Items
              </Link>
            </div>
          </div>

          {/* PROGRESS BARS AND LINE REMOVED */}

          {/* Feature items – icons removed, text only */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-5 mt-8 pt-8" style={{ borderTop: '1px solid rgba(247,241,230,0.15)' }}>
            <div className="flex items-center gap-2 px-3 py-1.5 text-gray-300">
              <span className="text-[10px] md:text-xs font-semibold tracking-wide">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-gray-300">
              <span className="text-[10px] md:text-xs font-semibold tracking-wide">Safe Checkout</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-gray-300">
              <span className="text-[10px] md:text-xs font-semibold tracking-wide">Live Stock</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories – unchanged */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { id: 'Men', subtitle: 'Classic Clothes' },
            { id: 'Women', subtitle: 'Elegant Outfits' },
            { id: 'Kids', subtitle: 'Fun & Comfort' },
            { id: 'Accessories', subtitle: 'Complete Your Look' },
          ].map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=Clothing&gender=${cat.id}`}
              className={`group relative overflow-hidden h-20 md:h-28 flex flex-col justify-center px-4 md:px-6 transition-all border ${
                darkMode ? 'bg-[#1E1A17] border-[#332D28] hover:border-[#D4A373]/50' : 'bg-white border-[#E2DCD5] hover:border-[#D4A373]/60'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4A373] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: COLORS.accent }}>
                {cat.subtitle}
              </span>
              <span className={`font-display text-base md:text-lg font-semibold flex items-center gap-1 ${darkMode ? 'text-[#F7F1E6]' : 'text-[#1E1E1E]'}`}>
                {cat.id} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all" style={{ color: COLORS.accent }} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Sections – unchanged */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="p-3 mb-6 text-xs font-medium flex items-center gap-2 border" style={{ backgroundColor: 'rgba(184,74,74,0.08)', borderColor: '#B84A4A', color: '#B84A4A', borderRadius: '2px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
            <button type="button" onClick={fetchHomeData} className="ml-auto text-[10px] font-bold underline px-2 py-1">Retry</button>
          </div>
        )}

        {renderProductSection(
          'New Arrivals', 'Fresh products added today.', 'Just In',
          newProducts, '/shop?category=Clothing&newArrival=true&sort=priceAsc', 'emerald'
        )}

        {renderProductSection(
          'Top Rated', 'Highly recommended by our community.', 'Favorites',
          featuredProducts, '/shop?category=Clothing&sort=priceAsc', 'orange'
        )}

        {dealProducts.length > 0 &&
          renderProductSection(
            'Special Offers', 'Limited discounts, sorted by lowest price.', 'Ends Tonight',
            dealProducts, '/shop?category=Clothing&discount=true&sort=priceAsc', 'red',
            <DealCountdown darkMode={darkMode} />
          )
        }
      </div>

      <NewsletterSignup darkMode={darkMode} />
    </div>
  );
};

export default Home;