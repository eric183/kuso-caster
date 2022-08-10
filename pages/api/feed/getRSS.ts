import type { NextApiRequest, NextApiResponse } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { encode, getFeed } from 'utils';

const feedRoq = groq`*[_type == "feed" && link == $link]{
  link,
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { feedInfo: FeedType } | { message: string; exist: boolean }
  >,
) {
  const ifFeedExsit =
    (
      await sanityClient.fetch(feedRoq, {
        link: req.body.url,
      })
    ).length > 0;
  const feedInfo = (await getFeed(req.body.url)) as unknown as FeedType;

  console.log(ifFeedExsit, 'ifFeedExsit');

  if (ifFeedExsit) {
    res
      .status(200)
      .json({ message: 'feed already exist', exist: true, feedInfo });
  }

  res.status(200).json({ feedInfo });
}
