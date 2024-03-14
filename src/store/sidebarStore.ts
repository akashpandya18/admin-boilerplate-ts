import { create } from 'zustand';

interface SidebarStoreState {
  isShow: boolean;
  currentShow: boolean;
  setShow: (newShow: boolean) => void;
  setCurrentShow: (newShow: boolean) => void;
}

export const useSidebarStore = create<SidebarStoreState>((set) => ({
  isShow: true,
  currentShow: true,
  setShow: (newShow: boolean) => set({ isShow: newShow }),
  setCurrentShow: (newShow: boolean) => set({ currentShow: newShow }),
}));
