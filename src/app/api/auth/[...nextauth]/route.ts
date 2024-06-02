import NextAuth from 'next-auth';
import { AuthOption } from '@/app/auth/authOption';
const handler = NextAuth(AuthOption);

export { handler as GET, handler as POST };
