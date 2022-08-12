import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { groq } from 'next-sanity';
import { sanityClient } from 'sanity';
const userReq = groq`*[_type == "user" && email == $email]`;

export const getSessionUser = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  const user = (
    await sanityClient.fetch(userReq, {
      email: session?.user?.email,
    })
  )[0];

  return user;
};
