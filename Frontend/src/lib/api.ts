import { useAuth } from "@clerk/react";

const API_URL = import.meta.env.VITE_API_URL;

export function useApi() {
  const { getToken } = useAuth();

  async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = await getToken();

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  }

  return { apiFetch };
}