import axios from 'axios';
import { db } from 'context/db';
import Parser from 'rss-parser';
import { FeedType } from 'types/feed';
import { pick } from 'lodash';

export const storeItemsIntoDB = async (feed: FeedType) => {
  const _id = feed._id as string;

  const storeFeed = {
    // id: encode(feed.feedUrl),
    _id,
    id: _id!,
    items: feed.items as string,
    image: feed.image as string,
    ...pick(feed, ['feedUrl', 'title']),
  };
  // if (!storeFeed._id) throw '_id not found';

  await db.feeds.put(storeFeed);
};

export const getFeed = async (feedURL: string, feed?: FeedType) => {
  console.log(process.env.NEXT_PUBLIC_PROXY_SERVER, '.........');
  try {
    const { data, status } = await axios.get(
      `${process.env.NEXT_PUBLIC_PROXY_SERVER}${feedURL}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    );

    if (status === 200) {
      const parser = new Parser();
      let feedInfo = (await parser.parseString(data)) as unknown as FeedType;
      feedInfo.items = JSON.stringify(feedInfo.items);

      if (feed) {
        feedInfo = {
          ...feed,
          items: feedInfo.items,
        };

        storeItemsIntoDB(feedInfo);
        return { feedInfo };
      }

      feedInfo.feedUrl = feedURL;

      console.log(feedInfo, 'feedInfo');
      if (feedInfo.itunes) {
        feedInfo.image = feedInfo.itunes.image;
      } else if (feedInfo.image) {
        feedInfo.image =
          typeof feedInfo.image === 'string'
            ? feedInfo.image
            : feedInfo.image.url;
      }

      return { feedInfo, status };
    }

    console.log(data, status, '.....');
  } catch (err) {
    console.log(err);
  }
  // https://www.ximalaya.com/album/3676806.xml
};
