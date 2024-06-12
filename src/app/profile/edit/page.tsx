import React from 'react';
import { AuthOption } from '@/app/auth/authOption';
import { getServerSession } from 'next-auth';
import Form from './Form';
type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: number;
};

async function page() {
  const session = await getServerSession<Object>(AuthOption);

  if (!session) return <div>User not found</div>;

  return <div>{session?.user && <Form user={session?.user as User} />}</div>;
}

export default page;
