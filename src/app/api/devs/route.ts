import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { revalidateTag } from 'next/cache';
export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  revalidateTag('devs');

  return NextResponse.json({ users });
}
