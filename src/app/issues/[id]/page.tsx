import { Card, CardContent } from '@/components/ui/card';
import IssueBadge from '@/components/Status';
import ReactMarkdown from 'react-markdown';
import prisma from '../../../../prisma/client';
import ResponseSection from './responseSection';
import IssueImages from './IssueImages';

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
      <div className="flex h-screen items-center justify-center text-gray-500">       <div>
        <h3 className="text-lg font-semibold text-gray-900">Priority</h3>
        <span
          className={`inline-block px-3 py-1 text-sm font-medium text-white rounded-full ${issue.priority === 'High'
            ? 'bg-red-500'
            : issue.priority === ''
              ? 'bg-yellow-500'
              : 'bg-green-500'
            }`}
        >
          {issue.priority}
        </span>
      </div>
        Issue not found
      </div>
    );
  }

  // Fetch assigned user
  const user = issue.assignedToUserId
    ? await prisma.user.findFirst({ where: { id: issue.assignedToUserId } })
    : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 py-10 px-4 lg:px-20">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mx-auto w-full max-w-5xl">
        {/* Left Content (Issue Details) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md border border-gray-200 rounded-lg">
            <div className="p-5 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Issue Details
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(issue.createdAt).toDateString()}
                </p>
              </div>
              <IssueBadge status={issue.status} />
            </div>
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Title</h3>
                <p className="text-gray-700">{issue.title}</p>
              </div>

              {/* Priority */}
              {/* Priority Badge */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Priority</h3>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium text-white rounded-full ${issue.priority === 'high' ? 'bg-red-500' :
                    issue.priority === 'medium' ? 'bg-orange-400' :
                      issue.priority === 'low' ? 'bg-yellow-500' :
                        'bg-green-500' // Lowest priority
                    }`}
                >
                  {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                </span>
              </div>


              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <div className="text-gray-700 prose">
                  <ReactMarkdown>{issue.description}</ReactMarkdown>
                </div>
              </div>

              {/* Issue Images Section */}
              {issue.issueImages.length > 0 && (
                <IssueImages issueImages={issue.issueImages} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Content (Assigned Person & Response Section) */}
        <div className="space-y-6">
          {/* Assigned Person */}
          <Card className="shadow-md border border-gray-200 rounded-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Assigned Person
              </h3>
              <p className="text-gray-700 mt-2">
                {user ? user.name : 'Not Assigned'}
              </p>
            </CardContent>
          </Card>

          {/* Response Section */}
          <ResponseSection issueId={issue.id} />
        </div>
      </div>
    </div>
  );
}
