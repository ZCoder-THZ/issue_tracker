"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Utility function for Tailwind class merging

export default function IssueTable() {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        async function fetchIssues() {
            try {
                const res = await fetch("http://localhost:3000/api/dashboard/issues");
                const data = await res.json();
                if (data.success) {
                    setIssues(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch issues:", error);
            }
        }

        fetchIssues();
    }, []);

    return (
        <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 text-center">🔥 Recent Issues 🔥</h2>
            <Table className="w-full border border-gray-200 dark:border-gray-700">
                <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        <TableHead className="w-[80px] text-center">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Deadline</TableHead>
                        <TableHead>Assigned To</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {issues.length > 0 ? (
                        issues.map((issue, index) => (
                            <TableRow
                                key={issue.id}
                                className={cn(
                                    "border-b border-gray-200 dark:border-gray-700 transition duration-300",
                                    index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-900",
                                    "hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.02] cursor-pointer"
                                )}
                            >
                                <TableCell className="text-center font-semibold text-blue-600 dark:text-blue-400">
                                    {issue.id}
                                </TableCell>
                                <TableCell className="font-medium">{issue.title}</TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={cn(
                                            "px-2 py-1 rounded-md text-xs font-semibold",
                                            issue.status === "OPEN"
                                                ? "bg-green-100 text-green-700 dark:bg-green-500 dark:text-black"
                                                : "bg-red-100 text-red-700 dark:bg-red-500 dark:text-white"
                                        )}
                                    >
                                        {issue.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {new Date(issue.deadlineDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {issue.assignedToUser?.name || "Unassigned"}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-4">
                                🚀 No issues found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
