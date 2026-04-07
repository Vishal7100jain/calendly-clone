import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const apiKey = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_BACKEND_API_SECRET;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    config.headers["x-api-key"] = apiKey;
    config.headers["x-api-secret"] = apiSecret;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
