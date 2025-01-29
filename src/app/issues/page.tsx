import React from 'react';
import Link from 'next/link';
import { Button } from '@radix-ui/themes';
import prisma from '../../../prisma/client';
import IssueBadge from '@/components/Status';
import IssueActions from './issueActions';
import DeleteIssue from '@/components/DeleteIssue';

import { RowSpacingIcon } from '@radix-ui/react-icons';
import { PaginationDemo } from './Pagination';
import { SearchInput } from './SearchInput';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import FilterIssue from './filterIssue';
import { sessionAuth } from '@/lib/sessionAUth';

export const dynamic = 'force-dynamic';

export default async function IssuesPage(props: any) {
  const searchParams = await props.searchParams;
  const status = searchParams?.status || 'ALL';
  const sortColumn = searchParams?.sortColumn || 'createdAt';
  const sortOrder = searchParams?.sortOrder || 'asc';
  const page = parseInt(searchParams?.page) || 1;
  const pageSize = parseInt(searchParams?.pageSize) || 10;
  const searchQuery = searchParams?.search || '';

  const headers = [
    {
      label: 'Issue',
      column: 'title',
      icon: <RowSpacingIcon className="inline" />,
    },
    { label: 'Status', column: 'status', icon: null },
    {
      label: 'Assigned To',
      column: 'assignedToUser.name',
      icon: <RowSpacingIcon className="inline" />,
    },
    {
      label: 'Priority',
      column: 'priority',
      icon: <RowSpacingIcon className="inline" />,
    },
    {
      label: 'Created By',
      column: 'user.name',
      icon: <RowSpacingIcon className="inline" />,
    },
    {
      label: 'Created At',
      column: 'createdAt',
      icon: <RowSpacingIcon className="inline" />,
    },
  ];

  let issues = [];

  const queryOptions = {
    include: {
      user: true,
      assignedToUser: true,
    },
    orderBy: {},
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  // Nested sorting for related fields
  if (sortColumn.includes('.')) {
    const [relation, field] = sortColumn.split('.');
    queryOptions.orderBy[relation] = { [field]: sortOrder };
  } else {
    queryOptions.orderBy[sortColumn] = sortOrder;
  }

  // Handle status filtering
  if (status !== 'ALL') {
    queryOptions.where = { status };
  }

  // Handle search filtering
  if (searchQuery) {
    queryOptions.where = {
      ...queryOptions.where,
      OR: [
        { title: { contains: searchQuery } },
        { user: { name: { contains: searchQuery } } },
      ],
    };
  }

  issues = await prisma.issue.findMany(queryOptions);
  const totalIssues = await prisma.issue.count({ where: queryOptions.where });
  const totalPages = Math.ceil(totalIssues / pageSize);
  const session = await sessionAuth();

  const getNextSortOrder = (currentOrder: string) =>
    currentOrder === 'asc' ? 'desc' : 'asc';

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center w-full">
        <div>{session ? <IssueActions /> : null}</div>
        <div className="flex space-x-2">
          <SearchInput />
          <FilterIssue />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full max-w-3xl mx-auto bg-white dark:bg-black shadow-md rounded-lg">
          <TableCaption className="text-left p-2">
            A list of your recent issues.
          </TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map(({ label, column, icon }) => (
                <TableHead key={column} className="p-2">
                  <Link
                    href={`?status=${status}&sortColumn=${column}&sortOrder=${getNextSortOrder(
                      sortOrder
                    )}&search=${searchQuery}`}
                  >
                    {label}
                    {icon}
                  </Link>
                </TableHead>
              ))}
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
                  <Link href={`/devs/${issue.assignedToUserId}`}>
                    {issue.assignedToUser?.name}
                  </Link>
                </TableCell>
                <TableCell className="font-medium p-2">
                  {issue.priority}
                </TableCell>
                <TableCell className="font-medium p-2">
                  <Link href={`/issues/${issue.id}`}>{issue.user?.name}</Link>
                </TableCell>
                <TableCell className="p-2">
                  {new Date(issue.createdAt).toDateString()}
                </TableCell>
                <TableCell className="p-2 space-x-2">
                  {session && session.user.role === 2 && (
                    <div className="space-x-2">
                      <DeleteIssue issueId={issue.id} />
                      <Button color="cyan" variant="soft">
                        <Link href={`/issues/${issue.id}/update`}>Edit</Link>
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4">
          <PaginationDemo
            itemCount={totalIssues}
            pageSize={pageSize}
            currentPage={page}
          />
        </div>
      </div>
    </div>
  );
}
