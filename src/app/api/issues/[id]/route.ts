import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { createIssueSchema } from "@/app/validationSchemas";
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
export async function PATCH(request: NextRequest, { params }: { params: { id: number } }) {
    // Log the entire request object to see what's being received
    try {
        const issue = await prisma.issue.findFirst({
            where: {
                id: Number(params.id)
            }
        })
        if(!issue){
            return NextResponse.json({ error: "Issue not found" }, { status: 404 })
        }

        const body=await request.json();
        const validaton= createIssueSchema.safeParse(body)
        if(!validaton.success){
            return NextResponse.json(validaton.error.errors,{status:400})
        }
        const updatedIssue=await prisma.issue.update({
            where: {
                id: Number(params.id)
            },
            data:{
                title:validaton.data.title,
                description:validaton.data.description
            }
        })
        return NextResponse.json({ updatedIssue })
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
        
    }
    
}