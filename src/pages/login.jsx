import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Login = ({ onLoginSuccess }) => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (email && !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }, [email]);

  const passwordStrength = () => {
    if (!password) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    let hasError = false;

    if (!email.includes('@')) {
      setEmailError('Invalid email address');
      hasError = true;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const { data } = await API.post('/users/login', { email, password });
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      if (onLoginSuccess) onLoginSuccess(data);
      navigate('/shop');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setGeneralError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- GOOGLE SOCIAL LOGIN (only provider) ---
  const handleGoogleLogin = () => {
    const backendBaseURL = 'http://localhost:5000/api/users/auth';
    window.location.href = `${backendBaseURL}/google`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className={`rounded-2xl shadow-xl p-8 md:p-10 transition-all duration-300 transform hover:scale-[1.01] ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Welcome back
              </h2>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(email !== '')}
                  className={`peer w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                      : 'bg-white border-gray-300 focus:border-orange-500'
                  } ${emailError ? 'border-red-500' : ''}`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    emailFocused || email ? '-top-2 text-xs px-1 rounded' : 'top-3'
                  } ${
                    darkMode 
                      ? (emailFocused || email ? 'bg-gray-800 text-orange-400' : 'text-gray-400')
                      : (emailFocused || email ? 'bg-white text-orange-500' : 'text-gray-400')
                  }`}
                >
                  Email address
                </label>
                <Mail className="absolute right-3 top-3.5 text-gray-400" size={20} />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              {/* Password field */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(password !== '')}
                  className={`peer w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                      : 'bg-white border-gray-300 focus:border-orange-500'
                  } ${passwordError ? 'border-red-500' : ''}`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    passwordFocused || password ? '-top-2 text-xs px-1 rounded' : 'top-3'
                  } ${
                    darkMode 
                      ? (passwordFocused || password ? 'bg-gray-800 text-orange-400' : 'text-gray-400')
                      : (passwordFocused || password ? 'bg-white text-orange-500' : 'text-gray-400')
                  }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3.5 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                
                {password && !passwordError && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength() === 'weak' ? 'w-1/3 bg-red-500' :
                          passwordStrength() === 'medium' ? 'w-2/3 bg-yellow-500' : 'w-full bg-green-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs capitalize text-gray-400">
                      {passwordStrength()}
                    </span>
                  </div>
                )}
              </div>

              {generalError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 animate-shake">
                  <AlertCircle size={16} />
                  <span>{generalError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`}>
                    Or continue with
                  </span>
                </div>
              </div>
              
              {/* Single Google button - clean & smart design */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`w-full flex items-center justify-center gap-3 py-3 border rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 ${
                    darkMode 
                      ? 'border-gray-700 hover:bg-gray-700/50 text-gray-200' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-medium">Sign in with Google</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <Link to="/register" className="text-orange-500 hover:underline font-medium">
                Create an account
              </Link>
              <span className={`mx-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>•</span>
              <Link to="/forgot-password" title="Verify your OTP" className={`transition ${
                darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'
              }`}>
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add subtle animation for error shake */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default Login;