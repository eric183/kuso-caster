import { useContentList } from 'context/contentList';
import { db } from 'context/db';
import { useFeedStore } from 'context/feed';
import { usePlayerStore } from 'context/player';
import {
  FC,
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FeedType, Item } from 'types/feed';
import { getFeed, storeItemsIntoDB } from 'utils';
import { omit } from 'lodash';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AudioPlayerProvider } from './audioPlayerProvider';
import styled from '@emotion/styled';
import { Box, Skeleton, Spinner, Stack } from '@chakra-ui/react';

export type ContentType = {
  getRSSDocument: (feedInfo: FeedType) => void;
  setLoading: (data: boolean) => void;
};

const CardLayout = styled.div`
  color: #1c1c1c;
  border-radius: 30px;

  /* height: 15rem; */
`;

const ContentLayout = styled.div`
  padding: 3.125rem 2.75rem 0 4.5rem;

  header {
    color: #1c1c1c;
  }

  input {
    background-color: #f1f1f1;
    border-radius: 7px;
    border: 0;
    color: #1c1c1c;
  }

  h3:before {
    content: '';
    position: absolute;
    left: -1rem;
    bottom: -7px;
    width: 4px;
    height: 26px;
    background: #1c1c1c;
  }
  ul {
    grid-template-columns: 27.5fr 27.5fr 27.5fr;
    gap: 3.235%;
  }

  h5 {
    font-size: 14px;
    text-align: left;
    left: 17px;
    top: 71.7391304347826%;
    max-width: 66.236%;
    line-height: 17px;
  }

  li {
    height: 11.5rem;
  }

  .background-color-mask {
    position: absolute;
    height: 50%;

    bottom: 0;
    left: 0;

    background: linear-gradient(
      180deg,
      rgba(62, 62, 62, 0.0001) 0%,
      #1e1e1e 85.15%
    );
    mix-blend-mode: normal;
    opacity: 0.6;
  }
`;
const FeedContent = forwardRef<ContentType, any>((props, ref) => {
  const feed = useFeedStore((state) => state.feed);
  const setFeed = useFeedStore((state) => state.setFeed);
  const addItemToFeed = useFeedStore((state) => state.addItemToFeed);
  const setContentlist = useContentList((state) => state.setContentList);
  const contentList = useContentList((state) => state.contentList);
  // const setLoading = useloadingStore((state) => state.setLoading);

  const [loading, setLoading] = useState<boolean>(false);

  const scrollRef = useRef(null);

  const [searchingValue, changeSearchingValue] = useState<string>('');

  const getRSSDocument = async (_feed: FeedType) => {
    let currentFeed = (await db.feeds.get(_feed._id!)) as unknown as FeedType;

    if (!currentFeed) {
      // setLoading(true);

      const { data, status } = (await axios(
        `/api/feed/items/${_feed._id}`,
      )) as any;

      if (!data.feedItems) {
        const { feedInfo, status } = (await getFeed(
          _feed.feedUrl,
          _feed,
        )) as any;

        currentFeed = feedInfo;

        axios('/api/feed/items/create', {
          method: 'POST',
          data: {
            feed: currentFeed,
          },
        });
      } else {
        currentFeed = { ..._feed, items: data.feedItems };

        storeItemsIntoDB(currentFeed);
      }

      // loading
    }

    setContentlist(omit(currentFeed, ['items']));

    setFeed({
      ...currentFeed,
      items: JSON.parse(currentFeed.items as unknown as string),
    });

    setLoading(false);
  };

  const getItemFromParent = (item: Item) => {
    addItemToFeed(item);
  };

  useImperativeHandle(ref, () => ({
    getRSSDocument,
    getItemFromParent,
    setLoading,
  }));

  useEffect(() => {
    if (contentList) {
      getRSSDocument(contentList);
    }
  }, []);

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <ContentLayout className="relative flex col-span-8 gap-8 flex-col overflow-hidden bg-white">
      <header className="flex flex-row justify-between w-full mt-3 px-5 items-center">
        <h3 className="relative font-bold">{feed?.title}</h3>

        <div className="relative w-80">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            required
            type="search"
            id="search"
            className="block p-2 pl-10 pr-5 w-full text-sm bg-gray-50 rounded-lg border"
            placeholder="Search Your Feed By Name"
            value={searchingValue}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeSearchingValue(e.target.value);
            }}
          />
        </div>
      </header>

      {!loading ? (
        <>
          <ul
            // grid-cols-3 grid-col gap-x-12 gap-y-6 pr-6 pb-20
            className="overflow-y-scroll flex-1 grid"
            ref={scrollRef}
          >
            {/* Card */}
            {(feed?.items as Item[])
              ?.filter((item: Item) =>
                searchingValue.trim()
                  ? item.title.includes(searchingValue)
                  : true,
              )
              ?.map((item, index) => (
                <li className="w-full mt-5 h-80" key={index}>
                  <Card cardItem={item} />
                </li>
              ))}
          </ul>
        </>
      ) : (
        <ul className="overflow-y-scroll flex-1 grid">
          {Array(6)
            .fill(null)
            .map((_, key) => (
              <li className="w-full mt-5 h-80" key={key}>
                <Skeleton height="100%" isLoaded={false}>
                  <Box>hi</Box>
                </Skeleton>
              </li>
            ))}
        </ul>
      )}

      <AudioPlayerProvider />
    </ContentLayout>
  );
});

