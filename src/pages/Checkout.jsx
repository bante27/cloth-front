import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, ChevronRight, Loader2, MapPin, Phone, X, AlertCircle, 
  CheckCircle, ArrowLeft, Trash2, ShoppingBag, CreditCard, 
  Wallet, Lock, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  const cart = location.state?.cart || [];
  const totalPrice = location.state?.totalPrice || 0;

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
  const [showCardForm, setShowCardForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: 'Addis Ababa',
    phone: '',
  });

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
      setError('Valid phone: 09XXXXXXXX');
      return false;
    }
    
    if (selectedPayment === 'telebirr' && !image) {
      setError('Upload payment screenshot');
      return false;
    }
    
    if (selectedPayment === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter valid card number');
        return false;
      }
      if (!cardName) {
        setError('Please enter cardholder name');
        return false;
      }
      if (!expiryDate) {
        setError('Please enter expiry date');
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setError('Please enter CVV');
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
      
      // Build orderItems with size and color
      const orderItems = cart.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.imageFront || item.imageBack || item.image,
        price: item.price,
        product: item._id,
        size: item.selectedSize || 'One Size',      // from cart item
        color: item.selectedColor || 'Default'      // from cart item
      }));

      formData.append('orderItems', JSON.stringify(orderItems));
      formData.append('shippingAddress', JSON.stringify({
        ...shippingData,
        country: 'Ethiopia'
      }));
      formData.append('totalPrice', totalPrice);
      formData.append('paymentMethod', selectedPayment);
      
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
      localStorage.removeItem('cart');
      
      setTimeout(() => {
        navigate('/profile', { state: { orderSuccess: true, orderId: response.data.order?._id } });
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
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
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
        
        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-800">Order placed successfully!</p>
              <p className="text-xs text-green-600">Redirecting to your orders...</p>
            </div>
          </motion.div>
        )}
        
        {/* Error Message */}
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
          
          {/* LEFT: CHECKOUT FORM */}
          <div className="space-y-6">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Checkout Information
            </h1>
            
            {/* Delivery Section */}
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
                      placeholder="Your full address"
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
            
            {/* Payment Section */}
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
                  onClick={() => {
                    setSelectedPayment('card');
                    setShowCardForm(true);
                  }}
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
                  <div className="flex gap-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Visa</span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Mastercard</span>
                  </div>
                </button>
              </div>
              
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
              
              {selectedPayment === 'telebirr' && (
                <div className="mt-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800 mb-4">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">Send payment to:</p>
                    <p className="text-xl font-bold text-orange-700 dark:text-orange-400 font-mono">0911223344</p>
                    <p className={`text-xs ${darkMode ? 'text-orange-400/80' : 'text-orange-600'} mt-1`}>
                      Amount: {totalPrice.toLocaleString()} ETB
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
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Screenshot uploaded</p>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center py-6 px-4">
                        <Upload size={24} className={`mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Upload Payment Screenshot
                        </span>
                        <span className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          PNG, JPG up to 5MB
                        </span>
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
            
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
                    Processing...
                  </>
                ) : (
                  'Checkout'
                )}
              </button>
            </div>
            
            <div className={`flex items-center justify-between text-xs pt-4 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <button className={`flex items-center gap-1 hover:${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <HelpCircle size={12} />
                Help?
              </button>
              <div className="flex items-center gap-1">
                <Lock size={12} />
                All Payments Are Secured
              </div>
            </div>
          </div>
          
          {/* RIGHT: ORDER SUMMARY with size/color */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Order Summary
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item._id} className={`flex gap-4 pb-4 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <img 
                        src={item.imageFront || item.imageBack || item.image} 
                        className="w-full h-full object-cover" 
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      {/* Display size and color from cart item */}
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
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.price.toLocaleString()} ETB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`pt-4 border-t space-y-3 ${
                darkMode ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>Subtotal</span>
                  <span>{totalPrice.toLocaleString()} ETB</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className={`flex justify-between pt-3 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {totalPrice.toLocaleString()} ETB
                  </span>
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