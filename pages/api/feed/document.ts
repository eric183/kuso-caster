// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedType } from 'types/feed';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feed: FeedType }>,
): Promise<void> {
  const feed = {} as FeedType;
  res.status(200).json({ feed });
}
