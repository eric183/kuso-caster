import React from 'react';
import { SubscribeAction } from 'reducers/subscribeReducer';
import { FeedType } from 'types/feed';

export const SubscribeContext = React.createContext<{
  feedInfo: FeedType;
  subscribeDispatch: (action: SubscribeAction) => void;
}>(null!);
