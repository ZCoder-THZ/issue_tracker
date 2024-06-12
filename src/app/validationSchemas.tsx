import { optional, z } from 'zod';

export const createIssueSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(255),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(255),
  assignedToUserId: z
    .string()
    .min(1, { message: 'Assigned User is required' })
    .max(255)
    .optional()
    .nullable(),
  priority: z.enum(['high', 'medium', 'low', 'lowest']).optional(),
});
export const patchIssueSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255).optional(),
  description: z
    .string()
    .min(1, 'Description is required.')
    .max(65535)
    .optional(),
  assignedToUserId: z
    .string()
    .min(1, 'AssignedToUserId is required.')
    .max(255)
    .optional()
    .nullable(),
  priority: z.enum(['high', 'medium', 'low', 'lowest']).optional(),
});
