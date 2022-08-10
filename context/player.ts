import { FeedType } from 'types/feed';
import create from 'zustand';

type playerType = {
  [key: string]: any;
};

export const usePlayerStore = create<{
  player: playerType | null;
  setPlayer: (feed: playerType) => void;
}>((set) => ({
  player: null!,
  setPlayer: (player: playerType) => set({ player }),
}));
