import styled from '@emotion/styled';
import { usePlayerStore } from 'context/player';
import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import { ForwardRefComponent } from 'framer-motion';

const RssPlayerLayout = styled.div`
  left: 0;
  height: 50px;
`;

export const AudioPlayerProvider: FC<{}> = ({}) => {
  const [audioRender, setAudioRender] = useState<boolean>(false);
  const url = usePlayerStore((state) => state.url);
  useEffect(() => {
    if (url) {
      setAudioRender(true);
    }
  }, [url]);

  return (
    <RssPlayerLayout className="rss-player absolute bottom-0 w-full flex items-center justify-center z-40">
      {audioRender && <AudioPlayer url={url} />}
    </RssPlayerLayout>
  );
};

const AudioPlayer = forwardRef<any, any>(({ url }, ref) => {
  const setStatus = usePlayerStore((state) => state.setStatus);
  const setCaching = usePlayerStore((state) => state.setCaching);
  const setCurrentTime = usePlayerStore((state) => state.setCurrentTime);
  const setVolume = usePlayerStore((state) => state.setVolume);

  const caching = usePlayerStore((state) => state.caching);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const volume = usePlayerStore((state) => state.volume);

  const audioRef = useRef<HTMLAudioElement>(null!);

  const recordCurrentTime = () => {
    clearInterval(recordCurrentTime as unknown as number);

    return setInterval(() => {
      setCurrentTime(audioRef.current.currentTime);
      setVolume(audioRef.current.volume);
      setStatus(audioRef.current.paused ? 'paused' : 'playing');
    }, 1000);
  };

  const clearHistroy = () => {
    setCaching(false);
    setCurrentTime(audioRef.current.currentTime);
    setStatus('stopped');
  };

  const accessAudio = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  };

  useImperativeHandle(ref, () => ({
    // seekTo(currentTime: number) {
    //   audioRef.current.currentTime = 0;
    // },
  }));

  useEffect(() => {
    if (url && caching) {
      audioRef.current.currentTime = currentTime;
      audioRef.current.volume = volume;
    }
  }, [caching, url]);

  useEffect(() => {
    accessAudio();
  }, []);
  return (
    <audio
      ref={audioRef}
      controls
      src={url}
      className="w-full"
      onPause={() => {
        setStatus('paused');
      }}
      autoPlay
      onEnded={() => {
        clearHistroy();
      }}
      onPlaying={(e: any) => {
        setStatus('playing');
        setCaching(true);
        recordCurrentTime();
      }}
    />
  );
});

AudioPlayer.displayName = 'AudioPlayer';
