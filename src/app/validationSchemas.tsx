import { z } from 'zod';

// Schema definitions
export const createIssueSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(255),
  description: z.string().min(1, { message: 'Description is required' }).max(65535),
  assignedToUserId: z.string().min(1, { message: 'Assigned User is required' }).max(255).optional().nullable(),
  priority: z.enum(['high', 'medium', 'low', 'lowest']).optional(),
  images: z.any().optional(), // For file uploads
  storageType: z.string().optional().default('s3'),
  assignedDate: z.string().optional().nullable(),
  deadlineDate: z.string().optional().nullable(),
  status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS']).optional()
});

export const patchIssueSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255).optional(),
  description: z.string().min(1, 'Description is required.').max(65535).optional(),
  assignedToUserId: z.string().min(1, 'AssignedToUserId is required.').max(255).optional().nullable(),
  priority: z.enum(['high', 'medium', 'low', 'lowest']).optional(),
  images: z.any().optional(),
  storageType: z.string().optional(),
  assignedDate: z.string().optional().nullable(),
  deadlineDate: z.string().optional().nullable(),
  status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS']).optional()
});

// Type definitions
type IssueForm = z.infer<typeof createIssueSchema>;
type PatchIssueForm = z.infer<typeof patchIssueSchema>;

interface IssueFormComponentProps {
  issue?: {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low' | 'lowest';
    assignedDate?: string | null;
    deadlineDate?: string | null;
    assignedToUserId?: string | null;
    status?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
    issueImages?: { id: number; imageUrl: string }[];
  } | null;
}

// In your component
const IssueFormComponent: React.FC<IssueFormComponentProps> = ({ issue }) => {
  // Use the appropriate schema based on whether it's a new issue or existing one
  const schema = issue ? patchIssueSchema : createIssueSchema;

  const methods = useForm<IssueForm | PatchIssueForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'low',
      assignedToUserId: issue?.assignedToUserId || null,
      status: issue?.status || 'OPEN',
      storageType: 's3'
    },
  });

  const onSubmit = (data: IssueForm | PatchIssueForm) => {
    const formData = new FormData();

    // Append all fields that exist in the data
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.priority) formData.append('priority', data.priority);
    if (data.assignedToUserId) formData.append('assignedToUserId', data.assignedToUserId);
    if (data.status) formData.append('status', data.status);

    // Handle file uploads
    const images: File[] = methods.getValues('images') || [];
    images.forEach((image) => {
      formData.append('images', image);
    });

    // Append other optional fields
    const storageType = methods.getValues('storageType') || 's3';
    formData.append('storageType', storageType);

    const assignedDate = methods.getValues('assignedDate');
    if (assignedDate) formData.append('assignedDate', assignedDate);

    const deadlineDate = methods.getValues('deadlineDate');
    if (deadlineDate) formData.append('deadlineDate', deadlineDate);

    // Submit logic...
  };

  // Rest of your component...
};