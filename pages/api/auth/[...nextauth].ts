import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { randomUUID } from 'crypto';
import { sanityClient } from 'sanity';
import { groq } from 'next-sanity';
import { encode } from 'utils';

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
        const cookie = req!.headers!.cookie as string;
        let sessionToken = /next-auth\.session-token=(.+);?/.exec(cookie) as
          | string[]
          | string;
        sessionToken = sessionToken ? sessionToken[1] : '';

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        let userInfo = (await sanityClient.fetch(query, { email }))[0];

        console.log(userInfo, 'userInfo');
        if (!userInfo) {
          userInfo = await sanityClient.create({
            _type: 'user',
            email,
            name: email,
            session: {
              sessionToken: sessionToken,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
          });
        } else {
          userInfo = sanityClient
            .patch(userInfo._id)
            .set({
              role: 'user',
              session: {
                sessionToken: sessionToken,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
              },
            })
            .commit();
        }

        return userInfo;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;

        // if (token.accessToken) {
        //   console.log(token, '........++');
        //   await prismaClient.user.update({
        //     where: {
        //       id: user?.id,
        //     },
        //     data: {
        //       sessions: {
        //         connectOrCreate: {
        //           where: {
        //             userId: user?.id,
        //           },
        //           create: {
        //             sessionToken: token.accessToken as string,
        //             expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        //           },
        //         },
        //       },
        //     },
        //   });
        // }
      }

      return token;
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
