import type { NextApiRequest, NextApiResponse } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { encode, getFeed } from 'utils';

import Cors from 'cors';

const feedRoq = groq`*[_type == "feed" && link == $link]{
  link,
}`;

const cors = Cors({
  methods: ['POST', 'HEAD'],
});

function runMiddleware(
  req: any,
  res: any,
  fn: (arg0: any, arg1: any, arg2: (result: any) => void) => void,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export const config = {
  api: {
    // bodyParser: {
    //   sizeLimit: false,
    // },
    responseLimit: false,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { feedInfo: FeedType } | { message: string; exist: boolean }
  >,
) {
  console.log('begin to check feed from sanity');
  const ifFeedExsit =
    (
      await sanityClient.fetch(feedRoq, {
        link: req.body.url,
      })
    ).length > 0;
  const feedInfo = (await getFeed(req.body.url)) as unknown as FeedType;

  console.log(ifFeedExsit, 'this feed is exsit');
  console.log(feedInfo);
  if (ifFeedExsit) {
    res
      .status(200)
      .json({ message: 'feed already exist', exist: true, feedInfo });
  }

  res.status(200).json({ feedInfo });
}
