import { create } from "zustand";
import type { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  initAuth: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({
          token,
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },
}));
