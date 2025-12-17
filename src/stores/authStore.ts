import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
  campusId: string;
}

interface AuthState {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "joinus-auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
