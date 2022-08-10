import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFeed } from "utils";
import { FeedType } from "types/feed";
import { motion } from "framer-motion";
import { FeedInput } from "~/components/feedInput";

interface NextPageProps {
  feed: FeedType;
}

const Home: NextPage<NextPageProps> = ({ feed }) => {
  const [feedURL, changeFeedUrl] = useState<string>("");

  const checkIfFeedIsExist = async () => {};

  const fetchFeed = async () => {
    const feedData = await getFeed(feedURL);

    checkIfFeedIsExist();
  };

  useEffect(() => {
    console.log(feed);
  }, [feed]);

  return (
    <div className="bg-gray-700">
      <Head>
        <title>kuso feed</title>
        <meta name="description" content="generate feed by yourself" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto h-screen flex items-center justify-center">
        <form
          className="basis-5/12"
          onSubmit={() => {
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
              type="search"
              id="search"
              className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Paste Your Feed Url Here"
              required
              value={feedURL}
              onInput={(e: any) => {
                changeFeedUrl(e.target.value);
              }}
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              There You Go
            </motion.button>
          </div>
        </form>
      </main>
      {/* <footer className={styles.footer}></footer> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const feed = await getFeed("http://rss.lizhi.fm/rss/74131208.xml");

  return {
    props: {
      feed,
    },
  };
};

export default Home;
