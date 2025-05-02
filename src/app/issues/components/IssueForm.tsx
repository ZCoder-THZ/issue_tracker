'use client';
import { Controller, FormProvider } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { IssueFormComponentProps, IssueForm, PatchIssueForm } from '@/types/issues'
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssignedDates } from '../DatePicker';
import SimpleMDEEditor from 'react-simplemde-editor';
import MultiImageUpload from '../new/imageUpload';
import 'easymde/dist/easymde.min.css';
import { useIssueForm } from '@/hooks/useIssueForm';
import {
  useDevs
} from '@/hooks/useDevs'
import { useIssueFormSubmit } from '@/hooks/useIssueFormSubmit'


const IssueFormComponent: React.FC<IssueFormComponentProps> = ({ issue }) => {
  const { data: session } = useSession();
  const methods = useIssueForm(
    issue,

  )
  console.log(issue);
  const { data: users } = useDevs();
  const mutation = useIssueFormSubmit(issue);


  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty, errors },
    getValues,
    setValue
  } = methods;





  const onSubmit = (data: IssueForm | PatchIssueForm) => {


    const images: File[] = getValues('images') || [];
    const storageType: string = getValues('storageType') || 's3';
    const assignedDate: string | null = getValues('assignedDate') ?? null;
    const deadlineDate: string | null = getValues('deadlineDate') ?? null;

    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.priority) formData.append('priority', data.priority);
    if (storageType) formData.append('storageType', storageType);
    if (assignedDate) formData.append('assignedDate', assignedDate);
    if (deadlineDate) formData.append('deadlineDate', deadlineDate);
    if (session?.user?.id) formData.append('user_id', session.user.id);
    if (data.assignedToUserId) formData.append('assignedToUserId', data.assignedToUserId);
    if (data.status) formData.append('status', data.status);
    images.forEach((image) => {
      formData.append('images', image);

    });
    mutation.mutate(formData);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>} */}
        <div className="grid gap-6 md:grid-cols-8">
          <Card className="col-span-1 md:col-span-5 w-full">

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

          <Card className="col-span-1 md:col-span-3 w-full">

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
                issue && <AssignedDates
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
                    {errors.assignedToUserId && <ErrorMessage>{errors.assignedToUserId.message}</ErrorMessage>}
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

        <MultiImageUpload />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isPending || !isDirty}
            onClick={
              () => {
                try {

                  handleSubmit(onSubmit)();
                } catch (error) {
                  console.log(error);
                }
              }
            }
          >
            {issue ? 'Update Issue' : 'Add Issue'}
            {mutation.isPending && <Spinner />}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default IssueFormComponent;