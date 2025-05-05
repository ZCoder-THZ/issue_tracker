import { z } from 'zod';

// Base schema with common fields
const issueBaseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
    assignedToUserId: z.string().nullable(),
    assignedDate: z.preprocess(
        (val) => (typeof val === 'string' ? new Date(val) : val),
        z.date().nullable()
    ),
    deadlineDate: z.preprocess(
        (val) => (typeof val === 'string' ? new Date(val) : val),
        z.date().nullable()
    ),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']),
    images: z.array(
        z.object({
            id: z.number(),
            imageUrl: z.string().url(),
        })
    ),
    storageType: z.enum(['s3', 'local']),
});

// Create schema - doesn't include id
export const createIssueSchema = issueBaseSchema;

// Patch schema - includes id and makes all fields optional
export const patchIssueSchema = issueBaseSchema.extend({
    id: z.number()
}).partial();

// Type definitions
export type CreateIssueForm = z.infer<typeof createIssueSchema>;
export type PatchIssueForm = z.infer<typeof patchIssueSchema>;

// Hook implementation
