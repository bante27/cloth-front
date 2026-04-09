import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Camera, Loader2, Save, X, Phone, CheckCircle, 
  Eye, EyeOff, Settings, Package, Calendar, DollarSign, ShoppingBag,
  Tag, Ruler, Palette, LogOut, ChevronRight, MapPin, Clock, AlertTriangle,
  Truck
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
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

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    onLogout();
    setIsLogoutModalOpen(false);
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

  if (!userInfo) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pt-6 pb-12 px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Header - Clean Card (unchanged) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg p-5 sm:p-6 mb-6 transition-all ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ${
                darkMode ? 'ring-gray-700' : 'ring-orange-100'
              } shadow-md`}>
                {displayPic ? (
                  <img src={displayPic} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <User size={32} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {displayName}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1 text-sm">
                <p className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Mail size={12} className="text-orange-500" />
                  {displayEmail}
                </p>
                {displayPhone && (
                  <p className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Phone size={12} className="text-orange-500" />
                    {displayPhone}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
            >
              <Settings size={16} />
              <span>Edit</span>
            </button>
          </div>
        </motion.div>

        {/* Orders Section (unchanged) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl shadow-lg p-5 sm:p-6 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Package size={18} className="text-orange-500" />
              My Orders
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {orders.length} order{orders.length !== 1 && 's'}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-orange-500" size={28} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className={`mx-auto mb-3 opacity-50 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No orders yet</p>
              <button onClick={() => window.location.href = '/shop'} className="mt-3 text-orange-500 text-sm underline">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className={`border rounded-xl p-4 transition-all ${
                  darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
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
                        <button onClick={() => handleMarkDelivered(order._id)} className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition" title="Mark as delivered">
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

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleLogoutClick}
          className="mt-6 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm group"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          Logout
        </motion.button>
      </div>

      {/* ========== EDIT PROFILE MODAL (unchanged - keep your existing code) ========== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* ... your existing edit modal JSX ... */}
              <div className="sticky top-0 flex justify-between items-center p-5 border-b dark:border-gray-700 bg-inherit">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Edit Profile</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-5 space-y-5">
                {/* Avatar, Name, Email, Phone, Password fields – keep your existing code */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className={`w-24 h-24 rounded-full overflow-hidden ring-4 ${darkMode ? 'ring-gray-700' : 'ring-orange-100'}`}>
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
                  <input type="text" id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(editName !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                  <label htmlFor="edit-name" className={`absolute left-4 transition-all duration-200 pointer-events-none ${nameFocused || editName ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (nameFocused || editName ? 'bg-gray-800 text-orange-400' : 'text-gray-400') : (nameFocused || editName ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Full Name</label>
                </div>
                {/* Email field */}
                <div className="relative">
                  <input type="email" id="edit-email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(editEmail !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                  <label htmlFor="edit-email" className={`absolute left-4 transition-all duration-200 pointer-events-none ${emailFocused || editEmail ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (emailFocused || editEmail ? 'bg-gray-800 text-orange-400' : 'text-gray-400') : (emailFocused || editEmail ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Email</label>
                </div>
                {/* Phone field */}
                <div className="relative">
                  <input type="tel" id="edit-phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} onFocus={() => setPhoneFocused(true)} onBlur={() => setPhoneFocused(editPhone !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                  <label htmlFor="edit-phone" className={`absolute left-4 transition-all duration-200 pointer-events-none ${phoneFocused || editPhone ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (phoneFocused || editPhone ? 'bg-gray-800 text-orange-400' : 'text-gray-400') : (phoneFocused || editPhone ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Phone (optional)</label>
                </div>
                {/* Password change */}
                <div className={`border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Change Password (Optional)</p>
                  <div className="space-y-4">
                    <div className="relative">
                      <input type={showOldPassword ? 'text' : 'password'} id="old-password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} onFocus={() => setOldPassFocused(true)} onBlur={() => setOldPassFocused(oldPassword !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all pr-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                      <label htmlFor="old-password" className={`absolute left-4 transition-all duration-200 pointer-events-none ${oldPassFocused || oldPassword ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (oldPassFocused || oldPassword ? 'bg-gray-800 text-orange-400' : 'text-gray-400') : (oldPassFocused || oldPassword ? 'bg-white text-orange-500' : 'text-gray-400')}`}>Current Password</label>
                      <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onFocus={() => setNewPassFocused(true)} onBlur={() => setNewPassFocused(newPassword !== '')} className={`peer w-full px-4 py-3 border rounded-xl outline-none focus:border-orange-500 transition-all pr-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`} placeholder=" " />
                      <label htmlFor="new-password" className={`absolute left-4 transition-all duration-200 pointer-events-none ${newPassFocused || newPassword ? '-top-2 text-xs px-1 rounded' : 'top-3'} ${darkMode ? (newPassFocused || newPassword ? 'bg-gray-800 text-orange-400' : 'text-gray-400') : (newPassFocused || newPassword ? 'bg-white text-orange-500' : 'text-gray-400')}`}>New Password</label>
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={updateLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {updateLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========== ORDER DETAILS MODAL – MOBILE FRIENDLY ========== */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className="sticky top-0 flex justify-between items-center p-4 border-b dark:border-gray-700 bg-inherit">
                <div>
                  <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Order Details
                  </h2>
                  <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body – larger text & spacing on mobile */}
              <div className="p-5 space-y-5">
                {/* Status & Date */}
                <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b dark:border-gray-700">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {selectedOrder.status}
                  </span>
                  <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock size={12} />
                    {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>

                {/* Timeline with estimated delivery */}
                <div className="space-y-2 pb-3 border-b dark:border-gray-700">
                  {selectedOrder.paidAt && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} />
                      <span>Paid on {formatDateTime(selectedOrder.paidAt)}</span>
                    </div>
                  )}
                  {selectedOrder.shippedAt && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
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
                      <div key={idx} className={`flex gap-3 p-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border dark:border-gray-600 bg-white dark:bg-gray-800">
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
                <div className="pt-3 border-t dark:border-gray-700">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                      <span>{selectedOrder.totalPrice?.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                      <span className="font-semibold text-base">Total</span>
                      <span className="text-lg font-bold text-orange-600">
                        {selectedOrder.totalPrice?.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping address */}
                {selectedOrder.shippingAddress && (
                  <div className="pt-3 border-t dark:border-gray-700">
                    <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <MapPin size={14} /> Shipping Address
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
              <div className="sticky bottom-0 p-4 border-t dark:border-gray-700 bg-inherit">
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

      {/* ========== LOGOUT CONFIRMATION MODAL ========== */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Logout?</h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setIsLogoutModalOpen(false)} className={`flex-1 py-2.5 rounded-xl font-medium ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Cancel
                  </button>
                  <button onClick={confirmLogout} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;