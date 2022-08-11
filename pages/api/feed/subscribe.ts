import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { encode } from 'utils';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feedInfo: FeedType }>,
) {
  const { feedInfo }: { feedInfo: FeedType } = req.body;

  const resFeed = await sanityClient.createIfNotExists({
    _id: encode(feedInfo.link),
    _type: 'feed',
    ...feedInfo,
    image: feedInfo.itunes.image,
    itunes: JSON.stringify(feedInfo.itunes),
  });

  res.status(200).json({ feedInfo });
}
