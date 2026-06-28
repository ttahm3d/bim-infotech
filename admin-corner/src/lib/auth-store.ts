"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
  isSignedIn: boolean;
  setAuth: (payload: {
    token?: string;
    name?: string | null;
    email?: string | null;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      name: null,
      email: null,
      isSignedIn: false,
      setAuth: ({ token, name, email }) =>
        set((state) => ({
          token: token ?? state.token,
          name: name ?? state.name,
          email: email ?? state.email,
          isSignedIn: Boolean(token ?? state.token),
        })),
      clearAuth: () =>
        set({ token: null, name: null, email: null, isSignedIn: false }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        name: state.name,
        email: state.email,
        isSignedIn: state.isSignedIn,
      }),
    },
  ),
);
