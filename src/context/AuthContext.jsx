/* eslint-disable react-refresh/only-export-components --
   Context + hook sengaja satu file (sesuai pola AuthContext di materi). */
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axiosInstance";
import { queryClient } from "../lib/queryClient";

// AuthContext: single source of truth untuk status login.
const AuthContext = createContext(null);
const TOKEN_KEY = "accessToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // restoreSession: cek token tersimpan saat aplikasi pertama jalan,
  // lalu muat ulang profil user. Mencegah "ke-logout" saat refresh.
  useEffect(() => {
    let active = true;
    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  async function login({ email, password }) {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    queryClient.clear(); // penting: data user A jangan tumpah ke user B
  }

  const value = { user, isAuthenticated: !!user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  }
  return ctx;
}
