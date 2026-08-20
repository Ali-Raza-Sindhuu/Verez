import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export const API_URL = import.meta.env.VITE_API_URL;

// The store is injected after creation (see store/store.ts) to avoid a
// circular import between this file and the store itself.
let injectedStore: Store<RootState> | null = null;
export function injectStore(store: Store<RootState>) {
  injectedStore = store;
}

// Plain axios instance for auth endpoints (login/register/refresh) — these
// must NOT go through the interceptors below, or a failed refresh would
// try to refresh itself.
export const authApi = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

// Main API client for everything else. Automatically attaches the access
// token and retries once with a refreshed token on 401.
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = injectedStore?.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // De-dupe concurrent 401s so we only hit /refresh once.
  if (!refreshPromise) {
    refreshPromise = authApi
      .post("/refresh")
      .then((res) => res.data?.data?.accessToken ?? null)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken && injectedStore) {
        const { setAccessToken } = await import(
          "@/store/features/auth/authSlice"
        );
        injectedStore.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }

      // Refresh failed — clear auth state so the UI can redirect to /login.
      if (injectedStore) {
        const { clearAuth } = await import(
          "@/store/features/auth/authSlice"
        );
        injectedStore.dispatch(clearAuth());
      }
    }

    return Promise.reject(error);
  }
);