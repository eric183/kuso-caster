import axios from 'axios';
import Parser from 'rss-parser';

export const getFeed = async (url: string) => {
  const rssData = await axios.get(url, {
    withCredentials: false,
  });

  const parser = new Parser();

  return await parser.parseString(rssData.data);
};
