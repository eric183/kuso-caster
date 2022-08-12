import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SubscribeContext } from 'context/subscribe';
import { useReducer } from 'react';
import { subscribeReducer } from 'reducers/subscribeReducer';
import { ChakraProvider } from '@chakra-ui/react';
import { AudioPlayerProvider } from '~/components/audioPlayerProvider';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
  const [feedInfo, dispatch] = useReducer(subscribeReducer, null!);

  return (
    <SessionProvider>
      <ChakraProvider>
        <SubscribeContext.Provider
          value={{
            feedInfo,
            subscribeDispatch: dispatch,
          }}
        >
          <AudioPlayerProvider>
            <Component {...pageProps} />
          </AudioPlayerProvider>
        </SubscribeContext.Provider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
{
  /* <Head>
<title>kuso feed</title>
<meta name="description" content="generate feed by yourself" />
<link rel="icon" href="/favicon.ico" />
</Head> */
}
