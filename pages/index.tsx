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
    <div className="index-page bg-gray-700 relative w-screen h-screen z-50">
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
      <main className="container mx-auto h-screen flex items-center justify-center">
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
