import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/lib/schemas/issueFormSchema';
import { IssueForm, PatchIssueForm } from '@/types/issues';

export const useIssueForm = (issue?: IssueForm | PatchIssueForm | null) => {

    const methods = useForm<IssueForm | PatchIssueForm>({
        resolver: zodResolver(createIssueSchema),
        defaultValues: {

            title: issue?.title ?? '',
            description: issue?.description ?? '',
            priority: issue?.priority ?? 'low',
            assignedToUserId: issue?.assignedToUserId ?? null,
            assignedDate: issue?.assignedDate ?? null,
            deadlineDate: issue?.deadlineDate ?? null,
            status: issue?.status ?? 'OPEN',
            images: issue?.images ?? [], // existing images should be handled separately
            storageType: issue?.storageType ?? 's3',
        }
    });

    // Remove the useEffect that resets the form when issue changes
    // This was causing the form to reset and lose user input

    return methods;
};