import { create } from 'zustand';

interface SidebarStoreState {
  showSideBar: boolean;
  setShowSideBar: (newShow: boolean) => void;
  toggleSideBar: () => void;
}

const useSidebarStore = create<SidebarStoreState>((set) => ({
  showSideBar: true,
  setShowSideBar: (showSideBar: boolean) => set({ showSideBar: showSideBar }),
  toggleSideBar: () => set((state) => ({ showSideBar: !state.showSideBar })),
}));

export default useSidebarStore;
