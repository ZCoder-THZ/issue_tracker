import { Card, CardContent } from '@/components/ui/card';
import IssueBadge from '@/components/Status';
import ReactMarkdown from 'react-markdown';
import prisma from '../../../../prisma/client';
import ResponseSection from './responseSection';
import IssueImages from './IssueImages';
import {
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IssueProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: IssueProps) {
  const params = await props.params;

  // Fetch issue and related images
  const issue = await prisma.issue.findUnique({
    where: { id: Number(params.id) },
    include: {
      issueImages: { select: { id: true, imageUrl: true } },
      user: { select: { id: true, name: true, email: true, image: true } },
      assignedToUser: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!issue) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white">
        <div className="text-center p-8 bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-30 backdrop-blur-md rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold">Issue Not Found</h2>
          <p className="mt-4 text-lg">The issue you are looking for does not exist or has been removed.</p>
          <a href="/issues" className="mt-6 inline-block px-6 py-3 bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
            Return to Issues
          </a>
        </div>
      </div>
    );
  }

  // Calculate time remaining or overdue status
  const getDeadlineStatus = () => {
    if (!issue.deadlineDate) return null;

    const deadline = new Date(issue.deadlineDate);
    const now = new Date();

    if (deadline < now) {
      return {
        status: 'overdue',
        text: `Overdue by ${formatDistanceToNow(deadline)}`
      };
    } else {
      return {
        status: 'upcoming',
        text: `Due in ${formatDistanceToNow(deadline)}`
      };
    }
  };

  const deadlineStatus = getDeadlineStatus();

  // Get priority color and icon
  const getPriorityDetails = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-500 dark:bg-red-600',
          textColor: 'text-white',
          ringColor: 'ring-red-400 dark:ring-red-500'
        };
      case 'medium':
        return {
          color: 'bg-orange-400 dark:bg-orange-500',
          textColor: 'text-white',
          ringColor: 'ring-orange-300 dark:ring-orange-400'
        };
      case 'low':
        return {
          color: 'bg-blue-500 dark:bg-blue-600',
          textColor: 'text-white',
          ringColor: 'ring-blue-400 dark:ring-blue-500'
        };
      default:
        return {
          color: 'bg-green-500 dark:bg-green-600',
          textColor: 'text-white',
          ringColor: 'ring-green-400 dark:ring-green-500'
        };
    }
  };

  const priorityDetails = getPriorityDetails(issue.priority);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{issue.title}</h1>
              <div className="ml-4">
                <IssueBadge status={issue.status} />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Issue #{issue.id} • Created {formatDistanceToNow(new Date(issue.createdAt))} ago
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full 
                ${priorityDetails.color} ${priorityDetails.textColor} 
                ring-2 ${priorityDetails.ringColor} shadow-sm`}
            >
              <ExclamationCircleIcon className="mr-1.5 h-5 w-5" />
              {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Issue Card */}
            <Card className="overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              {/* Description Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Description</h2>
                <div className="prose prose-lg max-w-none dark:prose-invert bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg">
                  <ReactMarkdown>{issue.description}</ReactMarkdown>
                </div>
              </div>

              {/* Issue Timeline */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Timeline</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                    <span>Created on {new Date(issue.createdAt).toLocaleDateString()} at {new Date(issue.createdAt).toLocaleTimeString()}</span>
                  </div>

                  {issue.assignedDate && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <UserCircleIcon className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                      <span>Assigned on {new Date(issue.assignedDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {issue.deadlineDate && (
                    <div className="flex items-center">
                      <ClockIcon className={`h-5 w-5 mr-2 ${deadlineStatus?.status === 'overdue'
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-green-500 dark:text-green-400'
                        }`} />
                      <span className={`
                        ${deadlineStatus?.status === 'overdue'
                          ? 'text-red-600 dark:text-red-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                        }`}>
                        Deadline: {new Date(issue.deadlineDate).toLocaleDateString()} ({deadlineStatus?.text})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Issue Images */}
              {issue.issueImages.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Attachments</h2>
                  <IssueImages issueImages={issue.issueImages} />
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* People Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800 p-4">
                <h2 className="text-lg font-semibold text-white">People</h2>
              </div>
              <CardContent className="p-5 space-y-6">
                {/* Creator */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Created by</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-700">
                      <AvatarImage src={issue.user?.image || ''} alt={issue.user?.name || ''} />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                        {issue.user?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{issue.user?.email || ''}</p>
                    </div>
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Assigned to</h3>
                  {issue.assignedToUser ? (
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-700">
                        <AvatarImage src={issue.assignedToUser?.image || ''} alt={issue.assignedToUser?.name || ''} />
                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          {issue.assignedToUser?.name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.assignedToUser?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{issue.assignedToUser?.email || ''}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                      Not currently assigned to anyone
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Response Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
              <ResponseSection issueId={issue.id} issueOwnerId={issue.userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}