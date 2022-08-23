// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedType, Item } from 'types/feed';
import { createRedis } from 'utils/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const client = await createRedis();
  const feedItems = (await client.get(
    req.query?._id as string,
  )) as unknown as Item[];

  res.status(200).json({ feedItems, status: 200 });
}
