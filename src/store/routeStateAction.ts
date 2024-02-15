import { create } from 'zustand';

interface StateActionStoreState {
  currentAction: string;
  setCurrentAction: (currentAction: string) => void;
}

const useStateActionStore = create<StateActionStoreState>((set) => ({
  currentAction: '',
  setCurrentAction: (currentAction: string) => set(() => ({ currentAction })),
}));

export default useStateActionStore;
