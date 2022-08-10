import { FeedType } from 'types/feed';
import create from 'zustand';

export const useFeedStore = create<{
  feed: FeedType | null;
  setFeed: (feed: FeedType) => void;
}>((set) => ({
  feed: null!,
  setFeed: (feed: FeedType) => set({ feed }),
}));
