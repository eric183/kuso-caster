import { motion } from "framer-motion";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { FeedType } from "types/feed";
import { FeedContent } from "~/components/feedContent";
import FeedInput from "~/components/feedInput";
import { FeedList } from "~/components/feedList";

interface NextPageProps {
  feed: FeedType;
}

const Home: NextPage<NextPageProps> = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className="bg-gray-700 h-screen w-screen flex items-center justify-center flex-col">
      <FeedInput isOpen={isOpen} onClose={() => setOpen(false)} />
      <header
        className="w-full py-4 flex items-center justify-end border-b-2 border-gray-600"
        onClick={() => setOpen(true)}
      >
        <motion.img
          src="https://avatars.githubusercontent.com/u/10773980?s=40&v=4"
          className="w-8 h-8 rounded-full bg-slate-100 ring-2 ring-white mr-8"
        ></motion.img>
      </header>

      <main className="flex-1 w-full grid grid-cols-6">
        <FeedList />
        <FeedContent />
      </main>
    </div>
  );
};

export default Home;
