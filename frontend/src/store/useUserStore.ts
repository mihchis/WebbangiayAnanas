import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isTwoFactorEnabled: boolean;
}

interface UserState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  update2faStatus: (isEnabled: boolean) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
      },

      update2faStatus: (isEnabled) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, isTwoFactorEnabled: isEnabled },
          });
        }
      },

      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },

      isAuthenticated: () => {
        return get().user !== null && get().accessToken !== null;
      },
    }),
    {
      name: 'ananas-user-session', // key for session storage
    },
  ),
);
