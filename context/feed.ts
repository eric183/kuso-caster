import { FeedType, Item } from 'types/feed';
import create from 'zustand';

export const useFeedStore = create<{
  feed: FeedType | null;
  setFeed: (feed: FeedType) => void;
  addItemToFeed: (item: Item) => void;
}>((set) => ({
  feed: null!,
  setFeed: (feed: FeedType) => set({ feed }),
  addItemToFeed: (item) =>
    set(({ feed }) => ({
      feed: feed,
      item: [...(feed!.items as Item[]), item],
    })),
}));
