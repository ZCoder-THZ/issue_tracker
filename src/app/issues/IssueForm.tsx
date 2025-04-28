'use client';

import { createIssueSchema } from '@/app/validationSchemas';
import ErrorMessage from '@/components/ErrorMessage';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useNotification from '@/hooks/useNotification';
import { useSocketStore } from '@/stores/socketStore';
import {
  Controller,
  FormProvider,
  useForm,
} from 'react-hook-form';
import SimpleMDEEditor from 'react-simplemde-editor';
import { toast } from 'react-toastify';
import { z } from 'zod';
import AssignDate from './DatePicker';
import MultiImageUpload from './new/imageUpload';

type IssueForm = z.infer<typeof createIssueSchema>;

interface IssueFormComponentProps {
  issue?: {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low' | 'lowest';
    assignedDate?: string;
    deadlineDate?: string;
    issueImages?: { id: number; imageUrl: string }[];
  } | null;
}

const IssueFormComponent: React.FC<IssueFormComponentProps> = ({ issue }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketStore();
  const { handleSendNotification } = useNotification()
  const methods = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'low',
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (issue) {
      setValue('title', issue.title);
      setValue('description', issue.description);
      setValue('priority', issue.priority);
    }
  }, [issue, setValue]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (issueData: FormData) => {
      if (issue) {
        return axios.patch(`/api/issues/${issue.id}`, issueData);
      } else {
        return axios.post('/api/issues', issueData);
      }
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      if (socket) {
        handleSendNotification({
          id: data.id,
          title: 'New Issue',
          message: `${session?.user?.name} have  created a new issue ${data.title}`,
          type: 'issue',
          read: false,
          senderId: session?.user?.id,
          userId: 'cm9zm65va0001i0lt3fx37yl6',
          createdAt: Date.now().toString()
        })
      }
      setLoading(false);
      toast.success(`Issue ${issue ? 'updated' : 'created'} successfully`);
      router.push('/issues');
      router.refresh();

    },
    onError: (error) => {
      if (error instanceof Error) {
        console.log(error.message);
        setLoading(false);
      }
    },
  });

  const onSubmit = (data: IssueForm) => {
    const images: File[] = methods.getValues('images') || [];
    const storageType: string = methods.getValues('storageType') || 's3';
    const assignDate: string | null = methods.getValues('assignDate') || null;
    const deadlineDate: string | null = methods.getValues('deadlineDate') || null;

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('priority', data.priority);
    formData.append('storageType', storageType);
    if (assignDate) formData.append('assignDate', assignDate);
    if (deadlineDate) formData.append('deadlineDate', deadlineDate);

    if (session?.user?.id) {
      formData.append('user_id', String(session.user.id));
    }

    images.forEach((image) => {
      formData.append('images', image);
    });

    setLoading(true);

    mutation.mutate(formData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-8">
          <Card className="col-span-5">
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
                  <Input id="name" {...register('title')} type="text" className="w-full mb-3" />
                  {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <SimpleMDEEditor id="description" {...field} className="dark:bg-black" />
                    )}
                  />
                  {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Due Date</CardTitle>
              <CardDescription>Select a due date for the issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select id="priority" {...register('priority')} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="lowest">Lowest</option>
                </select>
                {errors.priority && <ErrorMessage>{errors.priority.message}</ErrorMessage>}
              </div>
              {issue && <AssignDate assignedDate={issue?.assignedDate} deadlineDate={issue?.deadlineDate} />}
            </CardContent>
          </Card>
        </div>
        <MultiImageUpload issueImages={issue?.issueImages} />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{issue ? 'Update Issue' : 'Add Issue'}{loading && <Spinner />}</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default IssueFormComponent;
