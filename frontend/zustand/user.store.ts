/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
}

// Simple encode/decode helpers
const encode = (data: string) => btoa(data);
const decode = (data: string) => atob(data);

// Custom encrypted storage
const encryptedStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    if (!value) return null;

    try {
      const decrypted = decode(value);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    const stringified = JSON.stringify(value);
    const encrypted = encode(stringified);
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
      },

      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: encryptedStorage,
    }
  )
);
