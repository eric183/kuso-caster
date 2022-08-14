import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SubscribeContext } from 'context/subscribe';
import { useEffect, useReducer, useState } from 'react';
import { subscribeReducer } from 'reducers/subscribeReducer';
import { ChakraProvider, Progress } from '@chakra-ui/react';
import { AudioPlayerProvider } from '~/components/audioPlayerProvider';
import { SessionProvider } from 'next-auth/react';
import { useloadingStore } from 'context/useLoading';

function KusoCasterMain({ Component, pageProps }: AppProps) {
  // const loading = useloadingStore.getState().loading;
  // const loading = useloadingStore((state) => state.loading);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedInfo, dispatch] = useReducer(subscribeReducer, null!);

  // console.log(useloadingStore.getState().loading, 'loading');
  useEffect(() => {
    useloadingStore.subscribe((data) => setLoading(data.loading));
  }, []);

  // console.log(loading)
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
            <>
              <Component {...pageProps} />

              {/* {loading && (
                <div className="fixed top-0 left-0 w-full h-10">
                  <Progress size="xs" isIndeterminate />
                </div>
              )} */}
            </>
          </AudioPlayerProvider>
        </SubscribeContext.Provider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default KusoCasterMain;
