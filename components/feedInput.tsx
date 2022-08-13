import { SubscribeContext } from 'context/subscribe';
import { FC, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Spin } from './spin';
import axios from 'axios';
import Parser from 'rss-parser';
import { FeedType } from 'types/feed';
import { omit } from 'lodash';
import { db } from 'context/db';
import { getFeed, storeItemsIntoDB } from 'utils';
interface NextPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubscribe?: (data: any) => void;
}

const FeedInput: FC<NextPageProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [feedURL, changeFeedUrl] = useState<string>('');
  const [feedExist, changeFeedExist] = useState<boolean>(false);
  const { feedInfo, subscribeDispatch } = useContext(SubscribeContext);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [searchingStatus, changeSearchingStatus] = useState<
    'ldle' | 'searching' | 'processing'
  >('ldle');

  const fetchFeed = async () => {
    const checkInfo = await axios('/api/feed/checkCurrentFeedIfExist', {
      method: 'POST',
      data: {
        url: feedURL.trim(),
      },
    });

    if (checkInfo.status === 200 && checkInfo.data.isFeedExsit) {
      changeSearchingStatus('processing');
      changeFeedExist(true);
      subscribeDispatch({ type: 'MUTATION', payload: checkInfo.data.feedInfo });
      console.log('cached');
      return;
    }

    const { feedInfo, status } = (await getFeed(feedURL)) as any;

    switch (status) {
      case 200:
        {
          subscribeDispatch({ type: 'MUTATION', payload: feedInfo });

          changeSearchingStatus('processing');
        }
        break;
      default: {
        console.log('requeset not working');
        resetHanler();
      }
    }
  };

  const subscribeFeed = async () => {
    // debugger;
    if (feedExist) {
      onClose && onClose();
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    const { data, status } = await axios('/api/feed/subscribe', {
      method: 'POST',
      data: {
        feedInfo: omit(feedInfo, ['items']),
      },
    });

    const feedInfoWithItems = {
      ...feedInfo,
      ...data.feedInfo,
    };

    setIsProcessing(false);

    console.log(feedInfoWithItems, ' feedInfoWithItems');
    if (status === 200) {
      storeItemsIntoDB(feedInfoWithItems);

      resetHanler();

      onSubscribe && onSubscribe(feedInfoWithItems);

      onClose && onClose();
    }
  };

  const resetHanler = () => {
    changeFeedExist(false);
    changeFeedUrl('');
    changeSearchingStatus('ldle');
  };

  useEffect(() => {
    console.log(feedInfo);
  }, [feedInfo]);
  return (
    <motion.div
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 w-full h-full flex items-center justify-center"
      id="popup-modal"
      tabIndex={-1}
      initial={{
        backgroundColor: 'rgb(148 163 184 / 0)',
        visibility: 'hidden',
      }}
      transition={{ duration: 0.5 }}
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: {
          backgroundColor: '#94a3b8cc',
          visibility: 'visible',
        },
        closed: {
          backgroundColor: '#94a3b800',
          visibility: 'hidden',
        },
      }}
      onClick={(evt: any) => {
        if (evt.target.id === 'popup-modal') {
          resetHanler();
          onClose && onClose();
        }
      }}
    >
      <form
        className="basis-5/12 relative"
        onSubmit={(evt: any) => {
          evt.preventDefault();
          if (feedExist) {
            return;
          }
          changeSearchingStatus('searching');
          fetchFeed();
        }}
      >
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
        >
          Here To Paste Feed
        </label>
        <div className="relative">
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
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Paste Your Feed Url Here"
            value={feedURL}
            onInput={(e: any) => {
              changeFeedUrl(e.target.value);
              if (e.target.value.length === 0) {
                changeSearchingStatus('ldle');
                return;
              }
              if (searchingStatus !== 'ldle') {
                changeSearchingStatus('ldle');
              }
            }}
          />

          {searchingStatus === 'ldle' && (
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              There You Go
            </motion.button>
          )}
          {searchingStatus === 'searching' && <Spin />}
        </div>
        {searchingStatus === 'processing' && feedInfo && (
          <div className="w-full absolute left-0 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <div
              onClick={() => {
                subscribeFeed();
              }}
              className="flex items-center py-2 px-4 w-full rounded-b-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <motion.img
                className="mr-3 rounded-md"
                width={30}
                src={feedInfo?.image as string}
              ></motion.img>
              {feedInfo.title}

              {feedExist && (
                <div className="flex items-center ml-auto text-amber-300 font-extrabold">
                  Already Exist
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export { FeedInput };
