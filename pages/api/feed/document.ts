// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { encode } from 'utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feed: FeedType }>,
): Promise<void> {
  console.log(encode(req.body.data), 'req.body.url');
  const feed = (await sanityClient.getDocument(
    encode(req.body.data),
  )) as FeedType;

  console.log(feed);
  res.status(200).json({ feed });
}
