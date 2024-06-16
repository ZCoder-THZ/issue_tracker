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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      throw new Error('Missing id or role in request body');
    }

    const roleChange = await prisma.user.update({
      where: {
        id: String(id),
      },
      data: {
        role: Number(role),
      },
    });

    return NextResponse.json(roleChange);
  } catch (error) {
    console.error(error);
    return NextResponse.status(400).json({ error: error.message });
  }
}
