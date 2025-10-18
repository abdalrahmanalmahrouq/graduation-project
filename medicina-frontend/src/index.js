import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';


const apiBase = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '');
// If apiBase is empty (production), use relative paths and rely on Nginx /api proxy
axios.defaults.baseURL = apiBase ? apiBase.replace(/\/$/, '') : '';

// Set up axios interceptor to handle token updates
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up response interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a login request - don't redirect for login failures
      const isLoginRequest = error.config?.url?.includes('/login');
      
      if (isLoginRequest) {
        // For login requests, just let the component handle the error
        return Promise.reject(error);
      }
      
      // Clear invalid token and user data for other 401 errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Check if it's a token expiration (vs other auth errors)
      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        // Show user-friendly message for expired tokens
        alert('Your session has expired. Please log in again.');
      }
      
      // Redirect to home page only for non-login 401 errors
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
