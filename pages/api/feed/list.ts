// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';

const feedRoq = groq`*[_type == "feed"]{
    title,
    feedUrl,
    image,
    _id
  }`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feedList: FeedType[] }>,
): Promise<void> {
  const feedList = await sanityClient.fetch(feedRoq);

  res.status(200).json({ feedList });
}
