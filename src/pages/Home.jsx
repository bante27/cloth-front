import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Star, ChevronRight, ArrowRight, Sparkles,
  Truck, Shield, CreditCard, Clock, TrendingUp, Flame,
  Eye, Heart, Zap, Percent, Tag, Award
} from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

// ----------------------------------------------------------------------
// Product Card Component (Enhanced)
// ----------------------------------------------------------------------
const ProductCard = ({ product, onQuickAdd }) => {
  const { darkMode } = useTheme();
  const isOutOfStock = product.countInStock <= 0;
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price - (product.price * product.discount) / 100
    : null;
  
  // Calculate rating stars
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:shadow-gray-700/40'
          : 'bg-white border-gray-100 hover:shadow-indigo-100/50'
      } ${isOutOfStock ? 'opacity-70' : ''}`}
    >
      {/* Badge Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Sparkles size={10} /> NEW
          </span>
        )}
        {hasDiscount && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Percent size={10} /> -{product.discount}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Award size={10} /> BESTSELLER
          </span>
        )}
      </div>

      {/* Wishlist Button (optional) */}
      <button className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50">
        <Heart size={14} className="text-gray-600 hover:text-red-500" />
      </button>

      <Link to={`/product/${product._id}`} className="block">
        <div className={`relative aspect-square overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <img
            src={product.imageFront || product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-full transform -rotate-6 shadow-xl">
                OUT OF STOCK
              </div>
            </div>
          )}
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg hover:bg-orange-500 hover:text-white transition">
              <Eye size={14} /> Quick View
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {product.category || 'Fashion'}
          </span>
          {/* Rating Stars */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`${
                  i < fullStars
                    ? 'text-yellow-400 fill-yellow-400'
                    : i === fullStars && hasHalfStar
                    ? 'text-yellow-400 fill-yellow-400' // half-star approximation
                    : 'text-gray-300 fill-gray-300'
                }`}
              />
            ))}
            <span className="text-[10px] text-gray-500 ml-1">({product.numReviews || 0})</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className={`font-bold text-sm md:text-base line-clamp-2 mb-1 hover:text-orange-500 transition ${
            isOutOfStock ? 'text-gray-400' : darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {product.name}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className={`text-[11px] line-clamp-2 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {product.description || 'Premium quality product with excellent design and comfort.'}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div>
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-orange-600">
                  Br{discountedPrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  Br{product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className={`text-base font-bold ${isOutOfStock ? 'text-gray-400' : 'text-orange-600'}`}>
                Br{product.price?.toLocaleString()}
              </span>
            )}
          </div>
          {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd(product);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ShoppingBag size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Skeleton Loader
// ----------------------------------------------------------------------
const ProductSkeleton = () => {
  const { darkMode } = useTheme();
  return (
    <div className="animate-pulse">
      <div className={`aspect-square rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
      <div className="p-4">
        <div className={`h-3 w-1/3 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-4 w-3/4 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-3 w-full rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-5 w-1/2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Home Component
// ----------------------------------------------------------------------
const Home = ({ addToCart }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/products?limit=60');
      const allProducts = data.products || [];

      // Featured: rating >= 4.5 OR manually flagged isFeatured
      let featured = allProducts.filter(p => (p.rating || 0) >= 4.5 || p.isFeatured === true);
      if (featured.length < 4) featured = allProducts.slice(0, 4);
      setFeaturedProducts(featured.slice(0, 6));

      // New arrivals: isNew === true OR newest by createdAt
      let newArrivals = allProducts.filter(p => p.isNew === true);
      if (newArrivals.length === 0) {
        newArrivals = [...allProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setNewProducts(newArrivals.slice(0, 6));

      // Deals: products with discount > 0
      const deals = allProducts.filter(p => p.discount && p.discount > 0);
      setDealProducts(deals.slice(0, 8));
    } catch (err) {
      console.error('Home fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const handleQuickAdd = (product) => {
    if (product.countInStock <= 0) {
      alert('Out of stock');
      return;
    }
    addToCart({ ...product, qty: 1 });
  };

  const renderProductSection = (title, subtitle, icon, products, viewAllLink, badgeColor = 'orange') => (
    <div className="mb-20">
      <div className="flex flex-wrap justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className={`p-1.5 rounded-full bg-${badgeColor}-100 text-${badgeColor}-600`}>{icon}</div>}
            <h2 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
          </div>
          {subtitle && <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
        </div>
        <Link
          to={viewAllLink}
          className={`text-${badgeColor}-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm border-b border-transparent hover:border-${badgeColor}-500`}
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section - Modern Gradient Banner */}
      <section className="relative pt-20 md:pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-orange-50'}`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-200/30 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-orange-500/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-orange-200">
                  <Flame size={16} className="text-orange-500" />
                  <span className="text-orange-600 text-xs font-bold">LIMITED TIME OFFER</span>
                </div>
                <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Elevate Your
                  <span className="text-orange-500 block mt-2">Everyday Style</span>
                </h1>
                <p className={`text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Discover the perfect blend of traditional Ethiopian patterns and modern urban fashion.
                  Up to <span className="text-orange-500 font-bold">40% off</span> on selected items.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                  >
                    Shop Now <ArrowRight size={18} />
                  </button>
                  <Link
                    to="/shop?newArrival=true"
                    className={`px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition border-2 ${
                      darkMode
                        ? 'border-gray-600 text-gray-200 hover:bg-gray-800 hover:border-orange-500'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-500'
                    }`}
                  >
                    New Arrivals <Sparkles size={16} />
                  </Link>
                </div>

                {/* Trust Badges - Inline */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-orange-500" />
                    <span className="text-xs font-medium">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-orange-500" />
                    <span className="text-xs font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-orange-500" />
                    <span className="text-xs font-medium">24/7 Support</span>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="flex-1 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80"
                  alt="Hero"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 flex items-center gap-3">
                  <TrendingUp size={24} className="text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500">Trending Now</p>
                    <p className="font-bold text-sm">+250% sales this week</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category (Optional) */}
      <div className="max-w-7xl mx-auto px-4 py-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Men', 'Women', 'Kids', 'Accessories'].map((cat) => (
            <Link
              key={cat}
              to={`/shop?gender=${cat}`}
              className={`group relative overflow-hidden rounded-2xl h-32 flex items-center justify-center transition-all ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-orange-50'
              }`}
            >
              <span className="text-lg font-bold z-10">{cat}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={fetchHomeData} className="ml-auto text-xs underline">Retry</button>
          </div>
        )}

        {/* Featured Products */}
        {renderProductSection(
          'Featured Products',
          'Our best-selling pieces handpicked for you.',
          <Award size={18} />,
          featuredProducts,
          '/shop',
          'orange'
        )}

        {/* New Arrivals */}
        {renderProductSection(
          'New Arrivals',
          'Fresh from the runway – be the first to wear them.',
          <Sparkles size={18} />,
          newProducts,
          '/shop?newArrival=true',
          'emerald'
        )}

        {/* Deal of the Day / Discount Section - Best Buy style */}
        {dealProducts.length > 0 && (
          <div className="mb-20">
            <div className="flex flex-wrap justify-between items-end mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-full bg-red-100 text-red-600">
                    <Percent size={18} />
                  </div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Shop All Deals
                  </h2>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Limited time offers – up to 40% off! Don't miss out.
                </p>
              </div>
              <Link
                to="/shop?discount=true"
                className="text-red-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm border-b border-transparent hover:border-red-500"
              >
                View All Deals <ChevronRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dealProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
                ))}
              </div>
            )}

            {/* Banner CTA */}
            <div className="mt-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white text-center">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Save Big on Today's Deals</h3>
                  <p className="text-sm opacity-90">Limited quantities – shop before they're gone!</p>
                </div>
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold hover:shadow-lg transition"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;