import type { NextApiRequest, NextApiResponse } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from 'sanity';
import { FeedType } from 'types/feed';
import Cors from 'cors';
import { getSessionUser } from 'utils/getSessionUser';

const feedRoq = groq`*[_type == "feed" && feedUrl == $feedUrl]{
  _id,
  copyright,
  description,
  feedUrl,
  generator,
  image,
  itunes,
  language,
  lastBuildDate,
  link,
  paginationLinks,
  title
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ isFeedExsit: boolean; feedInfo: FeedType }>,
) {
  const user = await getSessionUser(req);

  const params = {
    feedUrl: req.body.url,
  };

  const feeds = await sanityClient.fetch(feedRoq, params);

  const isFeedExsit = feeds.length > 0;

  // console.log(isFeedExsit, 'isFeedExsit');
  // console.log(user.feedIds, 'user.feedIds');
  // console.log(feeds[0], 'feeds[0]');

  console.log(feeds);

  if ((isFeedExsit && !user.feedIds) || !user.feedIds.includes(feeds[0]._id)) {
    await sanityClient
      .patch(user._id)
      .setIfMissing({ feedIds: [] })
      .append('feedIds', [feeds[0]._id])
      .commit();
  }

  res.status(200).json({ isFeedExsit, feedInfo: feeds[0] });
}

// const cors = Cors({
//   methods: ['POST', 'HEAD'],
// });

// function runMiddleware(
//   req: any,
//   res: any,
//   fn: (arg0: any, arg1: any, arg2: (result: any) => void) => void,
// ) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: unknown) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }

//       return resolve(result);
//     });
//   });
// }
