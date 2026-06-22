"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getMe,
  getFavorites as apiGetFavorites,
  addFavorite as apiAddFavorite,
  removeFavorite as apiRemoveFavorite,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { Tattoo } from "@/lib/types";

type User = { id: string; name: string; email: string } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  loading: boolean;
  favoriteIds: string[];
  favoriteTattoos: Tattoo[];
  favoritesLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFavorites: () => Promise<void>;
  addFavorite: (tattoo: Tattoo) => Promise<void>;
  removeFavorite: (tattooId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem("token") : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(!!token);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteTattoos, setFavoriteTattoos] = useState<Tattoo[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setFavoritesLoaded(false);
      setFavoriteIds([]);
      setFavoriteTattoos([]);
      return;
    }

    const currentToken = token;
    let mounted = true;
    setLoading(true);

    async function initializeAuth() {
      try {
        const res = await getMe(currentToken);
        if (mounted) setUser(res.data || null);
      } catch (err) {
        console.error("getMe failed", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setFavoriteIds([]);
        setFavoriteTattoos([]);
        setFavoritesLoaded(false);
        return;
      }

      try {
        await loadFavorites();
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [token]);

  async function loadFavorites() {
    if (!token) {
      setFavoriteIds([]);
      setFavoriteTattoos([]);
      setFavoritesLoaded(true);
      return;
    }

    const response = await apiGetFavorites(token);
    const normalizedFavorites: Tattoo[] = response.data.map((tattoo) => ({
      ...tattoo,
      id: tattoo._id ?? tattoo.id,
    })) as Tattoo[];

    setFavoriteIds(normalizedFavorites.map((tattoo) => tattoo.id));
    setFavoriteTattoos(normalizedFavorites);
    setFavoritesLoaded(true);
  }

  async function login(email: string, password: string) {
    setLoading(true);
    const res = await apiLogin(email, password);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.data);
    setLoading(false);
    router.push("/");
  }

  async function register(name: string, email: string, password: string) {
    setLoading(true);
    const res = await apiRegister(name, email, password);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.data);
    setLoading(false);
    router.push("/");
  }

  async function addFavorite(tattoo: Tattoo) {
    if (!token) throw new Error("Authentication required");
    await apiAddFavorite(tattoo.id, token);
    setFavoriteIds((current) =>
      current.includes(tattoo.id) ? current : [...current, tattoo.id]
    );
    setFavoriteTattoos((current) =>
      current.some((item) => item.id === tattoo.id)
        ? current
        : [...current, tattoo]
    );
  }

  async function removeFavorite(tattooId: string) {
    if (!token) throw new Error("Authentication required");
    await apiRemoveFavorite(tattooId, token);
    setFavoriteIds((current) => current.filter((id) => id !== tattooId));
    setFavoriteTattoos((current) =>
      current.filter((item) => item.id !== tattooId)
    );
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setFavoriteIds([]);
    setFavoriteTattoos([]);
    setFavoritesLoaded(false);
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        favoriteIds,
        favoriteTattoos,
        favoritesLoaded,
        login,
        register,
        logout,
        loadFavorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
