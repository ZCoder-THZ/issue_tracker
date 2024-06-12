'use client';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
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

type IssueForm = z.infer<typeof createIssueSchema>;

interface IssueFormComponentProps {
  issue?: {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low' | 'lowest';
  } | null;
}

const IssueFormComponent: React.FC<IssueFormComponentProps> = ({ issue }) => {
  const { data: session } = useSession();
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
      priority: issue?.priority || 'low',
    },
  });

  useEffect(() => {
    if (issue) {
      setValue('title', issue.title);
      setValue('description', issue.description);
      setValue('priority', issue.priority);
    }
  }, [issue, setValue]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (issueData: {
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low' | 'lowest';
      user_id: number;
    }) => {
      if (issue) {
        return axios.patch(`/api/issues/${issue.id}`, issueData);
      } else {
        return axios.post('/api/issues', issueData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['issues']);
      setLoading(false);
      toast.success(`Issue ${issue ? 'updated' : 'created'} successfully`);
      router.push('/issues');
      router.refresh();
    },
    onError: (error) => {
      console.log(error.response.message);
      setLoading(false);
    },
  });

  const onSubmit = ({ title, description, priority }: IssueForm) => {
    setLoading(true);
    mutation.mutate({
      title,
      description,
      priority,
      user_id: session?.user?.id,
    });
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
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="lowest">Lowest</option>
                </select>
                {errors.priority && (
                  <ErrorMessage>{errors.priority.message}</ErrorMessage>
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
