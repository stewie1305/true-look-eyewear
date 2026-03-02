import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { AuthActions, AuthState } from "./types";

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        role: null,

        setAuth: ({ accessToken, role }) =>
          set({
            accessToken,
            role,
          }),

        clearAuth: () =>
          set({
            accessToken: null,
            role: null,
          }),
      }),
      {
        name: "shopping-auth-storage", // key trong localStorage
        storage: createJSONStorage(() => localStorage), // su dung localStorage
      },
    ),
  ),
);
