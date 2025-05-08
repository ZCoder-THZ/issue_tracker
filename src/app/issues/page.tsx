import React from "react";
import Link from "next/link";
import { Button as RadixButton } from "@radix-ui/themes"; // Aliasing to avoid conflict if you use shadcn Button
import prisma from "../../../prisma/client";
import IssueBadge from "@/components/Status";
import IssueActions from "../../components/issueList/issueActions";
import DeleteIssue from "@/components/DeleteIssue";
import { CalendarIcon, PersonIcon, ClockIcon } from "@radix-ui/react-icons";
import { PaginationDemo } from "../../components/issueList/Pagination";
import { SearchInput } from "../../components/issueList/SearchInput";
import { sessionAuth } from "@/lib/sessionAUth";
import FilterIssue from "../../components/issueList/filterIssue";
import DeadlineFilter from "../../components/issueList/DeadlineFilter";
import { Issue } from "@/types/issues"; // Assuming Issue type is defined here

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

// Helper function to determine border color based on status
const getStatusBorderColor = (status: string | undefined): string => {
  switch (status) {
    case "OPEN":
      return "border-l-green-500 dark:border-l-green-400";
    case "IN_PROGRESS":
      return "border-l-yellow-500 dark:border-l-yellow-400";
    case "CLOSED":
      return "border-l-red-500 dark:border-l-red-400";
    default:
      return "border-l-gray-300 dark:border-l-slate-600";
  }
};

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await sessionAuth();

  const {
    status = "ALL",
    sortColumn = "assignedDate", // Default sort column
    sortOrder = "desc",         // Default sort order (newest first)
    search = "",
    deadline = "",
  } = searchParams;

  const pageNumber = Number(searchParams.page) || 1;
  const pageSizeNumber = Number(searchParams.pageSize) || 10;

  const whereConditions: any = {
    ...(status !== "ALL" && { status }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { assignedToUser: { name: { contains: search, mode: "insensitive" } } },
      ],
    }),
    ...(deadline && { deadlineDate: { gte: new Date(deadline) } }),
  };

  const orderBy: any = sortColumn.includes(".")
    ? {
      [sortColumn.split(".")[0]]: {
        [sortColumn.split(".")[1]]: sortOrder,
      },
    }
    : { [sortColumn]: sortOrder };

  const [issues, totalIssues] = await Promise.all([
    prisma.issue.findMany({
      include: { user: true, assignedToUser: true },
      where: whereConditions,
      orderBy,
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber,
    }) as Promise<Issue[]>,
    prisma.issue.count({ where: whereConditions }),
  ]);

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const cleanIssueTitle = (title: string): string => {
    return title.replace(/fucking|shitty|mother fucker/gi, '').trim() || "Untitled Issue";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Issue Tracker</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {totalIssues} {totalIssues === 1 ? "issue" : "issues"} found.
            </p>
          </div>
          {session && <IssueActions />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="md:col-span-1">
            <SearchInput />
          </div>
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-start md:justify-end items-center">
            <FilterIssue selectedStatus={status} /> {/* Pass current status for default selection */}
            <DeadlineFilter />
          </div>
        </div>
      </div>

      {/* Issues List or Empty State */}
      {issues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-slate-200 dark:border-slate-700">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">No issues found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            No issues match your current filters. Try adjusting your search or create a new issue.
          </p>
          {session && (
            <div className="mt-6">
              <RadixButton size="3" highContrast asChild>
                <Link href="/issues/new">Create New Issue</Link>
              </RadixButton>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`bg-white dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border dark:border-slate-700 hover:shadow-xl dark:hover:shadow-slate-900/70 transition-all duration-300 border-l-4 ${getStatusBorderColor(issue.status)}`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  {/* Main content area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <IssueBadge status={issue.status} />
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tracking-wider">
                        #{issue.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 leading-tight">
                      <Link
                        href={`/issues/${issue.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {cleanIssueTitle(issue.title)}
                      </Link>
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2" title="Assigned to">
                        <PersonIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>
                          {issue.assignedToUser ? (
                            <Link
                              href={`/devs/${issue.assignedToUserId}`}
                              className="hover:underline"
                            >
                              {issue.assignedToUser.name}
                            </Link>
                          ) : (
                            <span className="italic">Unassigned</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2" title="Reported by">
                        <PersonIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>
                          {issue.user?.name || <span className="italic">Unknown</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-2" title="Creation date">
                        <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>{formatDate(issue.assignedDate)}</span>
                      </div>

                      <div className="flex items-center gap-2" title="Deadline">
                        <ClockIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className={issue.deadlineDate && new Date(issue.deadlineDate) < new Date() && issue.status !== 'CLOSED'
                          ? "text-red-500 dark:text-red-400 font-semibold"
                          : ""}>
                          {formatDate(issue.deadlineDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons area */}
                  {session?.user.role === 2 && (
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-0 shrink-0">
                      <RadixButton size="2" variant="soft" color="gray" highContrast asChild>
                        <Link href={`/issues/${issue.id}/update`}>Edit</Link>
                      </RadixButton>
                      <DeleteIssue issueId={issue.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {issues.length > 0 && totalIssues > pageSizeNumber && (
        <div className="mt-10">
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
