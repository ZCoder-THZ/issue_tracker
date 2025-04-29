import React from "react";
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import prisma from "../../../prisma/client";
import IssueBadge from "@/components/Status";
import IssueActions from "./issueActions";
import DeleteIssue from "@/components/DeleteIssue";
import { CalendarIcon, PersonIcon, ClockIcon } from "@radix-ui/react-icons";
import { PaginationDemo } from "./Pagination";
import { SearchInput } from "./SearchInput";
import { sessionAuth } from "@/lib/sessionAUth";
import FilterIssue from "./filterIssue";
import DeadlineFilter from "./DeadlineFilter";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  sortColumn?: string;
  sortOrder?: string;
  page?: string;
  pageSize?: string;
  search?: string;
  deadline?: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: number;
  password: string;
}

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "low" | "medium" | "high";
  assignedDate: Date | null;
  deadlineDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  assignedToUserId: string | null;
  user: User;
  assignedToUser: User | null;
}

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await sessionAuth();

  const {
    status = "ALL",
    sortColumn = "assignedDate",
    sortOrder = "asc",
    search = "",
    deadline = "",
  } = searchParams;

  const pageNumber = Number(searchParams.page) || 1;
  const pageSizeNumber = Number(searchParams.pageSize) || 10;

  const whereConditions = {
    ...(status !== "ALL" && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ],
    }),
    ...(deadline && { deadlineDate: { gte: new Date(deadline) } }),
  };

  const orderBy = sortColumn.includes(".")
    ? {
      [sortColumn.split(".")[0]]: {
        [sortColumn.split(".")[1]]: sortOrder,
      },
    }
    : { [sortColumn]: sortOrder };

  const [issues, totalIssues] = await Promise.all([
    prisma.issue.findMany({
      include: { user: true, assignedToUser: true },
      // @ts-ignore
      where: whereConditions,
      orderBy,
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber,
    }) as Promise<Issue[]>,
    // @ts-ignore

    prisma.issue.count({ where: whereConditions }),
  ]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const cleanIssueTitle = (title: string) => {
    return title.replace(/fucking|shitty|mother fucker/gi, '').trim() || "Untitled issue";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Issue Tracker</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {totalIssues} {totalIssues === 1 ? "issue" : "issues"} found
            </p>
          </div>
          {session && <IssueActions />}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchInput />
          </div>
          <div className="flex gap-2">
            <FilterIssue selectedStatus='' />
            <DeadlineFilter />
          </div>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No issues match your criteria</p>
          {session && (
            <Button asChild>
              <Link href="/issues/new">Create New Issue</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <IssueBadge status={issue.status} />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        #{issue.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      <Link
                        href={`/issues/${issue.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {cleanIssueTitle(issue.title)}
                      </Link>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <PersonIcon className="w-4 h-4 text-gray-400" />
                        <span>
                          {issue.assignedToUser ? (
                            <Link
                              href={`/devs/${issue.assignedToUserId}`}
                              className="text-gray-700 dark:text-gray-300 hover:underline"
                            >
                              {issue.assignedToUser.name}
                            </Link>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Unassigned</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <PersonIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {issue.user?.name || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {formatDate(issue.assignedDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className={issue.deadlineDate && new Date(issue.deadlineDate) < new Date()
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-700 dark:text-gray-300"}>
                          {formatDate(issue.deadlineDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {session?.user.role === 2 && (
                    <div className="flex gap-2">
                      <Button variant="soft" asChild>
                        <Link href={`/issues/${issue.id}/update`}>Edit</Link>
                      </Button>
                      <DeleteIssue issueId={issue.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {issues.length > 0 && (
        <div className="mt-8">
          <PaginationDemo
            itemCount={totalIssues}
            pageSize={pageSizeNumber}
            currentPage={pageNumber}
          />
        </div>
      )}
    </div>
  );
}