import { z } from 'zod';


export const createIssueSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
    assignedToUserId: z.string().nullable(),
    assignedDate: z
        .preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date().nullable()),
    deadlineDate: z
        .preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date().nullable()),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']),
    images: z.array(
        z.object({
            id: z.number(),
            imageUrl: z.string().url(),
        })
    ),
    storageType: z.enum(['s3', 'local']),
});

export const patchIssueSchema = createIssueSchema.extend(
    {
        id: z.number(),
    }
).partial(); // or replicate with optional fields
