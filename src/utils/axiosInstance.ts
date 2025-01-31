// utils/axiosInstance.ts
'use client';  // We'll use this in client components

import axios from 'axios';

// Adjust BASE_URL to your NestJS server's address
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // To send cookies with requests
});

// Interceptor to attach token if present in localStorage
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default axiosInstance;
