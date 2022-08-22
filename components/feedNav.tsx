import { Skeleton, Tooltip } from '@chakra-ui/react';
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

  font-size: 16px;

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
  feed: FeedType;
  getRSSDocument?: (feedInfo: FeedType) => void;
  setContentloading?: (loading: boolean) => void;
}> = ({ getRSSDocument, feed, setContentloading }) => {
  const [feeds, changeFeeds] = useState<FeedType[]>([]);

  const { feedInfo } = useContext(SubscribeContext);
  const [loading, setLoading] = useState<boolean>(true);

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
  };

  const fetchFeed = async (feedInfo: FeedType) => {
    getRSSDocument && getRSSDocument(feedInfo);
    setContentloading && setContentloading(true);
  };

  useEffect(() => {
    setLoading(true);
    getFeedList();
  }, []);

  useEffect(() => {
    // console.log(feeds);

    if (feed) {
      changeFeeds(feeds.concat(feed));
    }
  }, [feed]);

  useEffect(() => {
    if (feeds.length > 0) {
      setLoading(false);
    }
  }, [feeds]);

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

      {loading ? (
        <ul>
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <li className="w-full mt-5 h-10" key={index}>
                <Skeleton height="100%" isLoaded={false}>
                  <div>aaqa</div>
                </Skeleton>
              </li>
            ))}
        </ul>
      ) : (
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
      )}
    </NavLayour>
  );
};

// export const getServerSideProps = async (ctx) => {
//   console.log(ctx);

//   return {};
// };
