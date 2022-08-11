import Dexie, { Table } from 'dexie';
import { FeedType } from 'types/feed';

export interface Feed {
  id: string;
  image: string;
  items: string;
  feedUrl: string;
  title: string;
}

export class MySubClassedDexie extends Dexie {
  feeds!: Table<Feed>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      feeds: 'id, feedUrl, title, image, items',
    });
  }
}

export const db = new MySubClassedDexie();
