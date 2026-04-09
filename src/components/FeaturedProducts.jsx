import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Traditional Habesha Kemis',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=415&q=80',
    category: 'Women'
  },
  {
    id: 2,
    name: 'Ethiopian Netela Scarf',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1602357285804-1e5b2f300a14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    category: 'Accessories'
  },
  {
    id: 3,
    name: 'Men\'s Traditional Shirt',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1602810319428-019690571b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Men'
  },
  {
    id: 4,
    name: 'Modern Habesha Dress',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    category: 'Women'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-ethiopian-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <div className="w-24 h-1 bg-ethiopian-yellow mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover our most popular Habesha clothing and accessories, 
            handpicked for their quality and cultural significance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-ethiopian-red hover:text-white transition">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-ethiopian-green mb-1">{product.category}</p>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  <button className="bg-ethiopian-yellow text-gray-900 px-3 py-2 rounded-lg hover:bg-yellow-500 transition flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;