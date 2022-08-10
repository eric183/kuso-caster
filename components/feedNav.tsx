import { Tooltip } from '@chakra-ui/react';
import axios from 'axios';
import { SubscribeContext } from 'context/subscribe';
import { motion } from 'framer-motion';
import { FC, useContext, useEffect, useReducer, useState } from 'react';
import { FeedType } from 'types/feed';

export const FeedNav: FC<{
  getRSSDocument?: (id: string) => void;
}> = ({ getRSSDocument }) => {
  const [feeds, changeFeeds] = useState<FeedType[]>([]);

  const { feedInfo, subscribeDispatch } = useContext(SubscribeContext);

  const getFeedList = async () => {
    const { data, status } = await axios('/api/feed/list', {
      method: 'GET',
    });

    if (status !== 200) {
      console.log('requeset not working');
      return;
    }

    changeFeeds(data.feedList as FeedType[]);
  };

  const fetchFeed = async (id: string) => {
    getRSSDocument && getRSSDocument(id);
  };

  useEffect(() => {
    getFeedList();
  }, []);

  useEffect(() => {
    // console.log(feeds);
  }, [feeds]);

  useEffect(() => {
    changeFeeds(feeds.concat(feedInfo));
  }, [feedInfo]);

  return (
    <nav className="col-span-2 border-r-2 border-gray-600">
      <ul className="flex flex-col mt-5">
        {feeds.length > 0 &&
          feeds.map((feed, index) => (
            <Tooltip label={feed?.title} key={index}>
              <li
                className="flex py-2 flex-nowrap items-center mt-2 cursor-pointer active:cursor-progress"
                onClick={() => fetchFeed(feed.link)}
              >
                <>
                  <motion.img
                    className="w-10 h-10 rounded-sm bg-slate-100 ring-1 ring-white shrink-0 ml-6 mr-3"
                    src={feed?.image}
                  ></motion.img>

                  <span className="text-slate-200 text-xs whitespace-nowrap break-words overflow-hidden flex-grow-1 text-ellipsis">
                    {feed?.title}
                  </span>
                </>
              </li>
            </Tooltip>
          ))}
      </ul>
    </nav>
  );
};
