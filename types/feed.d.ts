export interface FeedType {
  copyright: Copyright;
  description: string;
  feedUrl: string;
  generator: string;
  image: string;
  items: Item[];
  itunes: string;
  language: string;
  lastBuildDate: string;
  link: string;
  managingEditor: string;
  paginationLinks: PaginationLinks;
  title: string;
}

export enum Copyright {
  WWWGcoresCOM = 'www.gcores.com',
}

export interface Item {
  content: string;
  contentSnippet: string;
  enclosure: Enclosure;
  guid: string;
  isoDate: string;
  itunes: Itunes;
  pubDate: string;
  title: string;
}

export interface Enclosure {
  length: string;
  type: Type;
  url: string;
}

export enum Type {
  AudioMPEG = 'audio/mpeg',
}

export interface Itunes {
  author: Copyright;
  duration: string;
  explicit: Explicit;
  image: string;
  subtitle: string;
  summary: string;
}

export enum Explicit {
  Clean = 'clean',
}

export interface PaginationLinks {
  self: string;
}
