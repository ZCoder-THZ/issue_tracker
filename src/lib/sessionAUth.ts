import { getServerSession } from 'next-auth';
import { AuthOption } from '@/app/auth/authOption';
export const sessionAuth = async () => {
  const session = await getServerSession<Object>(AuthOption);
  return session;
};
