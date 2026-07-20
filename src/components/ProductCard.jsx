import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      } ${isOutOfStock ? 'opacity-70' : ''}`}
      role="button"
      tabIndex={0}
    >
      <div className={`relative aspect-[3/4] overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <img
          src={product.imageFront}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            NEW
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-bold text-xs uppercase tracking-wider bg-red-600/90 px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd({ ...product, qty: 1 });
            }}
            className="absolute bottom-3 right-3 bg-white hover:bg-orange-500 hover:text-white rounded-full p-2 transition-all transform hover:scale-105"
          >
            <ShoppingBag size={16} />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className={`font-semibold text-sm line-clamp-1 mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {product.name}
        </h3>
        <p className={`text-[12px] line-clamp-2 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {product.description || 'Premium quality product.'}
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold ${isOutOfStock ? 'text-gray-400' : 'text-orange-600'}`}>
            Br{product.price?.toLocaleString()}
          </span>
          {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="text-[10px] font-medium text-orange-500 hover:text-orange-600 flex items-center gap-0.5 uppercase tracking-wide"
            >
              Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;