import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { patchIssueSchema } from '@/app/validationSchemas';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const issue = await prisma.issue.delete({
      where: {
        id: Number(params.id),
      },
    });

    return NextResponse.json({ issue });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const issue = await prisma.issue.findFirst({
      where: {
        id: Number(params.id),
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const body = await request.json();
    console.log('Request Body:', body); // Add debug log for request body

    const validation = patchIssueSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { user_id, title, description, status, priority } = body;

    if (user_id) {
      const user = await prisma.user.findUnique({
        where: { id: user_id },
      });
      if (!user) {
        return NextResponse.json({ error: 'Invalid user.' }, { status: 400 });
      }
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issue.id },
      data: {
        title,
        description,
        assignedToUserId: user_id,
        status,
        priority,
      },
    });

    console.log('Updated Issue:', updatedIssue); // Add debug log for updated issue

    return NextResponse.json({ updatedIssue });
  } catch (error) {
    console.error('Error:', error); // Add debug log for error
    return NextResponse.json({ error }, { status: 400 });
  }
}
