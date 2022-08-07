// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FeedType } from "types/feed";
import { getFeed } from "utils";

// interface FeedInfo {

// }
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ feedInfo: FeedType }>
) {
  console.log(req.body);

  const feedInfo = (await getFeed(req.body.url)) as unknown as FeedType;

  // http://rss.lizhi.fm/rss/21628.xml
  res.status(200).json({ feedInfo });
}
