import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const ForgotPassword = () => {
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1); // 1: email, 2: verify OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Real‑time validation
  useEffect(() => {
    if (email && !email.includes('@')) setEmailError('Please enter a valid email address.');
    else setEmailError('');
  }, [email]);

  useEffect(() => {
    if (password && password.length < 6) setPasswordError('Password must be at least 6 characters');
    else setPasswordError('');
  }, [password]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) setConfirmError('Passwords do not match');
    else setConfirmError('');
  }, [password, confirmPassword]);

  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) inputRefs.current[0].focus();
  }, [step]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (emailError) return;

    setLoading(true);
    try {
      await API.post('/users/forgot-password', { email });
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (otp.some(digit => !digit)) {
      setGeneralError('Please enter the complete 6‑digit code.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/users/verify-otp', { email, otp: otp.join('') });
      setStep(3);
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Invalid or expired code. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setGeneralError('');
    setLoading(true);
    try {
      await API.post('/users/forgot-password', { email });
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const handleReset = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    if (passwordError || confirmError) return;

    setLoading(true);
    try {
      await API.post('/users/reset-password', {
        email,
        otp: otp.join(''),
        password,
      });
      setSuccessMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Navbar is global – do NOT add it here */}
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className={`rounded-2xl shadow-xl p-8 md:p-10 transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            {/* Back link */}
            <div className="mb-6">
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 text-sm transition ${
                  darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>

            {/* Header */}
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {step === 1 && 'Reset Password'}
                {step === 2 && 'Verify Code'}
                {step === 3 && 'New Password'}
              </h2>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {step === 1 && 'Enter your email to receive a reset code.'}
                {step === 2 && `We sent a 6‑digit code to ${email}`}
                {step === 3 && 'Create a strong new password'}
              </p>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`peer w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 focus:border-orange-500'
                    } ${emailError ? 'border-red-500' : ''}`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      email
                        ? '-top-2 text-xs px-1 rounded'
                        : 'top-3'
                    } ${
                      darkMode 
                        ? (email ? 'bg-gray-800 text-orange-400' : 'text-gray-400')
                        : (email ? 'bg-white text-orange-500' : 'text-gray-400')
                    }`}
                  >
                    Email address
                  </label>
                  <Mail className={`absolute right-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} size={20} />
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>

                {generalError && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{generalError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  <span>{loading ? 'Sending...' : 'Send Reset Code'}</span>
                </button>
              </form>
            )}

            {/* Step 2: OTP verification */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    6‑digit code
                  </label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        maxLength={1}
                        className={`w-12 h-12 text-center border-2 rounded-xl focus:outline-none font-bold text-lg ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                            : 'bg-white border-gray-200 focus:border-orange-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {generalError && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{generalError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isOtpComplete}
                  className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    isOtpComplete
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : darkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
                </button>

                <div className="text-center text-sm">
                  {resendTimer > 0 ? (
                    <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                      Resend code in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-orange-500 hover:underline"
                    >
                      Didn't receive code? Resend
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleReset} className="mt-8 space-y-6">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`peer w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 focus:border-orange-500'
                    } ${passwordError ? 'border-red-500' : ''}`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="new-password"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      password
                        ? '-top-2 text-xs px-1 rounded'
                        : 'top-3'
                    } ${
                      darkMode 
                        ? (password ? 'bg-gray-800 text-orange-400' : 'text-gray-400')
                        : (password ? 'bg-white text-orange-500' : 'text-gray-400')
                    }`}
                  >
                    New password
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
                          className={`h-full transition-all ${
                            passwordStrength() === 'weak' ? 'w-1/3 bg-red-500' :
                            passwordStrength() === 'medium' ? 'w-2/3 bg-yellow-500' : 'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                        {passwordStrength()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`peer w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                        : 'bg-white border-gray-300 focus:border-orange-500'
                    } ${confirmError ? 'border-red-500' : ''}`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="confirm-password"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      confirmPassword
                        ? '-top-2 text-xs px-1 rounded'
                        : 'top-3'
                    } ${
                      darkMode 
                        ? (confirmPassword ? 'bg-gray-800 text-orange-400' : 'text-gray-400')
                        : (confirmPassword ? 'bg-white text-orange-500' : 'text-gray-400')
                    }`}
                  >
                    Confirm password
                  </label>
                  {confirmError && <p className="text-red-500 text-xs mt-1">{confirmError}</p>}
                </div>

                {generalError && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{generalError}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  <span>{loading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;