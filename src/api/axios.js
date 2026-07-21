import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor to attach the JWT token to every protected request
API.interceptors.request.use((config) => {
  const savedUser = sessionStorage.getItem('userInfo');
  
  if (savedUser) {
    try {
      const userInfo = JSON.parse(savedUser);
      let token = null;
      if (typeof userInfo === 'string') {
        token = userInfo;
      } else if (userInfo && userInfo.token) {
        token = userInfo.token;
      } else if (userInfo && userInfo.data && userInfo.data.token) {
        token = userInfo.data.token;
      }
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn("Token not found in userInfo object!");
      }
    } catch (error) {
      console.error("Error parsing userInfo from sessionStorage", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;