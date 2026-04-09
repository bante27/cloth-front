import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor to attach the JWT token to every protected request
API.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('userInfo');
  
  if (savedUser) {
    try {
      const userInfo = JSON.parse(savedUser);
      // Check if the token exists inside the userInfo object
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (error) {
      console.error("Error parsing userInfo from localStorage", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;