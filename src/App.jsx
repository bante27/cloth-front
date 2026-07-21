import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Login from './pages/login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Traditional from './pages/Traditional';
import Modern from './pages/Modern';
import ForgotPassword from './pages/ForgotPassword';
import PrivacyPolicy from './pages/policy';
import LoginSuccess from './pages/LoginSuccess';   // <-- ADD THIS

// Theme Context
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // User state from sessionStorage
  const [userInfo, setUserInfo] = useState(() => {
    const saved = sessionStorage.getItem('userInfo');
    return (saved && saved !== "undefined" && saved !== "null") ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (data) => {
    setUserInfo(data);
    sessionStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      setUserInfo(null);
      navigate('/login');
    }
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((x) => x._id === product._id);
      if (exist) return prev.map((x) => x._id === product._id ? { ...exist, qty: exist.qty + qty } : x);
      return [...prev, { ...product, qty }];
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar
        cartCount={cart.reduce((a, c) => a + (c.qty || 0), 0)}
        onOpenCart={() => setIsDrawerOpen(true)}
        userInfo={userInfo}
        onLogout={logoutHandler}
      />

      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cartItems={cart}
        setCart={setCart}
      />

      <main className="pt-16 md:pt-20">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} userInfo={userInfo} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/profile" element={<Profile userInfo={userInfo} onLogout={logoutHandler} onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/traditional" element={<Traditional />} />
          <Route path="/modern" element={<Modern />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* Social login success route */}
          <Route path="/login-success" element={<LoginSuccess onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;