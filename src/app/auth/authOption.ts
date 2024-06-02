import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const AuthOption = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
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
};
