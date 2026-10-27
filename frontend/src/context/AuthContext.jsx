import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("hiresense_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("hiresense_token"));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let mounted = true;
    async function hydrate() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authApi.me();
        if (mounted) {
          setUser(data);
          localStorage.setItem("hiresense_user", JSON.stringify(data));
        }
      } catch {
        logout();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    hydrate();
    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("hiresense_token");
      localStorage.removeItem("hiresense_user");
      setToken(null);
      setUser(null);
    };

    window.addEventListener("hiresense:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("hiresense:unauthorized", handleUnauthorized);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("hiresense_token", data.access_token);
    localStorage.setItem("hiresense_user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    persistSession(data);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await authApi.signup(payload);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("hiresense_token");
    localStorage.removeItem("hiresense_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(token), login, signup, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
