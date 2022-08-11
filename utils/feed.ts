import axios from 'axios';
import { db } from 'context/db';
import Parser from 'rss-parser';
import { FeedType } from 'types/feed';
import { encode } from 'utils';
import { pick } from 'lodash';

const PROXY_SERVER = 'https://cors-anywhere.herokuapp.com/';

const storeItemsIntoDB = async (feed: FeedType) => {
  const storeFeed = {
    id: encode(feed.feedUrl),
    items: feed.items as string,
    image: feed.image as string,
    ...pick(feed, ['feedUrl', 'title']),
  };

  await db.feeds.put(storeFeed);
};

export const getFeed = async (feedURL: string) => {
  const { data, status } = await axios.get(`${PROXY_SERVER}${feedURL}`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });

  if (status === 200) {
    const parser = new Parser();
    const feedInfo = (await parser.parseString(data)) as unknown as FeedType;
    feedInfo.feedUrl = feedURL;
    if (feedInfo.itunes) {
      feedInfo.image = feedInfo.itunes.image;
    } else if (feedInfo.image) {
      feedInfo.image =
        typeof feedInfo.image === 'string'
          ? feedInfo.image
          : feedInfo.image.url;
    }

    feedInfo.items = JSON.stringify(feedInfo.items);
    storeItemsIntoDB(feedInfo);

    return { feedInfo, status };
  }
};
