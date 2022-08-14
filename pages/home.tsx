import { motion } from 'framer-motion';
import { NextPage } from 'next';
import { useRef, useState } from 'react';
import { FeedType } from 'types/feed';
import { FeedInput } from '~/components/feedInput';
import { ContentType, FeedContent } from '~/components/feedContent';
import { FeedNav } from '~/components/feedNav';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface NextPageProps {
  feed: FeedType;
}

const Home: NextPage<NextPageProps> = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const feedRef = useRef<ContentType>(null);

  const [subscribeFeed, changeSubscribeFeed] = useState<FeedType>(null!);
  const { data, status } = useSession();
  const router = useRouter();

  const getRSSDocument = (feedInfo: FeedType) => {
    feedRef.current?.getRSSDocument(feedInfo);
  };

  if (status === 'unauthenticated') {
    router.replace('/');
  }

  return (
    <div className="bg-gray-700 h-screen w-screen flex items-center justify-center flex-col">
      <FeedInput
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSubscribe={(data) => {
          console.log(data, 'subscribe');
          changeSubscribeFeed(data);
        }}
      />
      <header
        className="w-full py-4 flex items-center justify-end border-b-2 border-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
      >
        <motion.img
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            signOut();
          }}
          src="https://avatars.githubusercontent.com/u/10773980?s=40&v=4"
          className="w-8 h-8 rounded-full bg-slate-100 ring-2 ring-white mr-8"
        ></motion.img>
      </header>

      <main className="flex-1 w-full grid grid-cols-10 gap-10 overflow-hidden">
        <FeedNav getRSSDocument={getRSSDocument} feed={subscribeFeed} />
        <FeedContent ref={feedRef} />
      </main>
    </div>
  );
};

export default Home;
