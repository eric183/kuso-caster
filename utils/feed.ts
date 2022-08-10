import axios from 'axios';
import Parser from 'rss-parser';

export const getFeed = async (url: string) => {
  console.log('begin to feed data from url');

  const fetchData = await (await fetch(url)).text();

  const parser = new Parser();

  console.log('got feed data from url');

  return await parser.parseString(fetchData);
};
