import React from 'react';
import Link from 'next/link';
import { Button } from '@radix-ui/themes';
import prisma from '../../../prisma/client';
import { Badge } from '@/components/ui/badge';
import IssueBadge from '@/components/Status';
import delay from 'delay';
// import IssueActions from './issueActions';
import DeleteIssue from '@/components/DeleteIssue';
import { getServerSession } from 'next-auth';
import { AuthOption } from '../auth/authOption';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function Testers() {
  // Fetch issues from the databaseTableCell
  const users = await prisma.user.findMany({});

  const session = await getServerSession(AuthOption);

  // Optional: Introduce a delay to simulate network latency or heavy processing
  //   await delay(1000);

  console.log(session);

  return (
    <div className="container mx-auto p-4">
      {/* <IssueActions /> */}
      <div className="overflow-x-auto">
        <Table className="min-w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg">
          <TableCaption className="text-left p-2">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="w-[300px] p-2">Name</TableHead>
              <TableHead className="w-[300px] p-2">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="border-b">
                <TableCell className="font-medium p-2">{user.name}</TableCell>
                <TableCell className="font-medium p-2">{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
