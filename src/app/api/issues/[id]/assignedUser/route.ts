import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: number } }
) => {
  try {
    const issueId = Number(params.id);
    const body = await request.json();
    const userId = body.user_id;

    // Fetch the issue to check if it exists
    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
    });

    if (issue) {
      console.log('Request Body:', body); // Debug log for request body

      // Update the issue with the new assigned user
      const updatedIssue = await prisma.issue.update({
        where: {
          id: issueId,
        },
        data: {
          assignedToUserId: userId,
        },
      });

      // Check if a notification for this issue and user already exists
      const existingNotification = await prisma.notification.findFirst({
        where: {
          issueId,
          userId,
        },
      });

      if (existingNotification) {
        // Update the existing notification
        const updatedNotification = await prisma.notification.update({
          where: {
            id: existingNotification.id,
          },
          data: {
            message: `Issue #${issueId} has been reassigned.`,
            type: 'issue_reassigned',
            createdAt: new Date(), // Update the timestamp
          },
        });
        console.log('Updated Notification:', updatedNotification);
      } else {
        // Create a new notification
        const newNotification = await prisma.notification.create({
          data: {
            message: `Issue #${issueId} has been assigned to you.`,
            type: 'issue_assigned',
            userId,
            issueId,
            createdAt: new Date(),
          },
        });
        console.log('New Notification:', newNotification);
      }

      return NextResponse.json({ status: 'success', updatedIssue });
    } else {
      return NextResponse.json({ status: 'error', message: 'Issue not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: 'error', message: error.message });
  }
};
