import { FeedType } from 'types/feed';

export type SubscribeAction = {
  type: string;
  payload: FeedType;
};

export interface SubscribeReducerType {
  feedInfo: FeedType;
  subscribeDispatch: (action: SubscribeAction) => void;
}

const subscribeReducer: React.Reducer<FeedType, SubscribeAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'MUTATION':
      return action.payload;

    default:
      return { ...state, payload: action.payload };
  }
};

export { subscribeReducer };