const Card: FC<{
  cardItem: Item;
}> = ({ cardItem }) => {
  const setUrl = usePlayerStore((state) => state.setUrl);
  const clearHistroy = usePlayerStore((state) => state.clearHistroy);

  const favToggle = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    console.log(event);
    event.target.classList.toggle('fill-sky-500');

    axios('/api/feed/addfavorite', {});
  };

  // const activeCard = (evt: any) => {
  //   console.log(evt);
  //   const dom = evt.currentTarget.cloneNode(true);

  //   dom.id = 'clone-dom';
  //   dom.style.position = 'absolute';
  //   dom.style.width = evt.currentTarget.clientWidth + 'px';
  //   dom.style.height = evt.currentTarget.clientHeight + 'px';
  //   dom.style.top = evt.currentTarget.top;
  //   dom.style.left = evt.currentTarget.left;
  //   dom.style.borderRadius = 0;
  //   // dom.style.top = 0;
  //   // dom.style.left = 0;
  //   dom.style.zIndex = '9999';
  //   dom.classList.add('duration-1000', 'bg-black');
  //   dom.classList.remove('hover:bg-black/90', 'bg-black/50');

  //   document.body.append(dom);
  //   setTimeout(() => {
  //     dom.style.width = '100%';
  //     dom.style.height = '100%';
  //     dom.style.left = 0;
  //     dom.style.top = 0;
  //   }, 200);
  //   // createElement(motion.div);
  // };
  return (
    <CardLayout className="transition relative overflow-hidden h-full w-full bmx-auto z-10 text-center">
      {/* <StarIcon favToggle={favToggle} /> */}
      <motion.img
        className="transition ease-in-out w-full h-full absolute right-0 top-0"
        src={cardItem?.itunes?.image}
        alt={cardItem?.itunes?.subtitle}
      />
      {/* <div className="absolute ease-in-out w-full h-full z-10 left-0 top-0"></div> */}

      <article
        className="relative h-full w-full flex cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          clearHistroy();
          setUrl(cardItem?.enclosure?.url);
        }}
      >
        <h5 className="text-white absolute tracking-tight z-10">
          {cardItem.title}
        </h5>

        <i className="background-color-mask w-full h-3/6"></i>
      </article>
    </CardLayout>
  );
};

// const CloneCard = () => {};

FeedContent.displayName = 'FeedContent';

const StarIcon: FC<{
  favToggle: (event: any) => void;
}> = ({ favToggle }) => {
  return (
    <svg
      onClick={(event) => {
        favToggle(event);
      }}
      // fill-sky-500
      className="absolute right-5 top-5 w-8 h-8 cursor-move fill-gray-800 z-20"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Capa_1"
      x="0px"
      y="0px"
      viewBox="0 0 107.1 107.1"
      // style={'enable-background:new 0 0 107.1 107.1;'}
      xmlSpace="preserve"
    >
      <g>
        <path d="M2.287,47.815l23.096,19.578L18.2,96.831c-1.411,5.491,4.648,9.998,9.575,6.901L53.55,87.813l25.774,15.916   c4.79,2.955,10.844-1.408,9.576-6.902l-7.184-29.435l23.099-19.579c4.363-3.661,2.111-10.844-3.662-11.267l-30.282-2.255   L59.464,6.266c-2.112-5.211-9.577-5.211-11.832,0L36.225,34.292L5.944,36.547C0.174,37.113-2.081,44.154,2.287,47.815z" />
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  );
};
export { FeedContent };
