// components/ShopComponents.jsx
import React, { Fragment, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ProductCard = ({ product, onSelect, onQuickAdd }) => {
  const isOutOfStock = product.countInStock <= 0;
  const { darkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 1, y: 80 }}
      whileInView={{ opacity: 1, y: 3 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 2.3, ease: [1.25, 2, 1.5, 2] }}
      onClick={() => !isOutOfStock && onSelect(product)}
      className={`group cursor-pointer w-full border ${darkMode ? 'bg-[#1E1A17] border-[#332D28]' : 'bg-white border-[#E7DFCF]'} overflow-hidden transition-all duration-300`}
      style={{ borderRadius: '0.5px' }}
      role="button"
      tabIndex={0}
    >
      <div className={`relative aspect-square ${darkMode ? 'bg-[#141110]' : 'bg-[#F1EBDC]'}`}>
        <img
          src={product.imageFront}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[8px] font-bold px-2 py-0.5 rounded">
            NEW
          </div>
        )}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-500 text-white font-bold text-[9px] px-2 py-1 rounded transform -rotate-12">
              SOLD OUT
            </div>
          </div>
        ) : product.countInStock <= 3 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded animate-pulse shadow-md z-10">
            Only {product.countInStock} left!
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className={`font-medium text-xs line-clamp-2 mb-1 ${isOutOfStock ? 'text-gray-400' : darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {product.name.length > 35 ? `${product.name.substring(0, 35)}...` : product.name}
        </h3>
        <p className={`text-[11px] line-clamp-2 mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {product.description?.substring(0, 50) || 'Premium quality product'}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className={`text-xs font-bold ${isOutOfStock ? 'text-gray-400' : 'text-orange-600'}`}>
            Br{product.price?.toLocaleString()}
          </span>
          {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd({ ...product, qty: 1 });
              }}
              className="bg-black text-white hover:bg-orange-500 text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 transition shadow-sm"
            >
              <ShoppingBag size={10} /> Add
            </button>
          )}
        </div>
        {!isOutOfStock ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="mt-1 text-[8px] font-medium text-orange-500 hover:text-orange-600 flex items-center gap-0.5"
          >
            View Details <ChevronRight size={8} />
          </button>
        ) : (
          <p className="mt-1 text-[8px] font-medium text-red-500">Out of stock</p>
        )}
      </div>
    </motion.div>
  );
};

export const ProductSkeleton = () => {
  const { darkMode } = useTheme();
  return (
    <div className="animate-pulse w-64 border-r border-gray-200">
      <div className={`aspect-square ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`mt-2 h-3 rounded w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`mt-1 h-2 rounded w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
      <div className={`mt-2 h-6 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
    </div>
  );
};

export const Pagination = ({ page, totalPages, goToPage, goToPrevPage, goToNextPage }) => {
  const { darkMode } = useTheme();
  const getPageNumbers = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) range.push(i);
    }
    range.forEach((i) => {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    });
    return rangeWithDots;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex justify-center">
      <div className="flex items-center gap-1">
        <button onClick={goToPrevPage} disabled={page === 1} className={`px-2 py-1.5 rounded-lg border text-xs ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-100'}`}>
          <ChevronLeft size={14} />
        </button>
        <div className="flex items-center gap-0.5">
          {getPageNumbers.map((item, idx) => (
            <Fragment key={idx}>
              {item === '...' ? <span className="px-1 text-xs text-gray-400">...</span> : (
                <button onClick={() => goToPage(item)} className={`min-w-[28px] h-7 rounded-lg text-xs font-medium ${page === item ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'}`}>
                  {item}
                </button>
              )}
            </Fragment>
          ))}
        </div>
        <button onClick={goToNextPage} disabled={page === totalPages} className={`px-2 py-1.5 rounded-lg border text-xs ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-100'}`}>
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
};