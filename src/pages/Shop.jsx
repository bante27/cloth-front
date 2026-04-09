// pages/Shop.jsx
import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, X, Minus, Plus, Search, ChevronLeft, ChevronRight,
  Star, ShoppingBag, AlertCircle, Maximize2, Phone, Mail, MapPin, Clock
} from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

// ----------------------------------------------------------------------
// Product Card Component (with dark mode)
// ----------------------------------------------------------------------
const ProductCard = ({ product, onSelect, onQuickAdd }) => {
  const isOutOfStock = product.countInStock <= 0;
  const { darkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      onClick={() => !isOutOfStock && onSelect(product)}
      className={`group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:shadow-gray-700/30' 
          : 'bg-white border-gray-100'
      } ${isOutOfStock ? 'opacity-70' : ''}`}
      role="button"
      tabIndex={0}
    >
      <div className={`relative aspect-square overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <img
          src={product.imageFront}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            !isOutOfStock ? 'group-hover:scale-105' : ''
          }`}
          loading="lazy"
        />
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[8px] font-bold px-2 py-0.5 rounded-full shadow">
            NEW
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-500 text-white font-bold text-[9px] px-2 py-1 rounded-full transform -rotate-12 shadow-lg">
              SOLD OUT
            </div>
          </div>
        )}
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd({ ...product, qty: 1 });
            }}
            className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-orange-500 hover:text-white transition-colors"
          >
            <ShoppingBag size={12} />
          </button>
        )}
        {!isOutOfStock && product.countInStock < 5 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">
            {product.countInStock} left
          </span>
        )}
      </div>
      <div className="p-2">
        <h3 className={`font-medium text-xs line-clamp-2 mb-1 ${isOutOfStock ? 'text-gray-400' : darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {product.name.length > 35 ? `${product.name.substring(0, 35)}...` : product.name}
        </h3>
        <p className={`text-[11px] line-clamp-2 mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {product.description
            ? product.description.length > 50
              ? `${product.description.substring(0, 50)}...`
              : product.description
            : 'Premium quality product with excellent design'}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className={`text-xs font-bold ${isOutOfStock ? 'text-gray-400' : 'text-orange-600'}`}>
              Br{product.price?.toLocaleString()}
            </span>
          </div>
        </div>
        {!isOutOfStock ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="mt-1.5 text-[8px] font-medium text-orange-500 hover:text-orange-600 flex items-center gap-0.5"
          >
            View Details
            <ChevronRight size={8} />
          </button>
        ) : (
          <p className="mt-1.5 text-[8px] font-medium text-red-500">Out of stock</p>
        )}
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Skeleton Loader (dark mode aware)
// ----------------------------------------------------------------------
const ProductSkeleton = () => {
  const { darkMode } = useTheme();
  return (
    <div className="animate-pulse">
      <div className={`aspect-square rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`mt-2 h-4 rounded w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`mt-1 h-3 rounded w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`mt-2 h-8 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Pagination Component (dark mode)
// ----------------------------------------------------------------------
const Pagination = ({ page, totalPages, goToPage, goToPrevPage, goToNextPage }) => {
  const { darkMode } = useTheme();
  const getPageNumbers = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex justify-center" aria-label="Pagination">
      <div className="flex items-center gap-1">
        <button
          onClick={goToPrevPage}
          disabled={page === 1}
          className={`px-2 py-1.5 rounded-lg border transition-all text-xs ${
            page === 1
              ? darkMode ? 'border-gray-700 text-gray-600 cursor-not-allowed' : 'border-gray-200 text-gray-300 cursor-not-allowed'
              : darkMode ? 'border-gray-700 text-gray-400 hover:border-orange-400 hover:text-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500'
          }`}
        >
          <ChevronLeft size={14} />
        </button>

        <div className="flex items-center gap-0.5">
          {getPageNumbers.map((item, index) => (
            <Fragment key={index}>
              {item === '...' ? (
                <span className={`px-1 py-1.5 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
              ) : (
                <button
                  onClick={() => goToPage(item)}
                  className={`min-w-[28px] h-7 rounded-lg text-xs font-medium transition-all ${
                    page === item
                      ? 'bg-orange-500 text-white shadow-md'
                      : darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item}
                </button>
              )}
            </Fragment>
          ))}
        </div>

        <button
          onClick={goToNextPage}
          disabled={page === totalPages}
          className={`px-2 py-1.5 rounded-lg border transition-all text-xs ${
            page === totalPages
              ? darkMode ? 'border-gray-700 text-gray-600 cursor-not-allowed' : 'border-gray-200 text-gray-300 cursor-not-allowed'
              : darkMode ? 'border-gray-700 text-gray-400 hover:border-orange-400 hover:text-orange-500' : 'border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500'
          }`}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
};

// ----------------------------------------------------------------------
// Main Shop Component
// ----------------------------------------------------------------------
const Shop = ({ addToCart, userInfo }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode } = useTheme();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // IMAGE GALLERY STATE (improved)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);
  
  // COLOR VARIANTS: track currently chosen variant
  const [selectedVariant, setSelectedVariant] = useState(null);
  // SIZE SELECTION: track selected size
  const [selectedSize, setSelectedSize] = useState('');

  const searchQuery = searchParams.get('search') || '';
  const gender = searchParams.get('gender') || 'all';
  const category = searchParams.get('category') || 'all';
  const newArrival = searchParams.get('newArrival') === 'true';
  const page = Number(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const navigate = useNavigate();
  const PRODUCTS_PER_PAGE = 12;

  useEffect(() => {
    fetchProducts();
  }, [gender, category, page, searchQuery, newArrival]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (gender !== 'all') params.append('gender', gender);
      if (category !== 'all') params.append('category', category);
      if (searchQuery) params.append('search', searchQuery);
      if (newArrival) params.append('newArrival', 'true');
      params.append('page', page);
      params.append('limit', PRODUCTS_PER_PAGE);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.totalProducts || data.products?.length || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.delete('page');
    navigate({ pathname: '/shop', search: params.toString() });
  };

  const clearFilters = () => navigate('/shop');

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setSelectedSize('');
    setReviewError('');
    setRating(0);
    setComment('');
    setCurrentImageIndex(0);
    setQty(1);
  };

  const closeFullscreen = () => setFullscreenImageIndex(null);

  // COLOR VARIANTS: helper to get all images of the current selected variant
  const getVariantImages = (variant) => {
    if (!variant) return [];
    const images = [];
    if (variant.imageFront) images.push({ url: variant.imageFront, label: 'Front' });
    if (variant.imageBack) images.push({ url: variant.imageBack, label: 'Back' });
    if (variant.imageSide) images.push({ url: variant.imageSide, label: 'Side' });
    if (variant.imageDetail) images.push({ url: variant.imageDetail, label: 'Detail' });
    return images;
  };

  // When modal opens, set default variant and reset size/qty
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.variants && selectedProduct.variants.length) {
        setSelectedVariant(selectedProduct.variants[0]);
      } else {
        setSelectedVariant({
          color: selectedProduct.colors?.[0] || 'Default',
          imageFront: selectedProduct.imageFront,
          imageBack: selectedProduct.imageBack,
          imageSide: selectedProduct.imageSide,
          imageDetail: selectedProduct.imageDetail,
        });
      }
      setSelectedSize(selectedProduct.sizes?.[0] || '');
      setCurrentImageIndex(0);
      setQty(1);
    }
  }, [selectedProduct]);

  const handleColorChange = (variant) => {
    setSelectedVariant(variant);
    setCurrentImageIndex(0);
  };

  const getAllProductImages = (product, variant) => {
    if (variant) return getVariantImages(variant);
    const images = [];
    if (product.imageFront) images.push({ url: product.imageFront, label: 'Front' });
    if (product.imageBack) images.push({ url: product.imageBack, label: 'Back' });
    if (product.imageSide) images.push({ url: product.imageSide, label: 'Side' });
    if (product.imageDetail) images.push({ url: product.imageDetail, label: 'Detail' });
    if (product.images && product.images.length) {
      product.images.forEach((img, idx) => images.push({ url: img, label: `View ${idx + 1}` }));
    }
    return images;
  };

  const productImages = useMemo(() => {
    if (selectedProduct) {
      return getAllProductImages(selectedProduct, selectedVariant);
    }
    return [];
  }, [selectedProduct, selectedVariant]);

  // Navigation handlers for main carousel
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Fullscreen navigation
  const nextFullscreen = () => {
    setFullscreenImageIndex((prev) => (prev + 1) % productImages.length);
  };
  const prevFullscreen = () => {
    setFullscreenImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!userInfo || !userInfo.token) {
      setReviewError('You must be logged in to post a review');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (!rating || rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setReviewError('Please write your review');
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await API.post(
        `/products/${selectedProduct._id}/reviews`,
        { rating, comment: comment.trim() },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const newReview = { ...data.review, name: userInfo.name || "You", createdAt: new Date().toISOString() };
      const updatedProduct = { ...selectedProduct, reviews: [newReview, ...(selectedProduct.reviews || [])] };
      setSelectedProduct(updatedProduct);
      setComment('');
      setRating(0);
      setReviewError('');
      alert("Review posted successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        setReviewError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setReviewError(err.response?.data?.message || "Failed to post review");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = useCallback(() => {
    if (!selectedProduct) return;
    if (selectedProduct.countInStock <= 0) {
      alert("Sorry, this product is out of stock!");
      return;
    }
    if (!selectedSize && selectedProduct.sizes?.length) {
      alert("Please select a size");
      return;
    }
    if (qty > selectedProduct.countInStock) {
      alert(`Only ${selectedProduct.countInStock} items available in stock!`);
      return;
    }
    // Add selected size and color to cart item
    const cartItem = { 
      ...selectedProduct, 
      qty,
      selectedSize: selectedSize,
      selectedColor: selectedVariant?.color || selectedProduct.colors?.[0]
    };
    addToCart(cartItem);
    setSelectedProduct(null);
    setQty(1);
    setSelectedSize('');
  }, [selectedProduct, qty, addToCart, selectedSize, selectedVariant]);

  const isAuthenticated = userInfo && userInfo.token;

  const goToNextPage = useCallback(() => {
    if (page < totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page + 1);
      navigate({ pathname: '/shop', search: params.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, totalPages, searchParams, navigate]);

  const goToPrevPage = useCallback(() => {
    if (page > 1) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page - 1);
      navigate({ pathname: '/shop', search: params.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, searchParams, navigate]);

  const goToPage = useCallback((pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum);
    navigate({ pathname: '/shop', search: params.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, navigate]);

  const startProduct = (page - 1) * PRODUCTS_PER_PAGE + 1;
  const endProduct = Math.min(page * PRODUCTS_PER_PAGE, totalProducts);
  const handleQuickAdd = useCallback((product) => {
    if (product.countInStock <= 0) {
      alert("Out of stock");
      return;
    }
    // For quick add, use first size if available, else add without size
    const firstSize = product.sizes?.[0] || '';
    addToCart({ ...product, qty: 1, selectedSize: firstSize });
  }, [addToCart]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} font-sans antialiased`}>
      {/* Fixed Search Bar with background design */}
      <div className="fixed top-0 left-0 w-full z-40">
        <div className={`absolute inset-0 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100'}`}></div>
        <div className={`absolute inset-0 transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'bg-[radial-gradient(circle_at_20%_30%,rgba(251,146,60,0.15)_0%,rgba(249,115,22,0.08)_50%,transparent_80%)]'}`}></div>
        <div className="relative bg-white/70 backdrop-blur-sm shadow-md border-b border-orange-100 pt-20 pb-4 px-4 md:px-12">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-white/90 border-2 border-orange-200 rounded-full py-3 pl-5 pr-12 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all shadow-md"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-2 transition-all shadow-md"
                  aria-label="Submit search"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-gray-500 mt-2 font-medium">
              ✨ Discover your style – clothes, shoes, accessories & more ✨
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-36 px-4 md:px-12 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN – Contact Card with dark mode */}
          <div className="hidden md:block md:w-72 shrink-0">
            <div className="sticky top-32">
              <div className={`rounded-2xl overflow-hidden shadow-lg transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-gradient-to-br from-orange-50 via-amber-50 to-white border-orange-100/50'
              }`}>
                <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-orange-100 p-1.5 rounded-full">
                      <Phone size={14} className="text-orange-600" />
                    </div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Need Help? We're Here
                    </h3>
                  </div>

                  <a
                    href="tel:+251927993894"
                    className="flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2.5 mb-5 transition-all shadow-md hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-white" />
                      <span className="text-xs font-bold">Call or WhatsApp</span>
                    </div>
                    <span className="text-xs font-mono tracking-tight bg-white/20 px-2 py-0.5 rounded-full group-hover:bg-white/30">
                      0927 993 894
                    </span>
                  </a>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><Phone size={12} className="text-orange-500" /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                        <a href="tel:+251927993894" className={`text-xs ${darkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-800 hover:text-orange-600'} transition`}>
                          +251 927 993 894
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><Mail size={12} className="text-orange-500" /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                        <a href="mailto:support@habeshastyle.com" className={`text-xs ${darkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-800 hover:text-orange-600'} transition`}>
                          support@habeshastyle.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><MapPin size={12} className="text-orange-500" /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bole, Addis Ababa, Ethiopia</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><Clock size={12} className="text-orange-500" /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Business Hours</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mon–Sat: 9:00 AM – 6:00 PM</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                  <hr className={`my-4 ${darkMode ? 'border-gray-700' : 'border-orange-100'}`} />
                  <div className="text-center">
                    <p className={`text-[10px] italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Product Grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {!loading && `${startProduct} - ${endProduct} of ${totalProducts} products`}
              </p>
              {(searchQuery || newArrival || gender !== 'all' || category !== 'all') && (
                <button onClick={clearFilters} className="text-[10px] text-red-500 hover:text-red-600 underline">
                  Clear all filters
                </button>
              )}
            </div>

            <section className="pb-24">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                  <button onClick={fetchProducts} className="ml-auto text-xs underline">Retry</button>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array(PRODUCTS_PER_PAGE).fill().map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} onSelect={setSelectedProduct} onQuickAdd={handleQuickAdd} />
                    ))}
                  </div>
                  {products.length === 0 && !loading && (
                    <div className="text-center py-20">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>No products found.</p>
                      <button onClick={clearFilters} className="mt-3 text-orange-500 text-xs">Clear all filters</button>
                    </div>
                  )}
                  <Pagination page={page} totalPages={totalPages} goToPage={goToPage} goToPrevPage={goToPrevPage} goToNextPage={goToNextPage} />
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ========== PRODUCT MODAL (with improved image gallery) ========== */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4" onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-2 right-2 md:top-4 md:right-4 z-50 bg-black/50 hover:bg-red-500 rounded-full p-1.5 md:p-2 transition-all">
                <X size={14} className="md:w-5 md:h-5 text-white" />
              </button>

              {/* Left side - Improved Image Gallery */}
              <div className={`w-full md:w-1/2 p-3 md:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                {/* Main Image with Carousel Controls */}
                <div className="relative w-full flex items-center justify-center group">
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-0 md:-left-2 z-10 bg-white/70 hover:bg-white rounded-full p-1 shadow-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-0 md:-right-2 z-10 bg-white/70 hover:bg-white rounded-full p-1 shadow-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                  <div
                    className="relative w-full h-48 md:h-96 flex items-center justify-center cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setFullscreenImageIndex(currentImageIndex)}
                  >
                    <img
                      src={productImages[currentImageIndex]?.url}
                      alt={`${selectedProduct.name} - ${productImages[currentImageIndex]?.label || 'view'}`}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                      <Maximize2 size={20} className="md:w-8 md:h-8 text-white bg-black/50 rounded-full p-1.5 md:p-2" />
                    </div>
                  </div>
                </div>
                
                {/* Color Variants */}
                {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                  <div className="w-full mt-3">
                    <p className="text-[10px] text-gray-500 mb-1.5">Colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.map((variant, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleColorChange(variant)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            selectedVariant?.color === variant.color
                              ? 'bg-orange-500 text-white shadow-md'
                              : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {variant.color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thumbnail Strip - Horizontal Scrollable */}
                {productImages.length > 1 && (
                  <div className="w-full mt-4 md:mt-6">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <p className="text-[10px] md:text-xs text-gray-500 font-medium">More Views</p>
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={prevImage}
                          disabled={currentImageIndex === 0}
                          className="p-0.5 md:p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[9px] md:text-xs text-gray-400">
                          {currentImageIndex + 1}/{productImages.length}
                        </span>
                        <button
                          onClick={nextImage}
                          disabled={currentImageIndex === productImages.length - 1}
                          className="p-0.5 md:p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto pb-2 scrollbar-thin">
                      <div className="flex gap-1 md:gap-2 min-w-max">
                        {productImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                              currentImageIndex === idx
                                ? 'border-orange-500 shadow-md'
                                : 'border-gray-200 hover:border-orange-300'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - details with size selector */}
              <div className={`w-full md:w-1/2 p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[85vh] ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <div className="flex gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                      <span className="text-[9px] md:text-xs bg-orange-100 text-orange-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">{selectedProduct.gender}</span>
                      <span className="text-[9px] md:text-xs bg-gray-100 text-gray-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">{selectedProduct.category}</span>
                    </div>
                    <h1 className="text-sm md:text-xl font-bold mb-1 md:mb-2">{selectedProduct.name}</h1>
                    <p className="text-base md:text-2xl font-bold text-orange-600">Br{selectedProduct.price?.toLocaleString()}</p>
                    {selectedProduct.countInStock > 0 && <p className="text-[10px] md:text-xs text-green-600 mt-1">In Stock: {selectedProduct.countInStock} items</p>}
                    {selectedVariant && (
                      <p className="text-[10px] mt-1 text-gray-500">Color: <span className="font-medium">{selectedVariant.color}</span></p>
                    )}
                  </div>
                  <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  
                  {/* Size Selection */}
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2">Select Size:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                              selectedSize === size
                                ? 'bg-orange-500 text-white shadow-md'
                                : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.countInStock > 0 ? (
                    <div className="flex gap-2 md:gap-3 pt-1">
                      <div className="flex border border-gray-200 rounded-full">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"><Minus size={10} /></button>
                        <span className="w-8 md:w-10 text-center font-medium text-xs md:text-sm flex items-center justify-center">{qty}</span>
                        <button onClick={() => setQty(Math.min(selectedProduct.countInStock, qty + 1))} disabled={qty >= selectedProduct.countInStock} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"><Plus size={10} /></button>
                      </div>
                      <button onClick={handleAddToCart} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1.5 md:py-2 rounded-full text-[11px] md:text-sm transition-colors flex items-center justify-center gap-1 md:gap-2"><ShoppingBag size={12} /> Add to Cart</button>
                    </div>
                  ) : (
                    <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-1.5 md:py-2 rounded-full text-[11px] md:text-sm flex items-center justify-center gap-1 md:gap-2 cursor-not-allowed"><ShoppingBag size={12} /> Out of Stock</button>
                  )}
                  
                  <div className="pt-2 md:pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-[11px] md:text-sm mb-2 md:mb-3 flex items-center gap-1 md:gap-2"><Star size={12} className="text-yellow-500 fill-yellow-500" /> Reviews ({selectedProduct.reviews?.length || 0})</h3>
                    <div className="space-y-2 md:space-y-3 max-h-32 md:max-h-40 overflow-y-auto mb-3 md:mb-4">
                      {selectedProduct.reviews?.length > 0 ? selectedProduct.reviews.slice(0, 2).map((review, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2 md:p-3">
                          <div className="flex items-center justify-between mb-1"><span className="text-[9px] md:text-xs font-medium">{review.name}</span><div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < review.rating ? "#f59e0b" : "none"} stroke="#f59e0b" />)}</div></div>
                          <p className="text-[9px] md:text-xs text-gray-600">{review.comment}</p>
                        </div>
                      )) : <p className="text-[9px] md:text-xs text-gray-400 text-center py-2">No reviews yet</p>}
                    </div>
                    {isAuthenticated ? (
                      <form onSubmit={submitReviewHandler} className="space-y-2">
                        <div className="flex gap-0.5 md:gap-1">{[...Array(5)].map((_, star) => <button key={star + 1} type="button" onClick={() => setRating(star + 1)}><Star size={14} fill={star + 1 <= rating ? "#f59e0b" : "none"} stroke="#f59e0b" /></button>)}</div>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write review..." rows={2} className="w-full border border-gray-200 rounded-lg p-1.5 md:p-2 text-[10px] md:text-xs focus:outline-none focus:border-orange-300" />
                        {reviewError && <p className="text-[9px] text-red-500">{reviewError}</p>}
                        <button type="submit" disabled={submittingReview} className="w-full bg-gray-800 text-white py-1.5 rounded-lg text-[10px] font-medium hover:bg-orange-500 transition-colors">{submittingReview ? 'Posting...' : 'Submit Review'}</button>
                      </form>
                    ) : (
                      <p className="text-center text-[9px] text-gray-500 py-2"><span onClick={() => navigate('/login')} className="text-orange-500 cursor-pointer">Login</span> to review</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== FULLSCREEN LIGHTBOX (with carousel navigation) ========== */}
      <AnimatePresence>
        {fullscreenImageIndex !== null && productImages.length > 0 && (
          <div className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center" onClick={closeFullscreen}>
            <button onClick={closeFullscreen} className="absolute top-2 right-2 md:top-4 md:right-4 z-50 bg-white/20 hover:bg-red-500 rounded-full p-1.5 md:p-2 transition-all">
              <X size={16} className="text-white" />
            </button>
            
            {/* Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevFullscreen(); }}
                  className="absolute left-2 md:left-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextFullscreen(); }}
                  className="absolute right-2 md:right-4 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              </>
            )}
            
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={productImages[fullscreenImageIndex]?.url}
              alt="Fullscreen"
              className="max-w-[95vw] max-h-[95vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Image counter */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                {fullscreenImageIndex + 1} / {productImages.length}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;