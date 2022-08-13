import create from 'zustand';

export const useloadingStore = create<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));
