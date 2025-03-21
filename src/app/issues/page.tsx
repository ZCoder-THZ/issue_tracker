import React from "react";
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import prisma from "../../../prisma/client";
import IssueBadge from "@/components/Status";
import IssueActions from "./issueActions";
import DeleteIssue from "@/components/DeleteIssue";
import { RowSpacingIcon } from "@radix-ui/react-icons";
import { PaginationDemo } from "./Pagination";
import { SearchInput } from "./SearchInput";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterIssue from "./filterIssue";
import { sessionAuth } from "@/lib/sessionAUth";
import IssueButton from "./components/issueButton";
import DeadlineFilter from "./DeadlineFilter";

export const dynamic = "force-dynamic";

const headers = [
  { label: "Issue", column: "title" },
  { label: "Status", column: "status" },
  { label: "Assigned To", column: "assignedToUser.name" },
  { label: "Priority", column: "priority" },
  { label: "Created By", column: "user.name" },
  { label: "Assigned Date", column: "assignedDate" },
  { label: "Deadline", column: "deadlineDate" }, // ✅ Correct field
];

const getNextSortOrder = (currentOrder: string) =>
  currentOrder === "asc" ? "desc" : "asc";

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: {
    status?: string;
    sortColumn?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
    search?: string;
    deadline?: string;
  };
}) {
  const session = await sessionAuth();

  const {
    status = "ALL",
    sortColumn = "assignedDate",
    sortOrder = "asc",
    page = 1,
    pageSize = 10,
    search = "",
    deadline = "",
  } = searchParams;

  const queryOptions = {
    include: { user: true, assignedToUser: true },
    orderBy: sortColumn.includes(".")
      ? {
        [sortColumn.split(".")[0]]: {
          [sortColumn.split(".")[1]]: sortOrder,
        },
      }
      : { [sortColumn]: sortOrder },
    where: {
      ...(status !== "ALL" && { status }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { user: { name: { contains: search } } },
        ],
      }),
      ...(deadline && { deadlineDate: { gte: new Date(deadline) } }), // ✅ Correct field
    },
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
  };

  const [issues, totalIssues] = await Promise.all([
    prisma.issue.findMany(queryOptions),
    prisma.issue.count({ where: queryOptions.where }),
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center w-full">
        {session && <IssueActions />}
        <div className="flex space-x-2">
          <SearchInput />
          <FilterIssue />
          <DeadlineFilter />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full max-w-3xl mx-auto bg-white dark:bg-black shadow-md rounded-lg">
          <TableCaption className="text-left p-2">
            A list of your recent issues.
          </TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map(({ label, column }) => (
                <TableHead key={column} className="p-2">
                  <Link
                    href={`?status=${status}&sortColumn=${column}&sortOrder=${getNextSortOrder(
                      sortOrder
                    )}&search=${search}&deadline=${deadline}`}
                  >
                    {label} <RowSpacingIcon className="inline" />
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
                  <IssueButton href={`/issues/${issue.id}`} title={issue.title} />
                </TableCell>
                <TableCell className="p-2">
                  <IssueBadge status={issue.status} />
                </TableCell>
                <TableCell className="font-medium p-2">
                  {issue.assignedToUser ? (
                    <Link href={`/devs/${issue.assignedToUserId}`}>
                      {issue.assignedToUser.name}
                    </Link>
                  ) : (
                    "Unassigned"
                  )}
                </TableCell>
                <TableCell className="font-medium p-2">
                  {issue.priority}
                </TableCell>
                <TableCell className="font-medium p-2">
                  {issue.user ? (
                    <Link href={`/issues/${issue.id}`}>{issue.user.name}</Link>
                  ) : (
                    "Unknown"
                  )}
                </TableCell>
                <TableCell className="p-2">
                  {issue.assignedDate
                    ? new Date(issue.assignedDate).toDateString()
                    : "N/A"}
                </TableCell>
                <TableCell className="p-2">
                  {issue.deadlineDate
                    ? new Date(issue.deadlineDate).toDateString()
                    : "N/A"}
                </TableCell>
                <TableCell className="p-2 space-x-2">
                  {session?.user.role === 2 && (
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
            currentPage={Number(page)}
          />
        </div>
      </div>
    </div>
  );
}
