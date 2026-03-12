import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { AuthActions, AuthState } from "./types";
import { getUniqueRoles } from "@/shared/constants/roles";

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        role: null,
        roles: [],

        setAuth: ({ accessToken, role, roles }) =>
          set({
            accessToken,
            roles: getUniqueRoles([...(roles ?? []), role]),
            role: role ?? roles?.[0] ?? null,
          }),

        clearAuth: () =>
          set({
            accessToken: null,
            role: null,
            roles: [],
          }),
      }),
      {
        name: "shopping-auth-storage", // key trong localStorage
        storage: createJSONStorage(() => localStorage), // su dung localStorage
      },
    ),
  ),
);
