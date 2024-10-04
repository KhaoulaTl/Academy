import { getCookies } from "@/utils/functions";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/", // Replace with your API base URL
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
