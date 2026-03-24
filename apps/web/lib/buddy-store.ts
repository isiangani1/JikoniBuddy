import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BuddyState {
  isOnline: boolean;
  toggleOnline: () => void;
  setIsOnline: (online: boolean) => void;
}

export const useBuddyStore = create<BuddyState>()(
  persist(
    (set) => ({
      isOnline: false,
      toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
      setIsOnline: (online: boolean) => set({ isOnline: online }),
    }),
    {
      name: 'jb-buddy-storage',
    }
  )
);
