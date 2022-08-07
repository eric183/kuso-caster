export interface FeedType {
  title: string;
  link: string;
  pubDate: string;
  enclosure: Enclosure;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
  itunes?: ItemItunes;
}

export interface Enclosure {
  url: string;
  type: Type;
  length: string;
}

export enum Type {
  AudioXM4A = "audio/x-m4a",
}

export interface ItemItunes {
  explicit: string;
  duration: string;
  image: string;
  episode: string;
  season: string;
}

export interface InterItunes {
  owner: Owner;
  image: string;
  categories: string[];
  categoriesWithSubs: CategoriesWithSub[];
  author: string;
  explicit: string;
}

export interface CategoriesWithSub {
  name: string;
  subs: Sub[];
}

export interface Sub {
  name: string;
}

export interface Owner {
  name: string;
  email: string;
}

export interface PaginationLinks {
  self: string;
}
