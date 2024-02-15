import { create } from 'zustand';

interface SidebarStoreState {
  isShow: boolean;
  setShow: (newShow: boolean) => void;
}

export const useSidebarStore = create<SidebarStoreState>((set) => ({
  isShow: true,
  setShow: (newShow: boolean) => set({ isShow: newShow }),
}));
