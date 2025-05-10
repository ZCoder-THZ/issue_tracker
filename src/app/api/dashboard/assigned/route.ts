// api/dashboard/assignedUsers/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { AuthOption } from '@/app/auth/authOption';
import prisma from '../../../../../prisma/client';
type User = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    assignedCount: number;
    lastActivity: Date | null;
}

export async function GET() {
    try {
        // Get the current session to check authentication
        const session = await getServerSession(AuthOption);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find users who have been assigned issues
        const usersWithAssignedIssues = await prisma.user.findMany({
            where: {
                assignedIssues: {
                    some: {} // This finds users who have at least one assigned issue
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                _count: {
                    select: {
                        assignedIssues: {
                            where: {
                                // You can add filters here if needed, like:
                                status: { notIn: ['CLOSED'] }, // Only count active issues
                            }
                        }
                    }
                },
                assignedIssues: {
                    take: 1, // Just to check if there's any recent activity
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    select: {
                        updatedAt: true
                    }
                }
            },
            orderBy: {
                // Order by users with most assigned issues first
                assignedIssues: {
                    _count: 'desc'
                }
            }
        });

        // Transform the data for the frontend

        const assignedUsers = usersWithAssignedIssues.map(user => ({
            id: user.id,
            name: user.name || 'Unknown User',
            email: user.email || '',
            image: user.image || null,
            assignedCount: user._count.assignedIssues,
            lastActivity: user.assignedIssues[0]?.updatedAt || null
        }));

        return NextResponse.json({
            success: true,
            data: assignedUsers
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching assigned users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch assigned users' },
            { status: 500 }
        );
    }
}

