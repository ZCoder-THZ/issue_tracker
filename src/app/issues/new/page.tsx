'use client';
import IssueFormComponent from '../IssueForm';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';

const IssueForm = dynamic(() => import('../IssueForm'), {
  ssr: false,
});

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // const {
  //   data: issues,
  //   isLoading: isIssuesLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ['issues'],
  //   queryFn: () => axios.get('/api/issues').then((res) => res.data.issues),
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: (id) => axios.delete(`/api/issues/${id}`),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['issues']);
  //     toast.error('deleted success');
  //     router.refresh();
  //   },
  // });

  // if (isIssuesLoading) return <p>Loading issues...</p>;
  // if (error) return <p>An error occurred: {error.message}</p>;

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-2">
              <div className="lg:col-span-4">
                <IssueForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
