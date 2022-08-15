import { Tooltip } from '@chakra-ui/react';
import styled from '@emotion/styled';
import axios from 'axios';
import { SubscribeContext } from 'context/subscribe';
import { useloadingStore } from 'context/useLoading';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { FC, useContext, useEffect, useState } from 'react';
import { FeedType } from 'types/feed';

const NavLayour = styled.nav`
  color: #1c1c1c;

  font-size: 20px;

  font-weight: 400;

  li {
    margin-bottom: 27px;
  }

  .avatar {
    width: 66px;
    height: 66px;
    margin: 52px 0 42px 0;
  }
`;
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
    <NavLayour className="feed-nav col-span-2 h-full overflow-hidden pl-6 flex flex-col">
      <header
        className="w-full py-4 flex items-center"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // setOpen(true);
        }}
      >
        <motion.img
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            signOut();
          }}
          src="https://avatars.githubusercontent.com/u/10773980?s=40&v=4"
          className="avatar rounded-full bg-slate-100 ring-2 ring-white mr-8"
        ></motion.img>
      </header>

      <ul className="flex flex-1 flex-col mt-50 overflow-y-scroll h-full pb-20">
        {feeds && feeds.length > 0
          ? feeds.map((feed, index) => (
              <Tooltip label={feed?.title} key={index}>
                <li
                  className="flex py-2 flex-nowrap items-center mt-2 cursor-pointer active:cursor-progress"
                  onClick={() => fetchFeed(feed)}
                >
                  <>
                    <motion.img
                      className="w-10 h-10 rounded-sm bg-slate-100 ring-1 ring-white shrink-0 mr-3"
                      src={feed?.image as string}
                    ></motion.img>

                    <span className="whitespace-nowrap break-words overflow-hidden flex-grow-1 text-ellipsis">
                      {feed?.title}
                    </span>
                  </>
                </li>
              </Tooltip>
            ))
          : null}
      </ul>
    </NavLayour>
  );
};

// export const getServerSideProps = async (ctx) => {
//   console.log(ctx);

//   return {};
// };
