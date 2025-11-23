import axios from "axios";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api", // Change this to your backend URL
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or wherever you store it
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          // localStorage.removeItem("token");
          // window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("No response from server");
    } else {
      // Error setting up request
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;


