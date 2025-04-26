import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';
import { revalidateTag } from 'next/cache';
export const GET = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: params.id,
      },
    });
    revalidateTag('notifications' + params.id);
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json(error)
  }
};
