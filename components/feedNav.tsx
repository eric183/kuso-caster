import { Tooltip } from '@chakra-ui/react';
import axios from 'axios';
import { SubscribeContext } from 'context/subscribe';
import { useloadingStore } from 'context/useLoading';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { FC, useContext, useEffect, useState } from 'react';
import { FeedType } from 'types/feed';

export const FeedNav: FC<{
  getRSSDocument?: (feedInfo: FeedType) => void;
  feed: FeedType;
}> = ({ getRSSDocument, feed }) => {
  const setLoading = useloadingStore((state) => state.setLoading);
  const loading = useloadingStore((state) => state.loading);

  const [feeds, changeFeeds] = useState<FeedType[]>([]);

  const { feedInfo } = useContext(SubscribeContext);

  const getFeedList = async () => {
    const { data, status } = await axios('/api/feed/list', {
      method: 'GET',
    });

    if (data.error) {
      signOut();
    }

    if (status !== 200) {
      console.log('requeset not working');
      return;
    }

    changeFeeds(data.feedList as FeedType[]);

    // setLoading(false);
  };

  const fetchFeed = async (feedInfo: FeedType) => {
    // setLoading(true);
    getRSSDocument && getRSSDocument(feedInfo);
  };

  useEffect(() => {
    getFeedList();
  }, []);

  useEffect(() => {
    // console.log(feeds);

    if (feed) {
      changeFeeds(feeds.concat(feed));
    }
  }, [feed]);

  return (
    <nav className="feed-nav col-span-2 h-full border-r-2 border-gray-600 overflow-hidden">
      <ul className="flex flex-col mt-5 overflow-y-scroll h-full pb-20">
        {feeds && feeds.length > 0
          ? feeds.map((feed, index) => (
              <Tooltip label={feed?.title} key={index}>
                <li
                  className="flex py-2 flex-nowrap items-center mt-2 cursor-pointer active:cursor-progress"
                  onClick={() => fetchFeed(feed)}
                >
                  <>
                    <motion.img
                      className="w-10 h-10 rounded-sm bg-slate-100 ring-1 ring-white shrink-0 ml-6 mr-3"
                      src={feed?.image as string}
                    ></motion.img>

                    <span className="text-slate-200 text-xs whitespace-nowrap break-words overflow-hidden flex-grow-1 text-ellipsis">
                      {feed?.title}
                    </span>
                  </>
                </li>
              </Tooltip>
            ))
          : null}
      </ul>
    </nav>
  );
};

// export const getServerSideProps = async (ctx) => {
//   console.log(ctx);

//   return {};
// };
