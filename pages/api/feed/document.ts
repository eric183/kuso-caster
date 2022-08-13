// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feed: FeedType }>,
): Promise<void> {
  // const feed = (await sanityClient
  //   .getDocument
  //   // encode(req.body.data),
  //   ()) as FeedType;

  // console.log(feed);
  const feed = {} as FeedType;
  res.status(200).json({ feed });
}
