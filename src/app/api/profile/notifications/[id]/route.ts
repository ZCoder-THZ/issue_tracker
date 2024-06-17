import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';
import { revalidateTag } from 'next/cache';
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: params.id,
      },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
};
