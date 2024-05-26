import React from 'react'
import Link from 'next/link'
import { Button } from '@radix-ui/themes'
import prisma from '../../../prisma/client'
import { Badge } from "@/components/ui/badge"
import IssueBadge from '@/components/Status'
import delay from 'delay'
import IssueActions from './issueActions'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

async function IssuesPage() {
  const issues=await  prisma.issue.findMany();
  await delay(2000)
  return (
    <div className='container mx-auto p-4'>
      <IssueActions/>
    <div className="overflow-x-auto">
      <Table className="min-w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <TableCaption className="text-left p-2">A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead className="w-[100px] p-2">Issue</TableHead>
            <TableHead className="p-2">Status</TableHead>
            <TableHead className="p-2">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {
              issues?.map(issue=>
                <TableRow key={issue.id} className="border-b">
                <TableCell className="font-medium p-2">
                  <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                </TableCell>
                <TableCell className="p-2">
                 
                  <IssueBadge status={issue.status}/>
                 
                </TableCell>
                <TableCell className="p-2">{issue.createdAt.toDateString()}</TableCell>
               
              </TableRow>
              )
            }
         
         
        </TableBody>
      </Table>
    </div>
  </div>
  
  )
}

export default IssuesPage