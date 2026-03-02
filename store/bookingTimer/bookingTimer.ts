import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKVStorage } from "@/lib/mmkv";

interface BookingTimerState {
  isActive: boolean;
  isApproved: boolean; // true = show congratulations overlay
  bookingId: string | null;
  startTimestamp: number | null; // epoch ms — persisted so timer survives app restart
  startTimer: (bookingId: string) => void;
  approveTimer: () => void; // called when admin approves — shows congrats then stops
  stopTimer: () => void;
}

export const useBookingTimerStore = create<BookingTimerState>()(
  persist(
    (set) => ({
      isActive: false,
      isApproved: false,
      bookingId: null,
      startTimestamp: null,

      startTimer: (bookingId) =>
        set({ isActive: true, isApproved: false, bookingId, startTimestamp: Date.now() }),

      approveTimer: () =>
        set({ isApproved: true }),

      stopTimer: () =>
        set({ isActive: false, isApproved: false, bookingId: null, startTimestamp: null }),
    }),
    {
      name: "camorent-booking-timer",
      storage: createJSONStorage(() => MMKVStorage),
    }
  )
);
