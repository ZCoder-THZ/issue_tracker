// app/dashboard/[id]/page.tsx
import { Card, CardContent } from '@/components/ui/card';
import IssueBadge from '@/components/Status';
import ReactMarkdown from 'react-markdown';
import prisma from '../../../../prisma/client'; // Adjust the path if needed
import delay from 'delay';
import SelectAction from '../SelectAction';

interface Issue {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
}

interface DashboardProps {
  params: { id: string };
}

export default async function Dashboard({ params }: DashboardProps) {
  // Fetch the issue data from the database
  const issue = await prisma.issue.findUnique({
    where: { id: Number(params.id) },
  });

  // Handle the case where the issue is not found
  if (!issue) {
    return <div>Issue not found</div>;
  }

  let user = null;
  if (issue.assignedToUserId) {
    user = await prisma.user.findFirst({
      where: {
        id: issue.assignedToUserId,
      },
    });
  }

  console.log(user);
  await delay(1000);

  return (
    <div className="flex min-h-screen w-full flex-col  bg-muted/40 ">
      <div className="grid gap-4 md:grid-cols-[1fr_150px] lg:grid-cols-3 mt-5 mx-auto lg:gap-8 w-[80%] ">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Product Details
                </h2>
                <p className="text-sm text-gray-600">
                  {issue.createdAt.toDateString()}
                </p>
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
                <h3 className="text-lg font-semibold text-gray-800">
                  Description
                </h3>
                <div className="text-gray-700">
                  <ReactMarkdown>{issue.description}</ReactMarkdown>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Assigned person
                </h3>
                <div className="text-gray-700">
                  {user ? user.name : 'Not Assigned'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
