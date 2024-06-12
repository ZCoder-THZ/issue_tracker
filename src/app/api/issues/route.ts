import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { createIssueSchema } from '@/app/validationSchemas';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validaton = createIssueSchema.safeParse(body);
  if (!validaton.success) {
    return NextResponse.json(validaton.error.errors, { status: 400 });
  }
  const issue = await prisma.issue.create({
    data: {
      title: validaton.data.title,
      description: validaton.data.description,
      userId: body.user_id,
      priority: validaton.data.priority,
    },
  });

  return NextResponse.json({ issue });
}

export async function GET() {
  const issues = await prisma.issue.findMany();
  return NextResponse.json({ issues });
}
