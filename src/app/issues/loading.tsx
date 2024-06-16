import React from 'react';
import Link from 'next/link';

import delay from 'delay';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import IssueActions from './issueActions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function IssuesLoading() {
  const issues = [1, 2, 3, 4, 5];

  return (
    <div className="container mx-auto p-4">
      <IssueActions />

      <div className="overflow-x-auto">
        <Table className="min-w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg">
          <TableCaption className="text-left p-2">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="w-[100px] p-2">Issue</TableHead>
              <TableHead className="p-2">Status</TableHead>
              <TableHead className="p-2">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues?.map((issue) => (
              <TableRow key={issue} className="border-b">
                <TableCell className="font-medium p-2">
                  <Skeleton />
                </TableCell>
                <TableCell className="p-2">
                  <Skeleton />
                </TableCell>
                <TableCell className="p-2">
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default IssuesLoading;
