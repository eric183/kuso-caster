import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { getSessionUser } from 'utils/getSessionUser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feedInfo: FeedType }>,
) {
  const { feedInfo } = req.body as { feedInfo: FeedType };

  // console.log(feedInfo, 'feedInfo');
  // const feed = (
  //   await sanityClient.fetch(
  //     `*[_type == 'feed' && feedUrl == "$feedURL"]{ _id }`,
  //     { feedURL: feedInfo.feedUrl },
  //   )
  // )[0];
  const resFeed = (await sanityClient
    .patch(feedInfo._id!)
    .set({
      _id: encode(feedInfo),
    })
    .commit()) as FeedType;
  console.log(feedInfo._id, 'before');
  console.log(resFeed._id, 'after');

  res.status(200).json({ feedInfo: resFeed });
}
