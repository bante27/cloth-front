import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Star, ChevronRight, ArrowRight, Sparkles,
  Truck, Shield, Clock, Flame, Eye, Heart, Percent, Award, AlertCircle,
  Mail, CheckCircle2, Timer
} from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

// Hero Images directly resolved by Vite asset pipelines
import hero1 from '../assets/image.png';
import hero2 from '../assets/image1.png';
import hero3 from '../assets/image2.png';
import hero4 from '../assets/image4.jpg';
import hero5 from '../assets/image3.png';

// ----------------------------------------------------------------------
// Design tokens (tibeb-woven palette — pulled from the thread colors used
// in traditional Ethiopian border weaving, not a generic storefront theme)
// ----------------------------------------------------------------------
const INK = '#241F1C';
const IVORY = '#F7F1E6';
const GOLD = '#C98A3B';
const GREEN = '#3F5D45';
const WINE = '#7A2E3A';

// ----------------------------------------------------------------------
// Signature element: a thin woven zigzag border, standing in for the
// generic gradient-blob divider. Used as a hero progress track, a section
// divider, and a card hover accent.
// ----------------------------------------------------------------------
const TibebBorder = ({ className = '', color = GOLD, opacity = 1 }) => (
  <svg
    className={className}
    viewBox="0 0 120 10"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
  >
    <polyline
      points="0,10 6,1 12,10 18,1 24,10 30,1 36,10 42,1 48,10 54,1 60,10 66,1 72,10 78,1 84,10 90,1 96,10 102,1 108,10 114,1 120,10"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
    .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
    .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  `}</style>
);

// ----------------------------------------------------------------------
// Product Card
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
          ? 'bg-[#1E1A17] border-[#332D28] hover:border-[#C98A3B]/50'
          : 'bg-white border-[#E7DFCF] hover:border-[#C98A3B]/60'
      } ${isOutOfStock ? 'opacity-70' : ''}`}
      style={{ borderRadius: '2px' }}
    >
      {/* Signature top accent — reveals on hover instead of a shadow glow */}
      <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <TibebBorder className="w-full h-full" color={hasDiscount ? WINE : GOLD} />
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span
            className="text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 flex items-center gap-1"
            style={{ backgroundColor: GREEN, borderRadius: '2px' }}
          >
            New
          </span>
        )}
        {hasDiscount && (
          <span
            className="text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 flex items-center gap-1"
            style={{ backgroundColor: WINE, borderRadius: '2px' }}
          >
            −{product.discount}%
          </span>
        )}
        {product.isBestSeller && (
          <span
            className="text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 flex items-center gap-1"
            style={{ backgroundColor: GOLD, borderRadius: '2px' }}
          >
            Trending
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
        style={{ borderRadius: '2px' }}
      >
        <Heart size={15} className="text-[#241F1C] hover:text-[#7A2E3A] transition-colors" />
      </button>

      {/* Image */}
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
            <div className="bg-[#7A2E3A] text-white font-bold text-xs px-4 py-2 tracking-widest uppercase" style={{ borderRadius: '2px' }}>
              Sold Out
            </div>
          </div>
        )}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <span
              className="bg-[#F7F1E6] text-[#241F1C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#C98A3B] hover:text-white transition-colors"
              style={{ borderRadius: '2px' }}
            >
              <Eye size={14} /> Quick View
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${darkMode ? 'text-[#C98A3B]' : 'text-[#96602B]'}`}>
            {product.category || 'Clothing'}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={`${
                  i < fullStars || (i === fullStars && hasHalfStar)
                    ? 'text-[#C98A3B] fill-[#C98A3B]'
                    : darkMode ? 'text-[#3A332C] fill-[#3A332C]' : 'text-[#DDD3BC] fill-[#DDD3BC]'
                }`}
              />
            ))}
            <span className={`text-[10px] ml-1 font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              ({product.numReviews || 0})
            </span>
          </div>
        </div>

        <h3 className={`font-display font-semibold text-lg leading-snug line-clamp-1 mb-1.5 ${
          isOutOfStock ? 'text-gray-400' : darkMode ? 'text-[#F7F1E6]' : 'text-[#241F1C]'
        }`}>
          {product.name}
        </h3>

        <p className={`text-xs line-clamp-2 mb-4 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {product.description || 'Handmade with traditional detail.'}
        </p>

        <div className={`flex items-center justify-between pt-3 border-t ${darkMode ? 'border-[#332D28]' : 'border-[#EEE6D4]'}`}>
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 line-through">
                  Br {(product.price || 0).toLocaleString()}
                </span>
                <span className="font-display text-lg font-bold" style={{ color: WINE }}>
                  Br {(discountedPrice || 0).toLocaleString()}
                </span>
              </div>
            ) : (
              <span className={`font-display text-lg font-bold ${isOutOfStock ? 'text-gray-400' : darkMode ? 'text-[#F7F1E6]' : 'text-[#241F1C]'}`}>
                Br {(product.price || 0).toLocaleString()}
              </span>
            )}
          </div>
          {!isOutOfStock && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickAdd(product); }}
              className="text-white p-2.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: INK, borderRadius: '2px' }}
            >
              <ShoppingBag size={16} />
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
      <div className="p-4">
        <div className={`h-3 w-1/4 mb-3 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        <div className={`h-5 w-3/4 mb-2 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        <div className={`h-3 w-full mb-4 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        <div className="flex justify-between items-center">
          <div className={`h-6 w-20 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
          <div className={`h-8 w-8 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F1EBDC]'}`} />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Countdown
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
        className={`font-display text-lg md:text-xl font-bold tabular-nums px-2.5 py-1 ${darkMode ? 'bg-[#1E1A17] text-[#E7A85E]' : 'bg-white text-[#7A2E3A]'}`}
        style={{ borderRadius: '2px' }}
      >
        {value}
      </span>
      <span className="text-[9px] uppercase tracking-widest mt-1 font-bold text-gray-400">{label}</span>
    </div>
  );
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 border ${darkMode ? 'bg-[#241417] border-[#4A2530]' : 'bg-[#FBEEEE] border-[#EDD6D6]'}`} style={{ borderRadius: '2px' }}>
      <Timer size={16} style={{ color: WINE }} className="flex-shrink-0" />
      <div className="flex items-center gap-2">
        <Unit value={hours} label="hrs" />
        <span className="text-gray-300">:</span>
        <Unit value={minutes} label="min" />
        <span className="text-gray-300">:</span>
        <Unit value={seconds} label="sec" />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wide ml-1 hidden sm:inline" style={{ color: WINE }}>
        left today
      </span>
    </div>
  );
};

// ----------------------------------------------------------------------
// Newsletter — same subscribe/localStorage logic, restyled
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
    <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 mb-20" style={{ backgroundColor: INK, borderRadius: '2px' }}>
      <div className="absolute top-0 left-0 right-0 h-1">
        <TibebBorder className="w-full h-full" color={GOLD} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-16 md:py-20">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-6" style={{ backgroundColor: 'rgba(201,138,59,0.15)', borderRadius: '2px' }}>
          <Mail size={20} style={{ color: GOLD }} />
        </div>

        <h3 className="font-display text-3xl md:text-4xl font-semibold mb-3 text-[#F7F1E6]">
          Stay Ahead of the Trend
        </h3>
        <p className="text-sm text-gray-400 mb-10 font-body">
          One email a week. New arrivals, a welcome discount, nothing else.
        </p>

        {status === 'done' ? (
          <div className="inline-flex items-center gap-2 font-semibold text-sm text-[#F7F1E6] max-w-md mx-auto px-6 py-4" style={{ backgroundColor: 'rgba(63,93,69,0.2)', border: `1px solid ${GREEN}`, borderRadius: '2px' }}>
            <CheckCircle2 size={18} style={{ color: '#7FBF8E' }} /> You're subscribed — check your email for your code.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
              placeholder="your@email.com"
              className={`flex-1 px-5 py-3.5 text-sm font-medium outline-none transition bg-[#1E1A17] text-[#F7F1E6] border placeholder:text-gray-600 focus:border-[#C98A3B] ${status === 'error' ? 'border-[#7A2E3A]' : 'border-[#332D28]'}`}
              style={{ borderRadius: '2px' }}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-6 py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-95 disabled:opacity-60 text-[#241F1C]"
              style={{ backgroundColor: GOLD, borderRadius: '2px' }}
            >
              {status === 'submitting' ? 'Subscribing…' : 'Subscribe'} <ArrowRight size={16} />
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs font-semibold mt-3 text-[#F7F1E6] inline-block px-3 py-1" style={{ backgroundColor: WINE, borderRadius: '2px' }}>
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------
// Home
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

  const heroSlides = useMemo(() => [
    { image: hero1, tag: 'Premium Cultural Wear', titleEN: 'Upgrade Your Style.', desc: 'Look your best with our top collection. Find real handmade items updated daily.' },
    { image: hero2, tag: 'Modern & Trendy', titleEN: 'Own Your Tradition.', desc: 'Enjoy a mix of traditional cloth and modern fashion styles.' },
    { image: hero3, tag: 'Handcrafted Luxury', titleEN: 'Pure Quality.', desc: 'Every item has a story. Get high quality clothing delivered straight to your home.' },
    { image: hero4, tag: 'Wedding & Festive', titleEN: 'Elegant Outfits.', desc: 'Explore stunning custom clothing styles perfect for special days and luxury weddings.' },
    { image: hero5, tag: 'Seasonal Outfits', titleEN: 'Timeless Looks.', desc: 'See special clothes handmade by expert weavers using safe materials.' },
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, HERO_DURATION);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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

  const sectionAccent = { emerald: GREEN, orange: GOLD, red: WINE };

  const renderProductSection = (title, subtitle, eyebrow, products, viewAllLink, tone = 'orange', extra = null) => {
    const accent = sectionAccent[tone];
    return (
      <div className="mb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px]" style={{ backgroundColor: accent }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>{eyebrow}</span>
            </div>
            <h2 className={`font-display text-3xl md:text-5xl font-semibold tracking-tight ${darkMode ? 'text-[#F7F1E6]' : 'text-[#241F1C]'}`}>
              {title}
            </h2>
            {subtitle && <p className={`font-body text-sm md:text-base mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
          </div>
          <Link
            to={viewAllLink}
            className="font-body font-bold flex items-center gap-1.5 hover:gap-3 transition-all text-sm group border-b-2 border-transparent pb-1"
            style={{ color: accent }}
          >
            See All <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {extra && <div className="mb-8">{extra}</div>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className={`font-body text-center py-16 border-2 border-dashed ${darkMode ? 'border-[#332D28] text-gray-500' : 'border-[#E7DFCF] text-gray-400'}`}>
            No products found right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`font-body min-h-screen transition-colors duration-300 overflow-x-hidden ${darkMode ? 'bg-[#161311]' : 'bg-[#F7F1E6]'}`}>
      <FontLoader />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-20 overflow-hidden" style={{ backgroundColor: INK }}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              src={heroSlides[heroIndex].image}
              alt="Hero backdrop"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${INK} 5%, rgba(36,31,28,0.5) 45%, rgba(0,0,0,0.5) 100%)` }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-2">
          <div className="min-h-[380px] flex flex-col justify-center items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8" style={{ backgroundColor: 'rgba(201,138,59,0.15)', border: `1px solid ${GOLD}`, borderRadius: '2px' }}>
              <Flame size={13} style={{ color: GOLD }} />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                {heroSlides[heroIndex].tag}
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] mb-6 tracking-tight text-[#F7F1E6]">
              {heroSlides[heroIndex].titleEN}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {heroSlides[heroIndex].desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/shop?category=Clothing')}
                className="w-full sm:w-auto text-[#241F1C] px-10 py-4 font-bold flex items-center justify-center gap-3 transition transform hover:scale-[1.02] active:scale-95 text-base"
                style={{ backgroundColor: GOLD, borderRadius: '2px' }}
              >
                Shop Now <ArrowRight size={20} />
              </button>
              <Link
                to="/shop?category=Clothing&newArrival=true"
                className="w-full sm:w-auto px-10 py-4 font-bold flex items-center justify-center gap-2 transition text-[#F7F1E6] hover:bg-[#F7F1E6] hover:text-[#241F1C] text-base"
                style={{ border: '1.5px solid rgba(247,241,230,0.5)', borderRadius: '2px' }}
              >
                New Items <Sparkles size={16} />
              </Link>
            </div>
          </div>

          {/* Hero progress indicator — replaces round dots with a woven tick track */}
          <div className="mt-12">
            <div className="flex justify-center items-end gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="relative h-[3px] w-10 overflow-hidden"
                  style={{ backgroundColor: 'rgba(247,241,230,0.2)' }}
                >
                  {heroIndex === i && (
                    <motion.span
                      key={heroIndex}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: HERO_DURATION / 1000, ease: 'linear' }}
                      className="absolute inset-0 origin-left"
                      style={{ backgroundColor: GOLD }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="w-24 h-2 mx-auto mt-3 opacity-70">
              <TibebBorder className="w-full h-full" color={GOLD} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-10 pt-10" style={{ borderTop: '1px solid rgba(247,241,230,0.15)' }}>
            <div className="flex items-center gap-2.5 px-4 py-2 text-gray-300">
              <Truck size={18} style={{ color: GOLD }} />
              <span className="text-xs md:text-sm font-semibold tracking-wide">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 text-gray-300">
              <Shield size={18} style={{ color: GOLD }} />
              <span className="text-xs md:text-sm font-semibold tracking-wide">Safe Checkout</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 text-gray-300">
              <Clock size={18} style={{ color: GOLD }} />
              <span className="text-xs md:text-sm font-semibold tracking-wide">Live Stock Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { id: 'Men', subtitle: 'Classic Clothes' },
            { id: 'Women', subtitle: 'Elegant Outfits' },
            { id: 'Kids', subtitle: 'Fun & Comfort' },
            { id: 'Accessories', subtitle: 'Complete Your Look' },
          ].map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=Clothing&gender=${cat.id}`}
              className={`group relative overflow-hidden h-28 md:h-36 flex flex-col justify-center px-6 md:px-8 transition-all border ${
                darkMode ? 'bg-[#1E1A17] border-[#332D28] hover:border-[#C98A3B]/50' : 'bg-white border-[#E7DFCF] hover:border-[#C98A3B]/60'
              }`}
              style={{ borderRadius: '2px' }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TibebBorder className="w-full h-full" color={GOLD} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: GOLD }}>
                {cat.subtitle}
              </span>
              <span className={`font-display text-xl md:text-2xl font-semibold flex items-center gap-1 ${darkMode ? 'text-[#F7F1E6]' : 'text-[#241F1C]'}`}>
                {cat.id} <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all" style={{ color: GOLD }} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="p-5 mb-10 text-sm font-medium flex items-center gap-3 border" style={{ backgroundColor: 'rgba(122,46,58,0.08)', borderColor: WINE, color: WINE, borderRadius: '2px' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button type="button" onClick={fetchHomeData} className="ml-auto text-xs font-bold underline px-3 py-1.5">Try Again</button>
          </div>
        )}

        {renderProductSection(
          'New Arrivals', 'Fresh products added to our catalog today.', 'Just In',
          newProducts, '/shop?category=Clothing&newArrival=true&sort=priceAsc', 'emerald'
        )}

        {renderProductSection(
          'Top Rated', 'Highly recommended products from our community.', 'Community Favorites',
          featuredProducts, '/shop?category=Clothing&sort=priceAsc', 'orange'
        )}

        {dealProducts.length > 0 &&
          renderProductSection(
            'Special Offers', 'Limited time discounts, sorted by lowest price.', 'Ends Tonight',
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