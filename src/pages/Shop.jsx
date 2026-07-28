// pages/Shop.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  X, Minus, Plus, Search, ChevronLeft, ChevronRight,
  Star, ShoppingBag, AlertCircle, Maximize2, Phone, Mail, MapPin, Clock
} from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { ProductCard, ProductSkeleton, Pagination } from '../components/ShopComponents';

// ----------------------------------------------------------------------
// Design tokens — same tibeb-woven palette as Home.jsx, kept consistent
// across the site rather than reinvented per page.
// ----------------------------------------------------------------------
const INK = '#241F1C';
const IVORY = '#F7F1E6';
const GOLD = '#C98A3B';
const GREEN = '#3F5D45';
const WINE = '#7A2E3A';

const TibebBorder = ({ className = '', color = GOLD, opacity = 1 }) => (
  <svg className={className} viewBox="0 0 120 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
    <polyline
      points="0,10 6,1 12,10 18,1 24,10 30,1 36,10 42,1 48,10 54,1 60,10 66,1 72,10 78,1 84,10 90,1 96,10 102,1 108,10 114,1 120,10"
      fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
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

const Shop = ({ addToCart, userInfo }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // --- Admin contact info ---
  const [adminContact, setAdminContact] = useState(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // --- Product & UI state ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // --- Vertical scrolling placeholder state ---
  const categories = ['cloth', 'shoes', 'accessories', 'home', 'gift'];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayPlaceholder, setDisplayPlaceholder] = useState(categories[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % categories.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayPlaceholder(categories[placeholderIndex]);
  }, [placeholderIndex]);

  const searchQuery = searchParams.get('search') || '';
  const gender = searchParams.get('gender') || 'all';
  const category = searchParams.get('category') || 'all';
  const newArrival = searchParams.get('newArrival') === 'true';
  const page = Number(searchParams.get('page')) || 1;
  const PRODUCTS_PER_PAGE = 12;

  // --- Fetch admin contact ---
  useEffect(() => {
    const fetchAdminContact = async () => {
      setContactLoading(true);
      try {
        const { data } = await API.get('/users/admin/contact');
        setAdminContact(data);
      } catch (err) {
        console.error('Failed to fetch admin contact:', err);
        setAdminContact(null);
      } finally {
        setContactLoading(false);
      }
    };
    fetchAdminContact();
  }, []);

  // --- Fetch user profile ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userInfo?.token) {
        setUserProfile(null);
        return;
      }
      try {
        const { data } = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setUserProfile(data.user);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setUserProfile(null);
      }
    };
    fetchUserProfile();
  }, [userInfo?.token]);

  // --- Fetch products ---
  const fetchProducts = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, [gender, category, page, searchQuery, newArrival]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Handlers (unchanged) ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) params.set('search', searchInput.trim());
    else params.delete('search');
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

  const getVariantImages = (variant) => {
    if (!variant) return [];
    const images = [];
    if (variant.imageFront) images.push({ url: variant.imageFront, label: 'Front' });
    if (variant.imageBack) images.push({ url: variant.imageBack, label: 'Back' });
    if (variant.imageSide) images.push({ url: variant.imageSide, label: 'Side' });
    if (variant.imageDetail) images.push({ url: variant.imageDetail, label: 'Detail' });
    return images;
  };

  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.variants?.length) setSelectedVariant(selectedProduct.variants[0]);
      else setSelectedVariant({
        color: selectedProduct.colors?.[0] || 'Default',
        imageFront: selectedProduct.imageFront,
        imageBack: selectedProduct.imageBack,
        imageSide: selectedProduct.imageSide,
        imageDetail: selectedProduct.imageDetail,
      });
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
    if (product.images) product.images.forEach((img, idx) => images.push({ url: img, label: `View ${idx + 1}` }));
    return images;
  };

  const productImages = useMemo(() => {
    if (selectedProduct) return getAllProductImages(selectedProduct, selectedVariant);
    return [];
  }, [selectedProduct, selectedVariant]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  const nextFullscreen = () => setFullscreenImageIndex((prev) => (prev + 1) % productImages.length);
  const prevFullscreen = () => setFullscreenImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!userInfo?.token) {
      setReviewError('You must be logged in to post a review');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (!rating) {
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
      setSelectedProduct({ ...selectedProduct, reviews: [newReview, ...(selectedProduct.reviews || [])] });
      setComment('');
      setRating(0);
      alert("Review posted successfully!");
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to post review");
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
    addToCart({
      ...selectedProduct,
      qty,
      selectedSize,
      selectedColor: selectedVariant?.color || selectedProduct.colors?.[0]
    });
    closeModal();
  }, [selectedProduct, qty, addToCart, selectedSize, selectedVariant]);

  const handleQuickAdd = useCallback((product) => {
    if (product.countInStock <= 0) {
      alert("Out of stock");
      return;
    }
    addToCart({ ...product, qty: 1, selectedSize: product.sizes?.[0] || '' });
  }, [addToCart]);

  const goToNextPage = () => {
    if (page < totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page + 1);
      navigate({ pathname: '/shop', search: params.toString() });
      window.scrollTo({ top: 0 });
    }
  };
  const goToPrevPage = () => {
    if (page > 1) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page - 1);
      navigate({ pathname: '/shop', search: params.toString() });
      window.scrollTo({ top: 0 });
    }
  };
  const goToPage = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum);
    navigate({ pathname: '/shop', search: params.toString() });
    window.scrollTo({ top: 0 });
  };

  const startProduct = (page - 1) * PRODUCTS_PER_PAGE + 1;
  const endProduct = Math.min(page * PRODUCTS_PER_PAGE, totalProducts);

  const storePhone = adminContact?.phone || '0927993894';
  const storeEmail = adminContact?.email || 'mitikubantalem07@gmail.com';
  const storeAddress = adminContact?.address || 'addis abeba';
  const storeHours = adminContact?.hours || 'Mon–Sat: 9:00 AM – 6:00 PM';
  const storeClosed = adminContact?.closed || 'Sunday: Closed';

  return (
    <div className={`font-body min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#161311] text-[#F7F1E6]' : 'bg-[#F7F1E6] text-[#241F1C]'} antialiased`}>
      <FontLoader />

      {/* Fixed Search Bar */}
      <div className="fixed top-0 left-0 w-full z-40">
        <div className={`absolute inset-0 transition-colors duration-300 ${darkMode ? 'bg-[#1E1A17]' : 'bg-[#F7F1E6]'}`} />
        <div
          className={`relative backdrop-blur-sm border-b pt-20 pb-4 px-3 sm:px-4 md:px-12 ${darkMode ? 'bg-[#1E1A17]/80 border-[#332D28]' : 'bg-white/70 border-[#E7DFCF]'}`}
        >
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={displayPlaceholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={`w-full py-3 pl-5 pr-12 text-sm outline-none transition-all border ${
                    darkMode
                      ? 'bg-[#241F1C] border-[#332D28] text-[#F7F1E6] focus:border-[#C98A3B] placeholder:text-gray-600'
                      : 'bg-white border-[#E7DFCF] focus:border-[#C98A3B]'
                  }`}
                  style={{ borderRadius: '2px' }}
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white p-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: INK, borderRadius: '2px' }}
                  aria-label="Submit search"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
            <p className={`text-center text-[10px] mt-2 font-medium tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Discover your style — clothes, shoes, accessories & more
            </p>
          </div>
        </div>
        <div className="h-[3px] w-full">
          <TibebBorder className="w-full h-full" color={GOLD} />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-40 px-3 sm:px-4 md:px-12 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN – Contact Card */}
          <div className="hidden md:block md:w-72 shrink-0">
            <div className="sticky top-40">
              <div
                className={`overflow-hidden border ${darkMode ? 'bg-[#1E1A17] border-[#332D28]' : 'bg-white border-[#E7DFCF]'}`}
                style={{ borderRadius: '2px' }}
              >
                <div className="h-[3px]"><TibebBorder className="w-full h-full" color={GOLD} /></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div style={{ backgroundColor: 'rgba(201,138,59,0.15)', borderRadius: '2px' }} className="p-1.5">
                      <Phone size={13} style={{ color: GOLD }} />
                    </div>
                    <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Need Help? We're Here
                    </h3>
                  </div>

                  <a
                    href={`tel:${storePhone.replace(/\s/g, '')}`}
                    className="flex items-center justify-between text-white px-4 py-2.5 mb-5 transition-all group hover:opacity-90"
                    style={{ backgroundColor: INK, borderRadius: '2px' }}
                  >
                    <div className="flex items-center gap-2">
                      <Phone size={14} style={{ color: GOLD }} />
                      <span className="text-xs font-bold">Call or WhatsApp</span>
                    </div>
                    <span className="text-xs font-mono tracking-tight px-2 py-0.5" style={{ backgroundColor: 'rgba(247,241,230,0.15)', borderRadius: '2px' }}>
                      {storePhone}
                    </span>
                  </a>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><Phone size={12} style={{ color: GOLD }} /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                        <a href={`tel:${storePhone.replace(/\s/g, '')}`} className={`text-xs transition ${darkMode ? 'text-gray-300 hover:text-[#C98A3B]' : 'text-gray-800 hover:text-[#96602B]'}`}>
                          {storePhone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><Mail size={12} style={{ color: GOLD }} /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                        <a href={`mailto:${storeEmail}`} className={`text-xs transition ${darkMode ? 'text-gray-300 hover:text-[#C98A3B]' : 'text-gray-800 hover:text-[#96602B]'}`}>
                          {storeEmail}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><MapPin size={12} style={{ color: GOLD }} /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{storeAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5"><Clock size={12} style={{ color: GOLD }} /></div>
                      <div>
                        <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Business Hours</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{storeHours}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{storeClosed}</p>
                      </div>
                    </div>
                  </div>
                  <hr className={`my-4 ${darkMode ? 'border-[#332D28]' : 'border-[#EEE6D4]'}`} />
                  <div className="text-center">
                    <p className={`text-[10px] italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Grid: 2 cols mobile, 4 cols desktop, with gaps */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {!loading && `${startProduct} - ${endProduct} of ${totalProducts} products`}
              </p>
              {(searchQuery || newArrival || gender !== 'all' || category !== 'all') && (
                <button onClick={clearFilters} className="text-[10px] font-semibold underline" style={{ color: WINE }}>
                  Clear all filters
                </button>
              )}
            </div>

            <section className="pb-24">
              {error && (
                <div className="p-4 mb-4 text-sm flex items-center gap-2 border" style={{ backgroundColor: 'rgba(122,46,58,0.08)', borderColor: WINE, color: WINE, borderRadius: '2px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                  <button onClick={fetchProducts} className="ml-auto text-xs font-semibold underline">Retry</button>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {Array(PRODUCTS_PER_PAGE).fill().map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onSelect={setSelectedProduct}
                        onQuickAdd={handleQuickAdd}
                      />
                    ))}
                  </div>
                  {products.length === 0 && !loading && (
                    <div className="text-center py-20">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>No products found.</p>
                      <button onClick={clearFilters} className="mt-3 text-xs font-semibold" style={{ color: GOLD }}>Clear all filters</button>
                    </div>
                  )}
                  <Pagination page={page} totalPages={totalPages} goToPage={goToPage} goToPrevPage={goToPrevPage} goToNextPage={goToNextPage} />
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ========== PRODUCT MODAL ========== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[2000] bg-black/70 flex items-center justify-center p-2 md:p-4" onClick={closeModal}>
          <div
            className={`relative w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row ${darkMode ? 'bg-[#1E1A17]' : 'bg-white'}`}
            style={{ borderRadius: '2px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-1.5 md:p-2 transition-all hover:opacity-90" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '2px' }}>
              <X size={14} className="md:w-5 md:h-5 text-white" />
            </button>

            {/* Left side - Image Gallery */}
            <div className={`w-full md:w-1/2 p-3 md:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r ${darkMode ? 'bg-[#141110] border-[#332D28]' : 'bg-[#F1EBDC] border-[#E7DFCF]'}`}>
              <div className="relative w-full flex items-center justify-center">
                {productImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-0 md:-left-2 z-10 bg-white/80 hover:bg-white p-1" style={{ borderRadius: '2px' }}>
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className="absolute right-0 md:-right-2 z-10 bg-white/80 hover:bg-white p-1" style={{ borderRadius: '2px' }}>
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                <div className="relative w-full h-48 md:h-96 flex items-center justify-center cursor-pointer overflow-hidden" style={{ borderRadius: '2px' }} onClick={() => setFullscreenImageIndex(currentImageIndex)}>
                  <img src={productImages[currentImageIndex]?.url} alt={`${selectedProduct.name} - ${productImages[currentImageIndex]?.label || 'view'}`} className="max-w-full max-h-full object-contain" />
                </div>
              </div>

              {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                <div className="w-full mt-3">
                  <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleColorChange(variant)}
                        className="px-3 py-1 text-xs font-medium transition-all"
                        style={{
                          borderRadius: '2px',
                          backgroundColor: selectedVariant?.color === variant.color ? GOLD : darkMode ? '#241F1C' : '#F1EBDC',
                          color: selectedVariant?.color === variant.color ? '#241F1C' : darkMode ? '#D8D0C2' : '#4A443C',
                        }}
                      >
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {productImages.length > 1 && (
                <div className="w-full mt-4 md:mt-6">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider">More Views</p>
                    <div className="flex gap-1 md:gap-2 items-center">
                      <button onClick={prevImage} disabled={currentImageIndex === 0} className="p-0.5 md:p-1 hover:bg-black/5 disabled:opacity-30"><ChevronLeft size={14} /></button>
                      <span className="text-[9px] md:text-xs text-gray-400">{currentImageIndex + 1}/{productImages.length}</span>
                      <button onClick={nextImage} disabled={currentImageIndex === productImages.length - 1} className="p-0.5 md:p-1 hover:bg-black/5 disabled:opacity-30"><ChevronRight size={14} /></button>
                    </div>
                  </div>
                  <div className="overflow-x-auto pb-2 scrollbar-thin">
                    <div className="flex gap-1 md:gap-2 min-w-max">
                      {productImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className="w-12 h-12 md:w-16 md:h-16 overflow-hidden border-2 flex-shrink-0"
                          style={{ borderRadius: '2px', borderColor: currentImageIndex === idx ? GOLD : (darkMode ? '#332D28' : '#E7DFCF') }}
                        >
                          <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - details */}
            <div className={`w-full md:w-1/2 p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[85vh] ${darkMode ? 'text-[#F7F1E6]' : 'text-[#241F1C]'}`}>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <div className="flex gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 md:py-1" style={{ backgroundColor: 'rgba(201,138,59,0.15)', color: '#96602B', borderRadius: '2px' }}>{selectedProduct.gender}</span>
                    <span className={`text-[9px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 md:py-1 ${darkMode ? 'bg-[#241F1C] text-gray-300' : 'bg-[#F1EBDC] text-gray-600'}`} style={{ borderRadius: '2px' }}>{selectedProduct.category}</span>
                  </div>
                  <h1 className="font-display text-base md:text-2xl font-semibold mb-1 md:mb-2">{selectedProduct.name}</h1>
                  <p className="font-display text-lg md:text-2xl font-bold" style={{ color: WINE }}>Br {selectedProduct.price?.toLocaleString()}</p>
                  {selectedProduct.countInStock > 0 && <p className="text-[10px] md:text-xs mt-1" style={{ color: GREEN }}>In Stock: {selectedProduct.countInStock} items</p>}
                  {selectedVariant && <p className="text-[10px] mt-1 text-gray-500">Color: <span className="font-medium">{selectedVariant.color}</span></p>}
                </div>
                <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed">{selectedProduct.description}</p>

                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-500">Select Size</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className="px-3 py-1.5 text-xs font-semibold transition-all"
                          style={{
                            borderRadius: '2px',
                            backgroundColor: selectedSize === size ? INK : darkMode ? '#241F1C' : '#F1EBDC',
                            color: selectedSize === size ? '#F7F1E6' : darkMode ? '#D8D0C2' : '#4A443C',
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.countInStock > 0 ? (
                  <div className="flex gap-2 md:gap-3 pt-1">
                    <div className={`flex border ${darkMode ? 'border-[#332D28]' : 'border-[#E7DFCF]'}`} style={{ borderRadius: '2px' }}>
                      <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-black/5 disabled:opacity-50"><Minus size={10} /></button>
                      <span className="w-8 md:w-10 text-center font-semibold text-xs md:text-sm flex items-center justify-center">{qty}</span>
                      <button onClick={() => setQty(Math.min(selectedProduct.countInStock, qty + 1))} disabled={qty >= selectedProduct.countInStock} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-black/5 disabled:opacity-50"><Plus size={10} /></button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 text-white font-bold py-1.5 md:py-2 text-[11px] md:text-sm transition-colors flex items-center justify-center gap-1 md:gap-2 hover:opacity-90"
                      style={{ backgroundColor: INK, borderRadius: '2px' }}
                    >
                      <ShoppingBag size={12} /> Add to Cart
                    </button>
                  </div>
                ) : (
                  <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-1.5 md:py-2 text-[11px] md:text-sm flex items-center justify-center gap-1 md:gap-2 cursor-not-allowed" style={{ borderRadius: '2px' }}>
                    <ShoppingBag size={12} /> Out of Stock
                  </button>
                )}

                <div className={`pt-2 md:pt-4 border-t ${darkMode ? 'border-[#332D28]' : 'border-[#EEE6D4]'}`}>
                  <h3 className="font-display font-semibold text-[11px] md:text-sm mb-2 md:mb-3 flex items-center gap-1 md:gap-2">
                    <Star size={12} style={{ color: GOLD }} className="fill-current" /> Reviews ({selectedProduct.reviews?.length || 0})
                  </h3>
                  <div className="space-y-2 md:space-y-3 max-h-32 md:max-h-40 overflow-y-auto mb-3 md:mb-4">
                    {selectedProduct.reviews?.length > 0 ? selectedProduct.reviews.slice(0, 2).map((review, idx) => (
                      <div key={idx} className={`p-2 md:p-3 ${darkMode ? 'bg-[#141110]' : 'bg-[#F1EBDC]'}`} style={{ borderRadius: '2px' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] md:text-xs font-semibold">{review.name}</span>
                          <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < review.rating ? GOLD : "none"} stroke={GOLD} />)}</div>
                        </div>
                        <p className="text-[9px] md:text-xs text-gray-500">{review.comment}</p>
                      </div>
                    )) : <p className="text-[9px] md:text-xs text-gray-400 text-center py-2">No reviews yet</p>}
                  </div>
                  {userInfo?.token ? (
                    <form onSubmit={submitReviewHandler} className="space-y-2">
                      <div className="flex gap-0.5 md:gap-1">{[...Array(5)].map((_, star) => <button key={star + 1} type="button" onClick={() => setRating(star + 1)}><Star size={14} fill={star + 1 <= rating ? GOLD : "none"} stroke={GOLD} /></button>)}</div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write review..."
                        rows={2}
                        className={`w-full border p-1.5 md:p-2 text-[10px] md:text-xs focus:outline-none ${darkMode ? 'bg-[#141110] border-[#332D28] focus:border-[#C98A3B] text-[#F7F1E6]' : 'border-[#E7DFCF] focus:border-[#C98A3B]'}`}
                        style={{ borderRadius: '2px' }}
                      />
                      {reviewError && <p className="text-[9px] font-medium" style={{ color: WINE }}>{reviewError}</p>}
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full text-white py-1.5 text-[10px] font-bold transition-colors hover:opacity-90"
                        style={{ backgroundColor: INK, borderRadius: '2px' }}
                      >
                        {submittingReview ? 'Posting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <p className="text-center text-[9px] text-gray-500 py-2">
                      <span onClick={() => navigate('/login')} className="cursor-pointer font-semibold" style={{ color: GOLD }}>Login</span> to review
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== FULLSCREEN LIGHTBOX ========== */}
      {fullscreenImageIndex !== null && productImages.length > 0 && (
        <div className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center" onClick={closeFullscreen}>
          <button onClick={closeFullscreen} className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-1.5 md:p-2 transition-all hover:opacity-90" style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }}>
            <X size={16} className="text-white" />
          </button>
          {productImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevFullscreen(); }} className="absolute left-2 md:left-4 z-50 p-2 transition-all hover:opacity-90" style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }}>
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextFullscreen(); }} className="absolute right-2 md:right-4 z-50 p-2 transition-all hover:opacity-90" style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }}>
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}
          <img
            src={productImages[fullscreenImageIndex]?.url}
            alt="Fullscreen"
            className="max-w-[95vw] max-h-[95vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1" style={{ borderRadius: '2px' }}>
              {fullscreenImageIndex + 1} / {productImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;