import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKVStorage } from "@/lib/mmkv";
import { User } from "@/types/auth/auth";

interface AuthState {
  city: string;
  user?: User;
  id_token?: string;
  refresh_token?: string;
  isVerified: boolean;
  isCitySelected: boolean;
  tempSignupData?: {
    phone_number: string;
    password: string;
    email: string;
  };
  setCity: (city: string) => void;
  setAuth: (data: {
    user: User;
    id_token: string;
    refresh_token: string;
  }) => void;
  updateUser: (user: User) => void;
  setIsVerified: (isVerified: boolean) => void;
  setIsCitySelected: (isCitySelected: boolean) => void;
  setTempSignupData: (data: { phone_number: string; password: string; email: string }) => void;
  clearTempSignupData: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      city: "Delhi",
      user: undefined,
      id_token: undefined,
      refresh_token: undefined,
      isVerified: false,
      isCitySelected: false,
      tempSignupData: undefined,
      setCity: (city) => {
        set({ city });
      },
      setAuth: ({ user, id_token, refresh_token }) => {
        set({ user, id_token, refresh_token });
      },
      updateUser: (user) => {
        set({ user });
      },
      setIsVerified: (isVerified) => {
        set({ isVerified: isVerified });
      },
      setIsCitySelected: (isCitySelected) => {
        set({ isCitySelected: isCitySelected });
      },
      setTempSignupData: (data) => {
        set({ tempSignupData: data });
      },
      clearTempSignupData: () => {
        set({ tempSignupData: undefined });
      },

      clearAuth: () => {
        set({
          user: undefined,
          id_token: undefined,
          refresh_token: undefined,
          tempSignupData: undefined,
          isVerified: false,
          isCitySelected: false,
        });
      },
    }),
    {
      name: "camorent-auth",
      storage: createJSONStorage(() => MMKVStorage),
      partialize: (state) => ({
        user: state.user,
        id_token: state.id_token,
        refresh_token: state.refresh_token,
        city: state.city,
        isVerified: state.isVerified,
        isCitySelected: state.isCitySelected,
      }),
    }
  )
);

export function getUser(): User | undefined {
  return useAuthStore.getState().user;
}
