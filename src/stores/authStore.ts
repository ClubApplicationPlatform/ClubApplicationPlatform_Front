import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserRole = "admin" | "user";

const REFRESH_ENDPOINT =
  "https://clubapplicationplatform-server.onrender.com/api/v1/auth/refresh";

export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
  campusId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  login: (user: AuthUser, tokens?: AuthTokens | null) => void;
  refreshTokens: () => Promise<AuthTokens | null>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const refreshTokens = async (): Promise<AuthTokens | null> => {
        const current = get().tokens;
        if (!current) return null;

        try {
          const response = await fetch(REFRESH_ENDPOINT, {
            method: "POST",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: current.accessToken,
              refresh_token: current.refreshToken,
            }),
          });

          const body = (await response.json().catch(() => null)) as {
            status?: number;
            data?: {
              access_token?: string;
              refresh_token?: string;
            } | null;
            message?: string;
          } | null;

          const ok = response.ok && (body?.status ?? response.status) < 400;
          const nextAccess = body?.data?.access_token;
          const nextRefresh = body?.data?.refresh_token;
          if (!ok || !nextAccess || !nextRefresh) {
            throw new Error(body?.message ?? "Failed to refresh tokens");
          }

          const tokens = {
            accessToken: nextAccess,
            refreshToken: nextRefresh,
          };
          set({ tokens });
          return tokens;
        } catch (error) {
          console.error("Token refresh failed", error);
          set({ tokens: null, user: null });
          return null;
        }
      };

      return {
        user: null,
        tokens: null,
        setUser: (user) => set({ user }),
        setTokens: (tokens) => set({ tokens }),
        login: (user, tokens = null) => set({ user, tokens }),
        refreshTokens,
        logout: () => set({ user: null, tokens: null }),
      };
    },
    {
      name: "joinus-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
