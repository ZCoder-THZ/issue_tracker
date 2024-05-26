// app/dashboard/[id]/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import IssueBadge from "@/components/Status";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Textarea } from "@/components/ui/textarea";
import prisma from '../../../../prisma/client'; // Adjust the path if needed
import delay from "delay";

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
    where: { id: Number(params.id) }
  });
  await delay(1000)

  // Handle the case where the issue is not found
  if (!issue) {
    return <div>Issue not found</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
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
      </CardContent>
    </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-3">
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}