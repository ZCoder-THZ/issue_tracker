import { z } from 'zod';
import { createIssueSchema, patchIssueSchema } from '@/lib/schemas/issueFormSchema';
import { User } from './user';
export type IssueForm = z.infer<typeof createIssueSchema>;

export interface Issue {
    id: number;
    title: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    priority: "low" | "medium" | "high";
    assignedDate: Date | null;
    deadlineDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    assignedToUserId: string | null;
    user: User;
    assignedToUser: User | null;
}
export interface IssueFormComponentProps {
    issue?: (IssueForm | PatchIssueForm) & {
        title?: string;
        id?: number;
        images?: {
            id: number;
            imageUrl: string;
        }[];
    } | null;
}


export type PatchIssueForm = z.infer<typeof patchIssueSchema>;