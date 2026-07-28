import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, ChevronRight, Loader2, MapPin, Phone, X, AlertCircle, 
  CheckCircle, ArrowLeft, Trash2, ShoppingBag, CreditCard, 
  Wallet, Lock, HelpCircle, Ticket
} from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  const cart = location.state?.cart || [];
  const initialTotalPrice = location.state?.totalPrice || 0;

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('telebirr');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [shippingData, setShippingData] = useState({
    address: '',
    city: 'Addis Ababa',
    phone: '',
  });

  // Promo / Coupon Code States
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponPercentage, setCouponPercentage] = useState(0); 
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Dynamically calculate final price
  const finalTotalPrice = Math.max(0, initialTotalPrice - discount);

  const handleApplyPromoCode = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    try {
      setPromoLoading(true);
      setError(''); 
      setPromoSuccess('');

      const response = await API.post('/orders/validate-coupon', { 
        code: promoCode.trim(),
        totalPrice: initialTotalPrice 
      });

      // FIX: Destructure multiple potential fallback keys from backend payload
      const discountAmount = response.data.discountAmount || response.data.discount || 0;
      const percentage = response.data.percentage || response.data.discountPercent || Math.round((discountAmount / initialTotalPrice) * 100) || 10;
      
      if (discountAmount === 0 && percentage > 0) {
        setDiscount((initialTotalPrice * percentage) / 100);
        setCouponPercentage(percentage);
      } else {
        setDiscount(discountAmount);
        setCouponPercentage(percentage);
      }

      setPromoSuccess(response.data.message || `Promo code applied successfully!`);
      setPromoApplied(true);
    } catch (err) {
      console.error('Promo validation error:', err);
      setError(err.response?.data?.message || "Invalid or expired promo code");
      setDiscount(0);
      setCouponPercentage(0);
      setPromoApplied(false);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleCouponInputChange = (value) => {
    setPromoCode(value.toUpperCase());
    if (promoApplied) {
      setPromoApplied(false);
      setDiscount(0);
      setCouponPercentage(0);
      setPromoSuccess('');
      setError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const validateForm = () => {
    if (!shippingData.address.trim()) {
      setError('Please enter your address');
      return false;
    }
    if (!shippingData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!/^09\d{8}$/.test(shippingData.phone.replace(/\D/g, ''))) {
      setError('Valid phone number format required: 09XXXXXXXX');
      return false;
    }
    
    if (selectedPayment === 'telebirr' && !image) {
      setError('Please upload your payment screenshot');
      return false;
    }
    
    if (selectedPayment === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number');
        return false;
      }
      if (!cardName) {
        setError('Please enter the cardholder name');
        return false;
      }
      if (!expiryDate) {
        setError('Please enter the card expiry date');
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      
      const orderItems = cart.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.imageFront || item.imageBack || item.image,
        price: item.price,
        product: item._id,
        size: item.selectedSize || 'One Size',
        color: item.selectedColor || 'Default'
      }));

      formData.append('orderItems', JSON.stringify(orderItems));
      formData.append('shippingAddress', JSON.stringify({
        ...shippingData,
        country: 'Ethiopia'
      }));
      
      formData.append('totalPrice', finalTotalPrice); 
      formData.append('paymentMethod', selectedPayment);
      
      if (promoApplied) {
        formData.append('couponCode', promoCode.toUpperCase().trim());
      }
      
      if (selectedPayment === 'telebirr' && image) {
        formData.append('image', image);
      }
      
      if (selectedPayment === 'card') {
        formData.append('paymentDetails', JSON.stringify({
          last4: cardNumber.slice(-4),
          cardholderName: cardName
        }));
      }

      const response = await API.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess(true);
      sessionStorage.removeItem('cart');
      
      setTimeout(() => {
        navigate('/profile', { state: { orderSuccess: true, orderId: response.data.createdOrder?._id } });
      }, 2000);
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCheckout = () => setShowCancelConfirm(true);
  
  const confirmCancel = () => {
    setShippingData({ address: '', city: 'Addis Ababa', phone: '' });
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError('');
    setShowCancelConfirm(false);
    navigate('/shop');
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <ShoppingBag size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Your bag is empty</p>
          <button 
            onClick={() => navigate('/shop')} 
            className={`text-sm font-medium border-b transition-colors ${
              darkMode 
                ? 'text-gray-300 border-gray-700 hover:text-orange-500 hover:border-orange-500' 
                : 'text-black border-black hover:text-orange-600 hover:border-orange-600'
            }`}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 py-8 px-4 md:py-12 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Cancel Confirmation Modal */}
        <AnimatePresence>
          {showCancelConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
                onClick={() => setShowCancelConfirm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none"
              >
                <div className={`w-full max-w-sm rounded-2xl shadow-xl pointer-events-auto ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trash2 size={20} className="text-red-500" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Cancel Order?
                    </h3>
                    <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Your cart items will be saved for later
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className={`flex-1 py-2 rounded-lg border text-sm transition ${
                          darkMode 
                            ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Keep Shopping
                      </button>
                      <button
                        onClick={confirmCancel}
                        className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Success Alert */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-800">Order placed successfully!</p>
              <p className="text-xs text-green-600">Redirecting to your profile dashboard...</p>
            </div>
          </motion.div>
        )}
        
        {/* General Error Alert */}
        {error && !success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X size={16} />
            </button>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT AREA: CHECKOUT FORMS */}
          <div className="space-y-6">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Checkout Information
            </h1>
            
            {/* Delivery Form */}
            <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    } w-4 h-4`} />
                    <textarea 
                      required 
                      placeholder="Your full delivery address details"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg outline-none text-sm resize-none h-20 transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-200 focus:border-orange-300'
                      } border`}
                      value={shippingData.address}
                      onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    } w-4 h-4`} />
                    <input 
                      type="tel" 
                      required 
                      placeholder="09XXXXXXXX"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg outline-none text-sm transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-200 focus:border-orange-300'
                      } border`}
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Selector Form */}
            <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pay With
              </h2>
              
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedPayment('telebirr')}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                    selectedPayment === 'telebirr' 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                      : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet size={20} className={selectedPayment === 'telebirr' ? 'text-orange-500' : darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      TeleBirr
                    </span>
                  </div>
                  {selectedPayment === 'telebirr' && <CheckCircle size={16} className="text-orange-500" />}
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedPayment('card')}
                  className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
                    selectedPayment === 'card' 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                      : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className={selectedPayment === 'card' ? 'text-orange-500' : darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      Credit / Debit Card
                    </span>
                  </div>
                  <div className="flex gap-1 text-xs text-gray-400">
                    <span>Visa</span> • <span>Mastercard</span>
                  </div>
                </button>
              </div>
              
              {/* Credit Card Detailed Entry */}
              {selectedPayment === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="5412 7512 3412 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className={`w-full px-3 py-2 rounded-lg outline-none text-sm font-mono transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-200 focus:border-orange-300'
                      } border`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg outline-none text-sm transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-200 focus:border-orange-300'
                      } border`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                        className={`w-full px-3 py-2 rounded-lg outline-none text-sm transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                            : 'bg-white border-gray-200 focus:border-orange-300'
                      } border`}
                    />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                        className={`w-full px-3 py-2 rounded-lg outline-none text-sm transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                            : 'bg-white border-gray-200 focus:border-orange-300'
                        } border`}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Telebirr Detailed Entry with Screen Upload */}
              {selectedPayment === 'telebirr' && (
                <div className="mt-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 mb-4">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">Send payment to:</p>
                    <p className="text-xl font-bold text-orange-700 dark:text-orange-400 font-mono">09 27 99 38 94 </p>
                    <p className={`text-xs ${darkMode ? 'text-orange-400/80' : 'text-orange-600'} mt-1`}>
                      Amount Due: {finalTotalPrice.toLocaleString()} ETB
                    </p>
                  </div>
                  
                  <div className={`border-2 border-dashed rounded-xl transition-all overflow-hidden ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-700/30 hover:border-orange-500' 
                      : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                  }`}>
                    {preview ? (
                      <div className="relative p-4 text-center">
                        <img src={preview} alt="Preview" className="h-32 mx-auto rounded-lg shadow-sm" />
                        <button 
                          type="button"
                          onClick={() => { setImage(null); setPreview(null); }} 
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={12}/>
                        </button>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Screenshot attached</p>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center py-6 px-4">
                        <Upload size={24} className={`mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Upload Payment Screenshot
                        </span>
                        <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                          PNG, JPG up to 5MB
                        </span>
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom Actions Row */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancelCheckout}
                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                  darkMode 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel Deal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className="flex-1 py-3 rounded-xl bg-black text-white font-medium hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing Order...
                  </>
                ) : (
                  'Checkout'
                )}
              </button>
            </div>
            
            <div className={`flex items-center justify-between text-xs pt-2 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <button type="button" className={`flex items-center gap-1 hover:${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <HelpCircle size={12} /> Support Help?
              </button>
              <div className="flex items-center gap-1">
                <Lock size={12} /> All Transactions Securely Encrypted
              </div>
            </div>
          </div>
          
          {/* RIGHT AREA: STICKY ORDER SUMMARY */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h2>
              
              <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                {cart.map((item, index) => {
                  const customItemKey = `${item._id || index}-${item.selectedSize || 'OS'}-${item.selectedColor || 'DF'}`;
                  
                  return (
                    <div key={customItemKey} className={`flex gap-4 pb-4 border-b ${
                      darkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <img 
                          src={item.imageFront || item.imageBack || item.image} 
                          className="w-full h-full object-cover" 
                          alt=""
                        />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        
                        <div className="flex gap-2 mt-1">
                          {item.selectedSize && (
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Size: {item.selectedSize}
                            </p>
                          )}
                          {item.selectedColor && (
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Color: {item.selectedColor}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Qty: {item.qty}
                          </p>
                          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {(item.price * item.qty).toLocaleString()} ETB
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* COUPON REDEMPTION BANNER */}
              <div className={`pb-4 mb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <form onSubmit={handleApplyPromoCode} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={promoCode}
                      onChange={(e) => handleCouponInputChange(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 rounded-lg outline-none text-sm transition-colors uppercase ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-200 focus:border-orange-300'
                      } border`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={promoLoading || !promoCode.trim()}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      promoApplied 
                        ? 'bg-green-600 text-white opacity-90' 
                        : 'bg-black text-white hover:bg-orange-600 disabled:opacity-40'
                    }`}
                  >
                    {promoLoading ? <Loader2 size={16} className="animate-spin" /> : promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </form>
                {promoSuccess && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle size={12} /> {promoSuccess}
                  </p>
                )}
              </div>
              
              {/* Financial Overview */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>{initialTotalPrice.toLocaleString()} ETB</span>
                </div>
                
                {/* VISIBLE MATH FORMULA FOR USER */}
                {promoApplied && (
                  <div className="bg-green-50 dark:bg-green-950/40 p-3 rounded-lg border border-green-200 text-xs my-2">
                    <div className="flex flex-col gap-1 text-green-700 dark:text-green-400 font-medium">
                      <div className="flex justify-between">
                        <span>Discount Formula:</span>
                        <span className="font-mono font-bold">
                          {initialTotalPrice.toLocaleString()} × {couponPercentage}%
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-green-200 dark:border-green-900 pt-1 mt-1 font-bold">
                        <span>Total Saved Deduction:</span>
                        <span>-{discount.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Shipping Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className={`flex justify-between text-base font-bold pt-3 border-t ${
                  darkMode ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-900'
                }`}>
                  <span>Total Amount</span>
                  <span className="text-orange-500">{finalTotalPrice.toLocaleString()} ETB</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;