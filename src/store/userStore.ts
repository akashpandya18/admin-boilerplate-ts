import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserData {
  id: string;
  name: string;
  email: string;
}
interface AuthState {
  authToken: string | null;
  deviceToken: string | null;
  user: UserData | null;
  setAuthToken: (token: string) => void;
  setUser: (userData: UserData) => void;
  setDeviceToken: (deviceToken: string) => void;
  clearTokens: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authToken: '',
      user: null,
      deviceToken: '',
      setAuthToken: (authToken) => set({ authToken }),
      setUser: (userData) => set({ user: userData }),
      setDeviceToken: (deviceToken) => set({ deviceToken }),
      clearTokens: () => set({ authToken: '', user: null, deviceToken: '' }),
    }),
    {
      name: 'admin-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
