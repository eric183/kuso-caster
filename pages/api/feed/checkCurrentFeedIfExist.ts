import type { NextApiRequest, NextApiResponse } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import Cors from 'cors';

const feedRoq = groq`*[_type == "feed" && feedUrl == $feedUrl]{
  copyright,
  description,
  feedUrl,
  generator,
  image,
  itunes,
  language,
  lastBuildDate,
  link,
  paginationLinks,
  title
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ isFeedExsit: boolean; feedInfo: FeedType }>,
) {
  const params = {
    feedUrl: req.body.url,
  };

  const feeds = await sanityClient.fetch(feedRoq, params);

  res.status(200).json({ isFeedExsit: feeds.length > 0, feedInfo: feeds[0] });
}

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
