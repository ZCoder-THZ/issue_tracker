import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export const GET = async (req: NextRequest) => {
    try {
        const issues = await getAssignedIssuesThisWeek();
        return NextResponse.json({ success: true, data: issues });
    } catch (error) {
        console.error("Error fetching assigned issues:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
};

async function getAssignedIssuesThisWeek() {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    return await prisma.issue.findMany({
        where: {
            status: "OPEN",
            assignedToUserId: { not: null },
            assignedDate: { gte: startOfWeek },
        },
        select: {
            id: true,               // Issue ID
            title: true,            // Issue title
            status: true,           // Issue status
            assignedDate: true,     // Assigned date
            deadlineDate: true,     // Deadline date
            userId: true,           // Created by (User ID)
            assignedToUserId: true, // Assigned to user ID
            assignedToUser: {
                select: { id: true, name: true, email: true }, // Assigned user details
            },
            user: {
                select: { id: true, name: true, email: true }, // Creator user details
            },
        },
    });
}
