import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CartDrawer = ({ isOpen, onClose, cartItems, setCart }) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const handleCheckoutNavigation = () => {
    onClose(); 
    navigate('/checkout', { 
      state: { cart: cartItems, totalPrice: totalPrice } 
    });
  };

  const getProductImage = (item) => {
    // If variant images exist, use selected variant's front image
    if (item.selectedColor && item.variants) {
      const variant = item.variants.find(v => v.color === item.selectedColor);
      if (variant?.imageFront) return variant.imageFront;
    }
    return item.imageFront || item.imageBack || item.image || '/placeholder-image.jpg';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            className={`fixed right-0 top-0 h-full w-full max-w-md shadow-2xl flex flex-col transition-colors duration-300 z-[1001] ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            <div className={`p-4 md:p-6 flex justify-between items-center border-b ${
              darkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h2 className={`text-[11px] font-black uppercase tracking-[0.4em] ${
                darkMode ? 'text-gray-300' : 'text-gray-800'
              }`}>
                Your Bag ({cartItems.length})
              </h2>
              <button 
                onClick={onClose} 
                className={`p-2 rounded-full transition-colors ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-60 py-20">
                  <ShoppingBag size={48} strokeWidth={1} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
                  <p className={`text-[11px] uppercase mt-4 font-bold tracking-widest italic text-center ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Your bag is empty
                  </p>
                  <button
                    onClick={onClose}
                    className={`mt-6 text-xs font-bold uppercase tracking-wider transition-colors ${
                      darkMode 
                        ? 'text-gray-300 border-gray-700 hover:text-orange-500 hover:border-orange-500' 
                        : 'text-black border-black hover:text-orange-600 hover:border-orange-600'
                    } border-b`}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    layout 
                    key={item._id} 
                    className={`flex gap-4 p-3 rounded-xl border transition-all ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/50' 
                        : 'bg-gray-50 border-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-20 h-24 rounded-lg overflow-hidden flex items-center justify-center border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
                    }`}>
                      <img 
                        src={getProductImage(item)} 
                        className="w-full h-full object-cover" 
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-xs font-black uppercase leading-tight line-clamp-2 ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {item.name}
                          </h3>
                          <p className={`text-[9px] uppercase mt-0.5 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {item.gender} • {item.category}
                          </p>
                          {/* Display selected size and color */}
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex gap-2 mt-1">
                              {item.selectedSize && (
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                }`}>
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                }`}>
                                  Color: {item.selectedColor}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)} 
                          className={`transition-colors ${
                            darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-300 hover:text-red-500'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-bold text-orange-600">
                          {item.price.toLocaleString()} ETB
                        </p>
                        
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <button 
                            onClick={() => updateQty(item._id, -1)} 
                            className={`transition-colors w-5 h-5 flex items-center justify-center ${
                              darkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'
                            }`}
                            disabled={item.qty <= 1}
                          >
                            <Minus size={10} />
                          </button>
                          <span className={`text-xs font-bold w-5 text-center ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                            {item.qty}
                          </span>
                          <button 
                            onClick={() => updateQty(item._id, 1)} 
                            className={`transition-colors w-5 h-5 flex items-center justify-center ${
                              darkMode ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'
                            }`}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>

                      <p className={`text-[9px] text-right mt-1 ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        Subtotal: {(item.price * item.qty).toLocaleString()} ETB
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className={`p-4 md:p-6 border-t space-y-4 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`flex justify-between items-center text-[10px] ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span>Subtotal</span>
                  <span>{totalPrice.toLocaleString()} ETB</span>
                </div>
                <div className={`flex justify-between items-center text-[10px] ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className={`pt-3 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-[11px] font-black uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Grand Total
                    </span>
                    <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {totalPrice.toLocaleString()} ETB
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckoutNavigation}
                  className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-100"
                >
                  Proceed to Checkout 
                  <ArrowRight size={14} />
                </button>
                
                <p className={`text-[9px] text-center ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;