import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { FC, useEffect, useState } from "react";
import { getFeed } from "utils";
import { FeedType } from "types/feed";
import { motion } from "framer-motion";
import { Spin } from "./spin";
import axios from "axios";

interface NextPageProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// const FeedInput: FC<NextPageProps> = ({ feed }) => {
const FeedInput: FC<NextPageProps> = ({ isOpen, onClose }) => {
  const [feedURL, changeFeedUrl] = useState<string>("");
  const [feedInfo, changeFeedInfo] = useState<FeedType>(null!);
  const [searchingStatus, changeSearchingStatus] = useState<
    "ldle" | "searching" | "processing"
  >("ldle");

  const checkIfFeedIsExist = async () => {
    // console.log("checkIfFeedIsExist");
  };

  const fetchFeed = async () => {
    const { data, status } = await axios("/api/feeds", {
      method: "POST",
      data: {
        url: feedURL,
      },
    });

    if (status !== 200) {
      console.log("requeset not working");
      changeSearchingStatus("ldle");
      return;
    }
    // try {
    //   {data, status} = await axios("/api/feeds", {
    //     method: "POST",
    //     data: {
    //       url: feedURL,
    //     },
    //   });
    // } catch (err: any) {
    //   console.log(err.response.status);
    //   changeSearchingStatus("ldle");
    // }

    checkIfFeedIsExist();

    changeSearchingStatus("processing");

    changeFeedInfo(data.feedInfo as FeedType);
    console.log(data.feedInfo);
  };

  useEffect(() => {}, [feedURL]);
  return (
    <motion.div
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 w-full h-full flex items-center justify-center"
      id="popup-modal"
      tabIndex={-1}
      initial={{
        backgroundColor: "rgb(148 163 184 / 0)",
        visibility: "hidden",
      }}
      transition={{ duration: 0.5 }}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: {
          backgroundColor: "#94a3b847",
          visibility: "visible",
        },
        closed: {
          backgroundColor: "#94a3b800",
          visibility: "hidden",
        },
      }}
      onClick={(evt: any) => {
        console.log(evt.target.parentElement.id);
        if (evt.target.id === "popup-modal") {
          onClose && onClose();
        }
      }}
    >
      <form
        className="basis-5/12 relative"
        onSubmit={(evt: any) => {
          evt.preventDefault();

          changeSearchingStatus("searching");
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
                changeSearchingStatus("ldle");
                return;
              }
              if (searchingStatus !== "ldle") {
                changeSearchingStatus("ldle");
              }
            }}
          />

          {searchingStatus === "ldle" && (
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              There You Go
            </motion.button>
          )}
          {searchingStatus === "searching" && <Spin />}
        </div>
        {searchingStatus === "processing" && feedInfo && (
          <div className="w-full absolute left-0 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {/* <a
                href="#"
                aria-current="true"
                className="block py-2 px-4 w-full text-white bg-blue-700 rounded-t-lg border-b border-gray-200 cursor-pointer dark:bg-gray-800 dark:border-gray-600"
              >
                {Profile}
              </a> */}

            <div className="flex items-center py-2 px-4 w-full rounded-b-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              <motion.img
                className="mr-3 rounded-md"
                width={30}
                src={feedInfo?.itunes?.image}
              ></motion.img>
              {feedInfo.title}
            </div>
          </div>
        )}
        {/* https://www.ximalaya.com/album/3558668.xml */}
      </form>

      {/* <footer className={styles.footer}></footer> */}
    </motion.div>
  );
};

export default FeedInput;
