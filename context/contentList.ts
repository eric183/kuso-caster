import { FeedType } from 'types/feed';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type ContentType = Omit<FeedType, 'items'>;

export const useContentList = create<{
  contentList: ContentType | null;
  setContentList: (contentList: ContentType) => void;
}>()(
  persist(
    (set) => ({
      contentList: null,
      setContentList: (contentList: ContentType) =>
        set((state) => ({ contentList })),
      // set((state) => ({ ...state, contentList })),
    }),
    {
      name: 'contentList',
      getStorage: () => localStorage,
    },
  ),
);
