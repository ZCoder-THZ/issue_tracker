'use client';

import { useEffect } from 'react';
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { useSocketStore } from '@/stores/socketStore';
import useNotification from '@/hooks/useNotification';

import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

import SimpleMDEEditor from 'react-simplemde-editor';
import MultiImageUpload from './new/imageUpload';

import 'easymde/dist/easymde.min.css';

const createIssueSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(255),
  description: z.string().min(1, { message: 'Description is required' }).max(65535),
  assignedToUserId: z.string().min(1, { message: 'Assigned User is required' }).max(255).optional().nullable(),
  priority: z.enum(['high', 'medium', 'low', 'lowest']).optional(),
  images: z.any().optional(),
  storageType: z.string().optional().default('s3'),
  assignDate: z.string().optional().nullable(),
  deadlineDate: z.string().optional().nullable(),
  status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS']).optional(),
});

const patchIssueSchema = createIssueSchema.partial();

type IssueForm = z.infer<typeof createIssueSchema>;
type PatchIssueForm = z.infer<typeof patchIssueSchema>;

interface IssueFormComponentProps {
  issue?: {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low' | 'lowest';
    assignedDate?: string | null | undefined;
    deadlineDate?: string | null | undefined;
    assignedToUserId?: string | null;
    status?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
    issueImages?: { id: number; imageUrl: string }[];
  } | null;
}

interface DatePickerProps {
  label: string;
  name: string;
  defaultValue?: string | null;
}

const DatePicker = ({ label, name, defaultValue }: DatePickerProps) => {
  const { setValue, watch } = useFormContext();
  const dateValue = watch(name);
  const date = dateValue ? new Date(dateValue) : defaultValue ? new Date(defaultValue) : undefined;

  const handleSelectDate = (selectedDate: Date | undefined) => {
    setValue(name, selectedDate?.toISOString() || null);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const AssignDates = ({
  assignedDate,
  deadlineDate,
}: {
  assignedDate?: string | null;
  deadlineDate?: string | null;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <DatePicker label="Assign Date" name="assignDate" defaultValue={assignedDate} />
      <DatePicker label="Deadline Date" name="deadlineDate" defaultValue={deadlineDate} />
    </div>
  );
};

const IssueFormComponent: React.FC<IssueFormComponentProps> = ({ issue }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { socket } = useSocketStore();
  const { handleSendNotification } = useNotification();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['devs'],
    queryFn: () => axios.get('/api/devs').then((res) => res.data.users),
  });

  const methods = useForm<IssueForm | PatchIssueForm>({
    resolver: zodResolver(issue ? patchIssueSchema : createIssueSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'low',
      assignedToUserId: issue?.assignedToUserId || undefined,
      status: issue?.status || 'OPEN',
      storageType: 's3',
      assignDate: issue?.assignedDate || null,
      deadlineDate: issue?.deadlineDate || null
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    getValues,
  } = methods;

  useEffect(() => {
    if (issue) {
      setValue('title', issue.title);
      setValue('description', issue.description);
      setValue('priority', issue.priority);
      setValue('assignedToUserId', issue.assignedToUserId || undefined);
      setValue('status', issue.status || 'OPEN');
      setValue('assignDate', issue.assignedDate || null);
      setValue('deadlineDate', issue.deadlineDate || null);
    }
  }, [issue, setValue]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (issue) {
        return axios.patch(`/api/issues/${issue.id}`, formData);
      } else {
        return axios.post('/api/issues', formData);
      }
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });

      if (socket && session?.user) {
        handleSendNotification({
          id: data.id,
          title: issue ? 'Issue Updated' : 'New Issue',
          message: `${session.user.name} ${issue ? 'updated' : 'created'} an issue: ${data.title}`,
          type: 'issue_creation',
          read: false,
          senderId: session.user.id,
          userId: data.assignedToUserId || 'default-user-id',
          createdAt: new Date().toISOString(),
        });
      }

      toast.success(`Issue ${issue ? 'updated' : 'created'} successfully`);
      router.push('/issues');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    },
  });

  const onSubmit = (data: IssueForm | PatchIssueForm) => {
    const images: File[] = getValues('images') || [];
    const storageType: string = getValues('storageType') || 's3';
    const assignDate: string | null = getValues('assignDate') ?? null;
    const deadlineDate: string | null = getValues('deadlineDate') ?? null;

    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.priority) formData.append('priority', data.priority);
    if (storageType) formData.append('storageType', storageType);
    if (assignDate) formData.append('assignDate', assignDate);
    if (deadlineDate) formData.append('deadlineDate', deadlineDate);
    if (session?.user?.id) formData.append('user_id', session.user.id);
    if (data.assignedToUserId) formData.append('assignedToUserId', data.assignedToUserId);
    if (data.status) formData.append('status', data.status);
    images.forEach((image) => formData.append('images', image));

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
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register('title')} />
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
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="lowest">Lowest</option>
                </select>
                {errors.priority && <ErrorMessage>{errors.priority.message}</ErrorMessage>}
              </div>

              {
                issue && <AssignDates
                  assignedDate={issue?.assignedDate}
                  deadlineDate={issue?.deadlineDate}
                />
              }

              {issue && (
                <>
                  <div>
                    <Label htmlFor="users">Assign User</Label>
                    <Controller
                      name="assignedToUserId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger id="users">
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users?.map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || 'OPEN'}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Active</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <MultiImageUpload issueImages={issue?.issueImages} />

        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {issue ? 'Update Issue' : 'Add Issue'}
            {mutation.isPending && <Spinner />}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default IssueFormComponent;