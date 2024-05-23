import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
    // Log the entire request object to see what's being received
    try {
        const issue = await prisma.issue.delete({
            where: {
                id: Number(params.id)
            }
        })

        return NextResponse.json({ issue })
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
        
    }
    
}