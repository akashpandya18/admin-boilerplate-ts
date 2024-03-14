import { create } from 'zustand';

interface SidebarStoreState {
  currentShow: boolean;
  setCurrentShow: (newShow: boolean) => void;
}

const useSidebarStore = create<SidebarStoreState>((set) => ({
  currentShow: false,
  setCurrentShow: (currentShow: boolean) => set({ currentShow: currentShow }),
}));

export default useSidebarStore;
