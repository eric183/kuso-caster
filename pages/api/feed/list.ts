// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import { getSessionUser } from 'utils/getSessionUser';

const feedRoq = groq`*[_type == "feed"]{
    title,
    feedUrl,
    image,
    _id
  }`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  const user = await getSessionUser(req);

  // console.log(req, 'list');
  if (!user) {
    res.status(200).send({ error: 'failed to load data' });
    return;
  }

  if (!user.feedIds) {
    res.status(200).json({ feedList: [] });
    return;
  }

  const feedList = await sanityClient.getDocuments(user.feedIds);

  res.status(200).json({ feedList });
}
