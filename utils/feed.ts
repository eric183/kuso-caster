import axios from 'axios';
import Parser from 'rss-parser';

export const getFeed = async (url: string) => {
  const fetchData = await (await fetch(url)).text();

  const parser = new Parser();

  return await parser.parseString(fetchData);
};
