// IssueForm.tsx
'use client';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@/components/ErrorMessage';
import Spinner from '@/components/Spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import SimpleMDEEditor from 'react-simplemde-editor';
import { useSession } from 'next-auth/react';
import SelectAction from './SelectAction';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createIssueSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import axios from 'axios';

// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type IssueForm = z.infer<typeof createIssueSchema>;

interface IssueFormComponentProps {
  issue?: {
    id: number;
    title: string;
    description: string;
  } | null;
}

const IssueFormComponent: React.FC<IssueFormComponentProps> = ({ issue }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
    },
  });

  useEffect(() => {
    if (issue) {
      setValue('title', issue.title);
      setValue('description', issue.description);
    }
  }, [issue, setValue]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (issueData: {
      title: string;
      description: string;
      user_id: number;
    }) => {
      if (issue) {
        return axios.patch(`/api/issues/${issue.id}`, issueData);
      } else {
        return axios.post('/api/issues', issueData);
      }
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries(['issues']);

      setLoading(false);
      if (issue) {
        toast.success('Issue updated successfully');
        router.push('/issues');
      } else {
        toast.success('Issue created successfully');
      }
    },
    onError: (error) => {
      console.log(error.response.message);
      setLoading(false);
    },
  });

  interface FormData {
    title: string;
    description: string;
  }

  const onSubmit = ({ title, description }: FormData) => {
    setLoading(true);

    mutation.mutate({ title, description, user_id: session?.user?.id });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{issue ? 'Update Issue' : 'Add Issue'}</CardTitle>
            <CardDescription>
              Please {issue ? 'update' : 'add'} an issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('title')}
                  type="text"
                  className="w-full mb-3"
                />
                {errors.title && (
                  <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <SimpleMDEEditor id="description" {...field} />
                  )}
                />
                {errors.description && (
                  <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  {issue ? 'Update Issue' : 'Add Issue'}
                  {loading && <Spinner />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
};

export default IssueFormComponent;
