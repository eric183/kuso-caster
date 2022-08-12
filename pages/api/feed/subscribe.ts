import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { encode } from 'utils';
import { getSessionUser } from 'utils/getSessionUser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feedInfo: FeedType }>,
) {
  const user = await getSessionUser(req);

  const { feedInfo } = req.body as { feedInfo: FeedType };

  const resFeed = await sanityClient.createIfNotExists({
    _id: encode(feedInfo.feedUrl),
    _type: 'feed',
    ...feedInfo,
    image: feedInfo.itunes.image,
    itunes: JSON.stringify(feedInfo.itunes),
  });

  await sanityClient
    .patch(user._id)
    .setIfMissing({ feedIds: [] })
    .append('feedIds', [resFeed._id])
    .commit();

  res.status(200).json({ feedInfo });
}
