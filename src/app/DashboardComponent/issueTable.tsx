'use client';

import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

// Type definitions
interface AssignedUser {
    id: string;
    name: string;
    email: string;
    image: string | null;
    assignedCount: number;
    lastActivity: string | null;
}

const fetchAssignedUsers = async () => {
    const res = await axios.get('/api/dashboard/assigned');
    return res.data.data || [];
};

const AssignedUsers = () => {
    const { data: users, isPending, error } = useQuery({
        queryKey: ['/api/dashboard/assigned'],
        queryFn: fetchAssignedUsers,
    });

    if (isPending) {
        return (
            <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Assigned Team Members</h3>
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Assigned Team Members</h3>
                <div className="text-center py-4 text-red-500">
                    Failed to load assigned users. Please try again later.
                </div>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow p-4">
                <h3 className="text-lg font-semibold mb-4">Assigned Team Members</h3>
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No team members with assigned issues found.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg bg-white dark:bg-gray-800 shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Assigned Team Members</h3>
            <div className="space-y-4">
                {users.map((user: AssignedUser) => (
                    <div key={user.id} className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                        <div className="flex-shrink-0">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="ml-4 flex-grow">
                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.assignedCount} {user.assignedCount === 1 ? 'issue' : 'issues'}
                            </div>
                            {user.lastActivity && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Last activity: {formatDistanceToNow(new Date(user.lastActivity))} ago
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignedUsers;