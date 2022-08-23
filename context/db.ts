import Dexie, { Table } from 'dexie';

export interface Feed {
  id: string;
  image: string;
  items: string;
  feedUrl: string;
  title: string;
  _id: string;
}

export class MySubClassedDexie extends Dexie {
  feeds!: Table<Feed>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      feeds: 'id, feedUrl, title, image, items, _id',
    });
  }
}

export const db = new MySubClassedDexie();
