import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { getFeed } from 'utils';
import { FeedType } from 'types/feed';
import { motion } from 'framer-motion';
import { FeedInput } from '~/components/feedInput';
import { useRouter } from 'next/router';
import {
  getCsrfToken,
  getProviders,
  signIn,
  signOut,
  useSession,
} from 'next-auth/react';
import SignComponent from '~/components/sign';
import { Button, Spinner } from '@chakra-ui/react';
import styled from '@emotion/styled';

interface Credentials {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

interface NextPageProps {
  feed: FeedType;
  providers: {
    credentials: Credentials;
  };
  [key: string]: any;
}

const DescLayout = styled.div`
  background-color: #ffe8db;
  width: 28rem;
  color: #df856a;
  font-size: 24px;
  padding: 2.65625rem 2.34375rem;
  section:nth-of-type(1) {
    width: 45px;
    height: 45px;

    border-radius: 4px;
    background-color: #fea675;
  }

  section:nth-of-type(2) {
    margin: 2.5rem 0;
  }

  section:nth-of-type(3) {
    width: 364px;
    height: 408px;
    left: 31px;
    top: 206px;

    background: #ffd3ba;
    border-radius: 4px;
  }

  section:nth-of-type(4) {
    position: absolute;
    bottom: 2.34375rem;
    font-size: 12px;
  }
`;

const Index: NextPage<NextPageProps> = ({ feed, providers, csrfToken }) => {
  const [feedURL, changeFeedUrl] = useState<string>('');
  const { data, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const fetchFeed = async () => {
    const feedData = await getFeed(feedURL);
  };

  const signInHandler = () => {
    // signIn('email', {
    //   email,
    //   redirect: false,
    // });
  };

  useEffect(() => {
    console.log(feed);
  }, [feed]);

  useEffect(() => {
    // router.replace('/home');
    // console.log(sessionInfo);
    // if (!data) {
    //   signIn();
    //   // router.replace('/auth/signin');
    // }
    if (data) {
      // router.replace('/home');
      signIn();
    }
  }, []);

  console.log(data, status);

  if (status === 'authenticated') {
    router.replace('/home');
  }

  return (
    <div className="index-page relative w-screen h-screen z-50">
      <Head>
        <title>kuso feed</title>
        <meta name="description" content="generate feed by yourself" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {status === 'authenticated' && (
        <div className="fixed z-50 left-0 top-0 w-full h-full bg-black/50 flex items-center justify-center">
          <Spinner color="red.500" />
        </div>
      )}
      <main className="w-screen h-screen  flex items-center justify-between mx-auto">
        <DescLayout className="h-full relative">
          <section></section>
          <section>
            <p>Halo!</p>
            <p>To free rss feeding.</p>
          </section>
          <section>
            <motion.img src="/login.jpg" />
          </section>
          <section>
            <a
            // className="cursor-pointer"
            // target="__blank"
            // href="https://baidu.com"
            >
              Design by Sunday Song
            </a>
          </section>
        </DescLayout>

        {status === 'unauthenticated' && (
          <SignComponent providers={providers} csrfToken={csrfToken} />
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
};

export default Index;
