import GoogleProvider from 'next-auth/providers/google';
import Provider from '@/providers/provider';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { pages } from 'next/dist/build/templates/app-page';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
const prisma = new PrismaClient();

export const AuthOption = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // const data = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (user && user.password !== null && user.password !== undefined) {
          // Any object returned will be saved in `user` property of the JWT

          const isValid = await compare(credentials?.password, user.password);

          if (isValid) {
            return user;
          }
          return null;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),

    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role; // Make sure your user model has a role field
      }
      return token;
    },
    async session({ session, token }) {
      // Add token values to session
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },

  async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    // Redirect to the homepage or any other page after sign-in
    return baseUrl; // Always return the base URL
  },
};
