import axios from 'axios';
import { useContentList } from 'context/contentList';
import { db } from 'context/db';
import { useFeedStore } from 'context/feed';
import { usePlayerStore } from 'context/player';
import { motion } from 'framer-motion';
import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { FeedType, Item } from 'types/feed';
import { encode, getFeed } from 'utils';
import { omit } from 'lodash';
export type ContentType = {
  getRSSDocument: (id: string) => void;
};

const FeedContent = forwardRef<ContentType, any>((props, ref) => {
  const feed = useFeedStore((state) => state.feed);
  const setFeed = useFeedStore((state) => state.setFeed);
  const setContentlist = useContentList((state) => state.setContentList);
  const contentList = useContentList((state) => state.contentList);
  const scrollRef = useRef(null);
  const getRSSDocument = async (id: string) => {
    let feed = (await db.feeds.get(encode(id))) as unknown as FeedType;
    if (!feed) {
      const { feedInfo, status } = (await getFeed(id)) as any;

      feed = feedInfo;

      // loading
    }
    setContentlist(omit(feed, ['items']));

    setFeed({
      ...feed,
      items: JSON.parse(feed.items as unknown as string),
    });
  };

  useImperativeHandle(ref, () => ({
    getRSSDocument,
  }));

  useEffect(() => {
    if (contentList) {
      getRSSDocument(contentList.link);
    }
  }, []);
  return (
    <div className="flex col-span-8 gap-8 flex-col overflow-hidden">
      <h3 className="text-slate-100 font-bold mt-3 ml-5">{feed?.title}</h3>
      <ul
        className="overflow-y-scroll flex-1 grid grid-cols-3 grid-col gap-x-12 gap-y-6 pr-6"
        ref={scrollRef}
      >
        {/* Card */}
        {(feed?.items as Item[])?.map((item, index) => (
          <li className="w-full mt-5 h-80 cursor-pointer" key={index}>
            <Card cardItem={item} />
          </li>
        ))}
      </ul>
    </div>
  );
});

const Card: FC<{
  cardItem: Item;
}> = ({ cardItem }) => {
  const setUrl = usePlayerStore((state) => state.setUrl);
  const clearHistroy = usePlayerStore((state) => state.clearHistroy);

  const activeCard = (evt: Item) => {
    console.log(evt);
    const dom = evt.currentTarget.cloneNode(true);

    dom.id = 'clone-dom';
    dom.style.position = 'absolute';
    dom.style.width = evt.currentTarget.clientWidth + 'px';
    dom.style.height = evt.currentTarget.clientHeight + 'px';
    dom.style.top = evt.currentTarget.top;
    dom.style.left = evt.currentTarget.left;
    dom.style.borderRadius = 0;
    // dom.style.top = 0;
    // dom.style.left = 0;
    dom.style.zIndex = '9999';
    dom.classList.add('duration-1000', 'bg-black');
    dom.classList.remove('hover:bg-black/90', 'bg-black/50');

    document.body.append(dom);
    setTimeout(() => {
      dom.style.width = '100%';
      dom.style.height = '100%';
      dom.style.left = 0;
      dom.style.top = 0;
    }, 200);
    // createElement(motion.div);
  };
  return (
    <div
      onClick={() => {
        clearHistroy();
        setUrl(cardItem?.enclosure?.url);
      }}
      className="transition relative overflow-hidden p-5 h-full w-full rounded-xl shadow-sm shadow-slate-50 mx-auto z-10 bg-black/50 hover:bg-black/90 text-center"
    >
      <motion.img
        className="transition ease-in-out w-full h-full absolute right-0 top-0 opacity-30 hover:opacity-100"
        src={cardItem?.itunes?.image}
        alt={cardItem?.itunes?.subtitle}
      />
      <div className="absolute ease-in-out w-full h-full z-20 left-0 top-0"></div>

      <article className="relative h-full w-full flex items-center justify-center z-30">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {cardItem.title}
        </h5>
      </article>
    </div>
  );
};

// const CloneCard = () => {};

FeedContent.displayName = 'FeedContent';

export { FeedContent };
