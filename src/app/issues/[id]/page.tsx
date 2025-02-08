import { Card, CardContent } from '@/components/ui/card';
import IssueBadge from '@/components/Status';
import ReactMarkdown from 'react-markdown';
import prisma from '../../../../prisma/client';
import ResponseSection from './responseSection';
import IssueImages from './IssueImages';
import { SparklesIcon } from '@heroicons/react/24/solid';

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
    },
  });

  if (!issue) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
        <div className="text-center p-6 bg-white bg-opacity-20 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold">🚀 Issue Not Found</h2>
          <p className="mt-2 text-lg">The issue you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Fetch assigned user
  const user = issue.assignedToUserId
    ? await prisma.user.findFirst({ where: { id: issue.assignedToUserId } })
    : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 lg:px-20">
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 mx-auto w-full max-w-6xl">
        {/* Left Content (Issue Details) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-xl border border-gray-300 rounded-lg overflow-hidden bg-white transform hover:scale-105 transition-transform">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Issue Details</h2>
                <p className="text-sm opacity-90">{new Date(issue.createdAt).toDateString()}</p>
              </div>
              <IssueBadge status={issue.status} />
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Title</h3>
                <p className="text-gray-700 text-lg">{issue.title}</p>
              </div>

              {/* Priority Badge */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Priority</h3>
                <span
                  className={`inline-block px-4 py-2 text-sm font-bold text-white rounded-full shadow-md ${issue.priority === 'high' ? 'bg-red-500' :
                    issue.priority === 'medium' ? 'bg-orange-400' :
                      issue.priority === 'low' ? 'bg-yellow-500' :
                        'bg-green-500'
                    }`}
                >
                  {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">Description</h3>
                <div className="text-gray-700 prose prose-lg bg-gray-100 p-4 rounded-lg shadow-md">
                  <ReactMarkdown>{issue.description}</ReactMarkdown>
                </div>
              </div>

              {/* Dates */}

              {issue.assignedDate && (
                <p className="text-gray-700 font-medium">📅 Assigned Date: {new Date(issue.assignedDate).toDateString()}</p>
              )}
              {issue.deadlineDate && (
                <p className="text-gray-700 font-medium">⏳ Deadline Date: {new Date(issue.deadlineDate).toDateString()}</p>
              )}

              {/* Issue Images Section */}
              {issue.issueImages.length > 0 && <IssueImages issueImages={issue.issueImages} />}
            </CardContent>
          </Card>
        </div>

        {/* Right Content (Assigned Person & Response Section) */}
        <div className="space-y-8">
          {/* Assigned Person */}
          <Card className="shadow-xl border border-gray-300 rounded-lg bg-white transform hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Assigned Person <SparklesIcon className="w-5 h-5 text-yellow-500" />
              </h3>
              <p className="text-gray-700 mt-2 text-lg font-medium">{user ? user.name : 'Not Assigned'}</p>
            </CardContent>
          </Card>

          {/* Response Section */}replies
          <ResponseSection issueId={issue.id} issueOwnerId={
            issue.userId
          } />
        </div>
      </div>
    </div>
  );
}