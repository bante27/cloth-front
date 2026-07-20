import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Camera, Loader2, Save, X, Phone, CheckCircle,
  Eye, EyeOff, Settings, Package, Calendar, DollarSign, ShoppingBag,
  Tag, Ruler, Palette, LogOut, ChevronRight, MapPin, Clock,
  Truck, Wallet, Sparkles
} from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Profile = ({ userInfo, onLogout, onLoginSuccess }) => {
  const { darkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Edit profile states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Derived user data
  const displayName = userInfo?.name || userInfo?.user?.name || "";
  const displayEmail = userInfo?.email || userInfo?.user?.email || "";
  const displayPhone = userInfo?.phone || userInfo?.user?.phone || "";
  const displayPic = userInfo?.profilePicture || userInfo?.user?.profilePicture;

  // Floating label states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [oldPassFocused, setOldPassFocused] = useState(false);
  const [newPassFocused, setNewPassFocused] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setEditName(displayName);
      setEditEmail(displayEmail);
      setEditPhone(displayPhone);
      setPreviewUrl(displayPic || '');
      fetchMyOrders();
    }
  }, [userInfo, displayName, displayEmail, displayPhone, displayPic]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error("Order fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editName);
      formData.append('email', editEmail);
      formData.append('phone', editPhone);
      if (selectedFile) formData.append('image', selectedFile);
      if (newPassword) {
        formData.append('oldPassword', oldPassword);
        formData.append('newPassword', newPassword);
      }

      const { data } = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onLoginSuccess(data);
      alert("Profile updated successfully! ✨");
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    if (!window.confirm("Confirm this order has been delivered?")) return;
    try {
      await api.put(`/orders/${orderId}/deliver`);
      alert("Order marked as Delivered! ✅");
      fetchMyOrders();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Instant logout — no confirmation dialog. A brief spinner state avoids
  // a jarring instant unmount and gives the click visible feedback.
  const handleLogoutClick = () => {
    setLoggingOut(true);
    onLogout();
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ---- Derived stats (presentation only — no new data fetching) ----
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  // Status → accent color, used as the "status rail" on each order card
  const statusRail = (status) => {
    if (status === 'Delivered') return darkMode ? 'bg-emerald-500' : 'bg-emerald-500';
    if (status === 'Shipped') return 'bg-sky-500';
    return 'bg-amber-500';
  };

  if (!userInfo) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pt-6 pb-16 px-4 sm:px-6 lg:px-8 ${
      darkMode
        ? 'bg-gray-950'
        : 'bg-[radial-gradient(ellipse_at_top,_#FFF7ED_0%,_#FAFAF9_45%,_#F4F4F3_100%)]'
    }`}>
      <div className="max-w-5xl mx-auto">

        {/* ================= Profile Header ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`relative overflow-hidden rounded-3xl shadow-sm mb-6 ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-orange-100/70'
          }`}
        >
          {/* Signature: warm gradient band behind the avatar, evokes a receipt/stamp header */}
          <div className={`h-20 sm:h-24 w-full ${
            darkMode
              ? 'bg-gradient-to-r from-orange-900/40 via-gray-900 to-gray-900'
              : 'bg-gradient-to-r from-orange-200 via-orange-100 to-amber-50'
          }`} />

          <div className="px-5 sm:px-8 pb-6 -mt-10 sm:-mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 shadow-lg ${
                  darkMode ? 'ring-gray-900' : 'ring-white'
                }`}>
                  {displayPic ? (
                    <img src={displayPic} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      darkMode ? 'bg-gray-800 text-gray-500' : 'bg-orange-50 text-orange-300'
                    }`}>
                      <User size={32} />
                    </div>
                  )}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ring-2 ${
                  darkMode ? 'bg-orange-500 ring-gray-900' : 'bg-orange-500 ring-white'
                }`}>
                  <Sparkles size={12} className="text-white" />
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left pt-1">
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {displayName}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1.5 text-sm">
                  <p className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Mail size={13} className="text-orange-500" />
                    {displayEmail}
                  </p>
                  {displayPhone && (
                    <p className={`flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Phone size={13} className="text-orange-500" />
                      {displayPhone}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all shadow-sm mx-auto sm:mx-0 ${
                  darkMode
                    ? 'bg-orange-500 hover:bg-orange-400 text-gray-950'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                <Settings size={16} />
                <span>Edit profile</span>
              </button>
            </div>

            {/* Stat strip — encodes real account facts, not decoration */}
            <div className={`mt-6 grid grid-cols-3 divide-x rounded-2xl overflow-hidden border ${
              darkMode ? 'divide-gray-800 border-gray-800 bg-gray-900/60' : 'divide-orange-100 border-orange-100 bg-orange-50/50'
            }`}>
              <div className="px-3 sm:px-5 py-3.5 text-center">
                <div className={`flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wide font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <ShoppingBag size={12} /> Orders
                </div>
                <div className={`mt-1 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{orders.length}</div>
              </div>
              <div className="px-3 sm:px-5 py-3.5 text-center">
                <div className={`flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wide font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Wallet size={12} /> Spent
                </div>
                <div className={`mt-1 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalSpent.toLocaleString()} <span className="text-xs font-medium">ETB</span></div>
              </div>
              <div className="px-3 sm:px-5 py-3.5 text-center">
                <div className={`flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wide font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <CheckCircle size={12} /> Delivered
                </div>
                <div className={`mt-1 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{deliveredCount}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= Orders Section ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: 'easeOut' }}
          className={`rounded-3xl shadow-sm p-5 sm:p-7 ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-orange-100/70'
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-base sm:text-lg font-bold tracking-tight flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Package size={18} className="text-orange-500" />
              My orders
            </h2>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {orders.length} order{orders.length !== 1 && 's'}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-14">
              <Loader2 className="animate-spin text-orange-500" size={28} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-14">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-orange-50'}`}>
                <Package size={28} className={darkMode ? 'text-gray-600' : 'text-orange-300'} />
              </div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No orders yet</p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Once you place an order, it'll show up here.</p>
              <button onClick={() => window.location.href = '/shop'} className="mt-4 text-orange-500 text-sm font-medium hover:text-orange-600 transition">
                Start shopping →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`relative overflow-hidden rounded-2xl border transition-all ${
                    darkMode ? 'border-gray-800 hover:border-gray-700 hover:bg-gray-800/40' : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/40'
                  }`}
                >
                  {/* Status rail: color alone encodes state, doubling as a visual anchor */}
                  <span className={`absolute left-0 top-0 h-full w-1 ${statusRail(order.status)}`} />

                  <div className="flex flex-wrap items-start justify-between gap-3 p-4 pl-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : order.status === 'Shipped'
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className={`flex flex-wrap gap-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(order.createdAt)}</span>
                        <span className="flex items-center gap-1"><DollarSign size={12} />{order.totalPrice?.toLocaleString()} ETB</span>
                        <span className="flex items-center gap-1"><ShoppingBag size={12} />{order.orderItems?.length} item(s)</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.status !== 'Delivered' && order.isShipped && (
                        <button onClick={() => handleMarkDelivered(order._id)} className="p-2 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20 rounded-lg transition" title="Mark as delivered">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => openOrderModal(order)} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition">
                        View <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Logout Button — fires immediately, no confirmation dialog */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogoutClick}
          disabled={loggingOut}
          className={`mt-6 w-full py-3.5 font-medium rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm group ${
            darkMode
              ? 'bg-gray-900 border border-gray-800 text-red-400 hover:bg-red-950/40 hover:border-red-900'
              : 'bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200'
          } disabled:opacity-70`}
        >
          {loggingOut ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          )}
          {loggingOut ? 'Logging out...' : 'Log out'}
        </motion.button>
      </div>

      {/* ========== EDIT PROFILE MODAL ========== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              <div className="sticky top-0 flex justify-between items-center p-5 border-b dark:border-gray-800 bg-inherit rounded-t-3xl">
                <h2 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit profile</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-5 space-y-5">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className={`w-24 h-24 rounded-full overflow-hidden ring-4 ${darkMode ? 'ring-gray-800' : 'ring-orange-100'}`}>
                      <img src={previewUrl || displayPic || 'https://via.placeholder.com/96'} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full cursor-pointer hover:bg-orange-600 transition shadow-md">
                      <Camera size={14} />
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                </div>
                {/* Name field */}
                <div className="relative">
                  <input type="text" id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(editName !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                  <label htmlFor="edit-name" className={`absolute left-4 transition-all duration-200 pointer-events-none ${nameFocused || editName ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (nameFocused || editName ? 'bg-gray-900 text-orange-400' : 'text-gray-400') : (nameFocused || editName ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Full name</label>
                </div>
                {/* Email field */}
                <div className="relative">
                  <input type="email" id="edit-email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(editEmail !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                  <label htmlFor="edit-email" className={`absolute left-4 transition-all duration-200 pointer-events-none ${emailFocused || editEmail ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (emailFocused || editEmail ? 'bg-gray-900 text-orange-400' : 'text-gray-400') : (emailFocused || editEmail ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Email</label>
                </div>
                {/* Phone field */}
                <div className="relative">
                  <input type="tel" id="edit-phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} onFocus={() => setPhoneFocused(true)} onBlur={() => setPhoneFocused(editPhone !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                  <label htmlFor="edit-phone" className={`absolute left-4 transition-all duration-200 pointer-events-none ${phoneFocused || editPhone ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (phoneFocused || editPhone ? 'bg-gray-900 text-orange-400' : 'text-gray-400') : (phoneFocused || editPhone ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Phone (optional)</label>
                </div>
                {/* Password change */}
                <div className={`border-t pt-4 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                  <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Change password (optional)</p>
                  <div className="space-y-4">
                    <div className="relative">
                      <input type={showOldPassword ? 'text' : 'password'} id="old-password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} onFocus={() => setOldPassFocused(true)} onBlur={() => setOldPassFocused(oldPassword !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all pr-10 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                      <label htmlFor="old-password" className={`absolute left-4 transition-all duration-200 pointer-events-none ${oldPassFocused || oldPassword ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (oldPassFocused || oldPassword ? 'bg-gray-900 text-orange-400' : 'text-gray-400') : (oldPassFocused || oldPassword ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Current password</label>
                      <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onFocus={() => setNewPassFocused(true)} onBlur={() => setNewPassFocused(newPassword !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all pr-10 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                      <label htmlFor="new-password" className={`absolute left-4 transition-all duration-200 pointer-events-none ${newPassFocused || newPassword ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (newPassFocused || newPassword ? 'bg-gray-900 text-orange-400' : 'text-gray-400') : (newPassFocused || newPassword ? 'bg-white text-orange-500' : 'text-gray-400')}`}>New password</label>
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={updateLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {updateLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {updateLoading ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== ORDER DETAILS MODAL ========== */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className="sticky top-0 flex justify-between items-center p-4 border-b dark:border-gray-800 bg-inherit">
                <div>
                  <h2 className={`text-base sm:text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Order details
                  </h2>
                  <p className={`text-[11px] mt-0.5 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                {/* Status & Date */}
                <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b dark:border-gray-800">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : selectedOrder.status === 'Shipped'
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {selectedOrder.status}
                  </span>
                  <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock size={12} />
                    {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>

                {/* Timeline with estimated delivery */}
                <div className="space-y-2.5 pb-3 border-b dark:border-gray-800">
                  {selectedOrder.paidAt && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} />
                      <span>Paid on {formatDateTime(selectedOrder.paidAt)}</span>
                    </div>
                  )}
                  {selectedOrder.shippedAt && (
                    <div className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400">
                      <Truck size={14} />
                      <span>Shipped on {formatDateTime(selectedOrder.shippedAt)}</span>
                    </div>
                  )}
                  {selectedOrder.expectedDeliveryStart && selectedOrder.expectedDeliveryEnd && (
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                      <Calendar size={14} />
                      <span>Est. delivery: {formatDate(selectedOrder.expectedDeliveryStart)} – {formatDate(selectedOrder.expectedDeliveryEnd)}</span>
                    </div>
                  )}
                  {selectedOrder.deliveredAt && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} />
                      <span>Delivered on {formatDateTime(selectedOrder.deliveredAt)}</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Items ({selectedOrder.orderItems?.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div key={idx} className={`flex gap-3 p-2.5 rounded-xl ${darkMode ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border dark:border-gray-700 bg-white dark:bg-gray-900">
                          <img src={item.image || '/placeholder-image.jpg'} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {item.name}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs">
                            {item.size && item.size !== 'One Size' && (
                              <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Ruler size={12} /> {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Palette size={12} /> {item.color}
                              </span>
                            )}
                            <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Tag size={12} /> Qty: {item.qty}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {item.price?.toLocaleString()} ETB
                            </span>
                            <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {(item.price * item.qty).toLocaleString()} ETB
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-3 border-t dark:border-gray-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                      <span>{selectedOrder.totalPrice?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping</span>
                      <span className="text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t dark:border-gray-800">
                      <span className="font-semibold text-base">Total</span>
                      <span className="text-lg font-bold text-orange-600">
                        {selectedOrder.totalPrice?.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping address */}
                {selectedOrder.shippingAddress && (
                  <div className="pt-3 border-t dark:border-gray-800">
                    <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <MapPin size={14} /> Shipping address
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                      {selectedOrder.shippingAddress.country && `, ${selectedOrder.shippingAddress.country}`}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Phone: {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 p-4 border-t dark:border-gray-800 bg-inherit">
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;