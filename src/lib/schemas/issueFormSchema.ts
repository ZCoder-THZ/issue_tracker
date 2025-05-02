import { z } from 'zod';
export const createIssueSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    description: z.string().min(1, { message: 'Description is required' }).max(65535),
    assignedToUserId: z.string().nullable().optional(),
    priority: z.enum(['high', 'medium', 'low', 'lowest']).default('low'),
    images: z.array(z.any()),
    storageType: z.string().default('s3'),
    assignedDate: z.string().nullable().optional(),
    deadlineDate: z.string().nullable().optional(),
    status: z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS']).default('OPEN'),
});
export const patchIssueSchema = createIssueSchema.extend({
    id: z.number()
}).partial();

