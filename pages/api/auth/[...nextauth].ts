import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { randomUUID } from 'crypto';
import { sanityClient } from 'sanity';
import { groq } from 'next-sanity';
import { encode } from 'utils';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { expireTime } from 'utils/expireTime';
import { getSessionUser } from 'utils/getSessionUser';
import { NextApiRequest } from 'next';

const query = groq`*[_type == "user" && email == $email]`;

export default NextAuth({
  // adapter: PrismaAdapter(prismaClient),
  secret: 'supersecret',
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // let userInfo = await getSessionUser(req as NextApiRequest);

        // const cookie = req!.headers!.cookie as string;
        // let sessionToken = /next-auth\.session-token=(.+);?/.exec(cookie) as
        //   | string[]
        //   | string;
        // sessionToken = sessionToken ? sessionToken[1] : '';

        console.log(credentials, 'credentials');
        // console.log(cookie, 'sessionToken');
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        let userInfo = (
          await sanityClient.fetch(`*[_type == "user" && email == $email]`, {
            email,
          })
        )[0];

        // console.log(userInfo, 'userInfo');
        if (!userInfo) {
          userInfo = await sanityClient.create({
            _type: 'user',
            email,
            name: email,
            // session: {
            //   // sessionToken: sessionToken,
            //   expiresAt: expireTime(),
            // },
          });
        } else {
          userInfo = sanityClient
            .patch(userInfo._id)
            .set({
              role: 'user',
              // session: {
              //   // sessionToken: sessionToken,
              //   expiresAt: expireTime(),
              // },
            })
            .commit();
        }

        return userInfo;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    // maxAge: 60,
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log(token, 'jwt.token');
      // console.log(user, 'jwt.user');
      // console.log(account, 'jwt.account');
      // console.log(profile, 'jwt.profile');
      // console.log(isNewUser, 'jwt.isNewUser');

      // if (account) {
      //   token.accessToken = account.access_token;

      //   // if (token.accessToken) {
      //   //   console.log(token, '........++');
      //   //   sanityClient
      //   //     .patch(userInfo._id)
      //   //     .set({
      //   //       role: 'user',
      //   //       session: {
      //   //         sessionToken: sessionToken,
      //   //         expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      //   //       },
      //   //     })
      //   //     .commit();
      //   // }
      // }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;

      // console.log(user, 'session.user');
      // console.log(session, 'session.session');
      // console.log(token, 'session.token');
      return session;
    },
  },
  pages: {
    // signIn: '/auth/signin',
    signIn: '/',
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
});
