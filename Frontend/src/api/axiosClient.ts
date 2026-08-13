import axios from "axios";

/**
 * axiosClient
 *
 * Base HTTP client for all API calls. No endpoints are wired to it yet —
 * feature modules (features/products/productsApi.ts, etc.) will import
 * this and call axiosClient.get/post/etc.
 *
 * The auth interceptor is a placeholder: once features/auth exists with a
 * token stored in Redux (or elsewhere), attach it here rather than
 * repeating auth headers in every API call.
 */
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Placeholder: attach auth token once auth state exists.
axiosClient.interceptors.request.use((config) => {
  // const token = store.getState().auth.token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Placeholder: centralized error handling (e.g. redirect to login on 401).
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) { /* handle unauthorized */ }
    return Promise.reject(error);
  }
);
