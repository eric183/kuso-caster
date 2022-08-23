import { NextPage } from 'next';
import { useRef, useState } from 'react';
import { FeedType } from 'types/feed';
import { FeedInput } from '~/components/feedInput';
import { ContentType, FeedContent } from '~/components/feedContent';
import { FeedNav } from '~/components/feedNav';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

interface NextPageProps {
  feed: FeedType;
}

const HomeLayout = styled.div`
  background-color: #f4f4f4;
`;

const Home: NextPage<NextPageProps> = () => {
  const feedRef = useRef<ContentType>(null);
  const router = useRouter();
  const { status } = useSession();

  const [isOpen, setOpen] = useState<boolean>(false);
  const [subscribeFeed, changeSubscribeFeed] = useState<FeedType>(null!);

  const getRSSDocument = (feedInfo: FeedType) => {
    feedRef.current?.getRSSDocument(feedInfo);
  };

  if (status === 'unauthenticated') {
    router.replace('/');
  }

  return (
    <HomeLayout className="h-screen w-screen grid grid-cols-10 gap-10 overflow-hidden">
      <FeedInput
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSubscribe={(data) => {
          console.log(data, 'subscribe');
          changeSubscribeFeed(data);
        }}
      />

      <FeedNav
        feed={subscribeFeed}
        getRSSDocument={getRSSDocument}
        setContentloading={feedRef.current?.setLoading}
      />
      <FeedContent ref={feedRef} />
    </HomeLayout>
  );
};

export default Home;
