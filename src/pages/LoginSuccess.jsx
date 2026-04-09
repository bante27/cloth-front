import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSuccess = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false); // Prevent double execution

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const params = new URLSearchParams(location.search);
    const userParam = params.get('user');

    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        // Update parent state (if provided)
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }
        // Redirect to shop
        navigate('/shop', { replace: true });
      } catch (err) {
        console.error('Failed to parse user data', err);
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate, onLoginSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging you in...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;