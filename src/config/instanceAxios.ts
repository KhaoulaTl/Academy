import { getCookies } from "@/utils/functions";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL
const axiosInstance = axios.create({
  baseURL, 
});
// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request steps here (e.g., add headers, authentication tokens)
    // config.headers["Content-Type"] = "application/json";
    config.headers["access-control-allow-origin"] = "*";

    const token = getCookies("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here (e.g., parse, transform)

    return response;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);

export default axiosInstance;
