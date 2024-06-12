'use client';
import IssueFormComponent from '../IssueForm';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import DatePicker from '../DatePicker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

const IssueForm = dynamic(() => import('../IssueForm'), {
  ssr: false,
});

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: issues,
    isLoading: isIssuesLoading,
    error,
  } = useQuery({
    queryKey: ['issues'],
    queryFn: () => axios.get('/api/issues').then((res) => res.data.issues),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/issues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['issues']);
      toast.error('deleted success');
      router.refresh();
    },
  });

  if (isIssuesLoading) return <p>Loading issues...</p>;
  if (error) return <p>An error occurred: {error.message}</p>;

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-2">
              <div className="lg:col-span-4">
                <IssueForm />
              </div>
              <div className="lg:col-span-4 space-y-4">
                {issues
                  ?.slice()
                  .reverse()
                  .map((issue) => (
                    <Card key={issue.id} className="overflow-hidden w-98">
                      <CardHeader>
                        <CardTitle>{issue.title}</CardTitle>
                        <CardDescription>
                          <ReactMarkdown>{issue.description}</ReactMarkdown>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(issue.id)}
                        >
                          Delete Issue
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
