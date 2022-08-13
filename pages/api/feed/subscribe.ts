import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { getSessionUser } from 'utils/getSessionUser';
import { storeItemsIntoDB } from 'utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feedInfo: FeedType }>,
) {
  const user = await getSessionUser(req);

  const { feedInfo } = req.body as { feedInfo: FeedType };

  const resFeed = (await sanityClient.create({
    _type: 'feed',
    ...feedInfo,
    image: feedInfo.itunes.image,
    itunes: JSON.stringify(feedInfo.itunes),
  })) as unknown as FeedType;

  // console.log(resFeed, 'resFeed');

  await sanityClient
    .patch(user._id)
    .setIfMissing({ feedIds: [] })
    .append('feedIds', [resFeed._id])
    .commit();

  res.status(200).json({ feedInfo: resFeed });
}
