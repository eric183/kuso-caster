import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sanityClient } from 'sanity';
import { groq } from 'next-sanity';
const query = groq`*[_type == "user" && email == $email]`;

const initFeedIDs = [
  '53TuM276zQmYEcFTpj6dbo',
  '53TuM276zQmYEcFTpj7wQg',
  'H8yYePJlyQjGMAjuIw7Cwd',
  'H8yYePJlyQjGMAjuIwKpAp',
  'H8yYePJlyQjGMAjuIwLXeV',
  'H8yYePJlyQjGMAjuIwMKIV',
  'H8yYePJlyQjGMAjuIwSwI7',
  'H8yYePJlyQjGMAjuIwT1eF',
  'cH1gzwqkAc2SIQ4KxuAcJN',
  'cH1gzwqkAc2SIQ4KxubFaj',
  'cH1gzwqkAc2SIQ4KxubYQJ',
  'cH1gzwqkAc2SIQ4KxugL40',
  'cH1gzwqkAc2SIQ4KxujY3k',
  'cH1gzwqkAc2SIQ4KxukbNV',
  'cH1gzwqkAc2SIQ4Kxulch9',
];

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
        // console.log(credentials, 'credentials');
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        let userInfo = (
          await sanityClient.fetch(`*[_type == "user" && email == $email]`, {
            email,
          })
        )[0];

        // console.log(req);
        if (!userInfo) {
          userInfo = await sanityClient.create({
            _type: 'user',
            email,
            name: email,
            password,
            feedIds: initFeedIDs,
            // session: {
            //   // sessionToken: sessionToken,
            //   expiresAt: expireTime(),
            // },
          });
        } else {
          if (userInfo.password !== password) {
            return {
              error: 'Password is incorrect',
            };
          }

          userInfo = sanityClient
            .patch(userInfo._id)
            .set({
              role: 'user',
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
    async signIn({ user, credentials }) {
      if (user.error) {
        return credentials?.callbackUrl + '?error=' + user.error;
      }
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});
