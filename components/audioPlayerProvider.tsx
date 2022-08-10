import styled from '@emotion/styled';
import { FC } from 'react';

const RssPlayerLayout = styled.div`
  left: 0;
`;

export const AudioPlayerProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="fixed w-screen h-screen left-0 top-0">
      {children}
      <RssPlayerLayout className="rss-player absolute left-0 bottom-0 bg-white w-full py-4">
        player
      </RssPlayerLayout>
    </div>
  );
};
