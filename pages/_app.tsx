import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SubscribeContext } from 'context/subscribe';
import { useEffect, useReducer, useState } from 'react';
import { subscribeReducer } from 'reducers/subscribeReducer';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { useloadingStore } from 'context/useLoading';

function KusoCasterMain({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [feedInfo, dispatch] = useReducer(subscribeReducer, null!);

  useEffect(() => {
    useloadingStore.subscribe((data) => setLoading(data.loading));
  }, []);

  return (
    <SessionProvider>
      <ChakraProvider>
        <SubscribeContext.Provider
          value={{
            feedInfo,
            subscribeDispatch: dispatch,
          }}
        >
          <Component {...pageProps} />
        </SubscribeContext.Provider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default KusoCasterMain;
