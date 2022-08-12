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

  const [searchingValue, changeSearchingValue] = useState<string>('');

  const getRSSDocument = async (id: string) => {
    let currentFeed = (await db.feeds.get(encode(id))) as unknown as FeedType;

    if (!currentFeed) {
      const { feedInfo, status } = (await getFeed(id)) as any;

      currentFeed = feedInfo;

      // loading
    }
    setContentlist(omit(currentFeed, ['items']));

    setFeed({
      ...currentFeed,
      items: JSON.parse(currentFeed.items as unknown as string),
    });
  };

  useImperativeHandle(ref, () => ({
    getRSSDocument,
  }));

  useEffect(() => {
    if (contentList) {
      getRSSDocument(contentList.feedUrl);
    }
  }, []);

  return (
    <div className="flex col-span-8 gap-8 flex-col overflow-hidden">
      <header className="flex flex-row justify-between w-full mt-3 px-5 items-center">
        <h3 className="text-slate-100 font-bold">{feed?.title}</h3>

        <div className="relative mr-40 w-80">
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
            className="block p-2 pl-10 pr-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Your Feed By Name"
            value={searchingValue}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              changeSearchingValue(e.target.value);
            }}
          />
        </div>
      </header>

      <ul
        className="overflow-y-scroll flex-1 grid grid-cols-3 grid-col gap-x-12 gap-y-6 pr-6 pb-20"
        ref={scrollRef}
      >
        {/* Card */}
        {(feed?.items as Item[])
          ?.filter((item: Item) =>
            searchingValue.trim() ? item.title.includes(searchingValue) : true,
          )
          ?.map((item, index) => (
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
    <div
      onClick={() => {
        clearHistroy();
        setUrl(cardItem?.enclosure?.url);
      }}
      className="transition relative overflow-hidden p-5 h-full w-full rounded-xl shadow-sm shadow-slate-50 mx-auto z-10 bg-black/50 hover:bg-black/90 text-center"
    >
      {/* <motion.img
        className="transition ease-in-out w-full h-full absolute right-0 top-0 opacity-30 hover:opacity-100"
        src={cardItem?.itunes?.image}
        alt={cardItem?.itunes?.subtitle}
      /> */}
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
