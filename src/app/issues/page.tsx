import React from 'react';
import Link from 'next/link';
import { Button } from '@radix-ui/themes';
import prisma from '../../../prisma/client';
import { Badge } from '@/components/ui/badge';
import IssueBadge from '@/components/Status';
import delay from 'delay';
import IssueActions from './issueActions';
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

export default async function IssuesPage() {
  // Fetch issues from the databaseTableCell
  const issues = await prisma.issue.findMany({
    include: {
      user: true,
    },
  });

  const session = await getServerSession(AuthOption);

  // Optional: Introduce a delay to simulate network latency or heavy processing
  await delay(1000);
  // console.log(issues);
  // console.log(session);

  return (
    <div className="container mx-auto p-4">
      <IssueActions />
      <div className="overflow-x-auto">
        <Table className="min-w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg">
          <TableCaption className="text-left p-2">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="w-[100px] p-2">Issue</TableHead>
              <TableHead className="p-2">Status</TableHead>
              <TableHead className="p-2">Assigned To</TableHead>
              <TableHead className="p-2">Created By</TableHead>
              <TableHead className="p-2">Created At</TableHead>
              <TableHead className="p-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id} className="border-b">
                <TableCell className="font-medium p-2">
                  <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                </TableCell>
                <TableCell className="p-2">
                  <IssueBadge status={issue.status} />
                </TableCell>

                <TableCell className="font-medium p-2">
                  <Link href={`/issues/${issue.id}`}>{issue.user?.name}</Link>
                </TableCell>
                <TableCell className="font-medium p-2">
                  <Link href={`/issues/${issue.id}`}>{issue.user.name}</Link>
                </TableCell>
                <TableCell className="p-2">
                  {new Date(issue.createdAt).toDateString()}
                </TableCell>
                <TableCell className="p-2 space-x-2">
                  {session ? (
                    <div>
                      {issue.userId === session?.user?.id && (
                        <div className="space-x-2">
                          <DeleteIssue id={issue.id} />
                          <Button color="cyan" variant="soft">
                            <Link href={`/issues/${issue.id}/update`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
