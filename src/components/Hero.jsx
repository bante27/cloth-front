import React from 'react';

const Hero = () => {
  return (
    <div className="relative h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Discover the Beauty of 
            <span className="text-ethiopian-yellow"> Habesha </span> 
            Fashion
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Explore our collection of traditional and modern Ethiopian clothing, 
            crafted with love and cultural heritage.
          </p>
          <div className="space-x-4">
            <button className="bg-ethiopian-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Shop Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;