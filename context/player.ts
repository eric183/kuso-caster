import create from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerType {
  [key: string]: any;
  url: string;
  playing: boolean;
  status: 'playing' | 'paused' | 'stopped';
  currentTime: number;
  duration: number;
  volume: number;
  caching: boolean;
  setCaching: (caching: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setUrl: (url: string) => void;
  setStatus: (status: 'playing' | 'paused' | 'stopped') => void;
  setCurrentTime: (currentTime: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  clearHistroy: () => void;
}

export const usePlayerStore = create<PlayerType>()(
  persist(
    (set) => ({
      status: 'stopped',
      currentTime: 0,
      duration: 0,
      volume: 1,
      playing: false,
      url: '',
      caching: false,
      setCaching: (caching: boolean) => set((state) => ({ ...state, caching })),
      setPlaying: (playing: boolean) => set({ playing }),
      setUrl: (url: string) => set({ url }),
      setStatus: (status: 'playing' | 'paused' | 'stopped') => set({ status }),
      setCurrentTime: (currentTime: number) => set({ currentTime }),
      setDuration: (duration: number) => set({ duration }),
      setVolume: (volume: number) => set({ volume }),
      clearHistroy: () =>
        set({
          status: 'stopped',
          currentTime: 0,
          duration: 0,
          playing: false,
          url: '',
          caching: false,
        }),
    }),
    {
      name: 'playerHistory',
      getStorage: () => localStorage,
    },
  ),
);
