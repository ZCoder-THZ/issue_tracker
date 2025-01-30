import { Card, CardContent } from '@/components/ui/card';
import IssueBadge from '@/components/Status';
import ReactMarkdown from 'react-markdown';
import prisma from '../../../../prisma/client';
import ResponseSection from './responseSection';
import Image from 'next/image';
import IssueImages from './IssueImages';
interface issueProps {
  params: Promise<{ id: string }>;
}

export default async function page(props: issueProps) {
  const params = await props.params;
  // Fetch the issue and related images
  const issue = await prisma.issue.findUnique({
    where: { id: Number(params.id) },
    include: {
      issueImages: {
        select: {
          id: true,
          imageUrl: true
        }
      },
    }
  });

  if (!issue) {
    return <div>Issue not found</div>;
  }
  console.log(issue)
  // Fetch assigned user
  const user = issue.assignedToUserId
    ? await prisma.user.findFirst({ where: { id: issue.assignedToUserId } })
    : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="grid gap-4 md:grid-cols-[1fr_150px] lg:grid-cols-3 mt-5 mx-auto lg:gap-8 w-[80%]">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Product Details
                </h2>
                <p className="text-sm text-gray-600">{issue.createdAt.toDateString()}</p>
              </div>
              <div className="w-16">
                <IssueBadge status={issue.status} />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Name</h3>
                <p className="text-gray-700">{issue.title}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <div className="text-gray-700">
                  <ReactMarkdown>{issue.description}</ReactMarkdown>
                </div>
              </div>
              {
                issue.issueImages.length > 0 && <IssueImages issueImages={issue.issueImages} />
              }
              {/* Issue Images Section */}

            </CardContent>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Assigned person</h3>
                <div className="text-gray-700">{user ? user.name : 'Not Assigned'}</div>
              </div>
            </CardContent>
          </Card>
          <ResponseSection issueId={issue.id} />
        </div>
      </div>
    </div>
  );
}

// https://issuetrack.s3.ap-southeast-1.amazonaws.com/5Ri_Qz0adTpsxmedipuIt_Screenshot from 2025-01-23 17-25-36.png