import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '../../../../prisma/client';
export const POST = async (request: Request) => {
  const body = await request.json();
  const { email, password, name } = body;

  const checkUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (checkUser) return NextResponse.json({ message: 'User already exists' });

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: 'success', user });
};
