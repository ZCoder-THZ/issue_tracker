import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema, patchIssueSchema } from '@/lib/schemas/issueFormSchema';
import { IssueForm, PatchIssueForm } from '@/types/issues';

export const useIssueForm = (issue?: IssueForm | PatchIssueForm | null): UseFormReturn<IssueForm | PatchIssueForm> => {
    const schema = issue?.id ? patchIssueSchema : createIssueSchema;

    // Inline debug resolver
    const debugResolver = (() => {
        const base = zodResolver(schema);
        return async (data: any, context: any, options: any) => {
            console.log('%c[DEBUG] Incoming form data:', 'color: blue;', data);
            const result = await base(data, context, options);
            console.log('%c[DEBUG] Validation result:', 'color: green;', result);
            return result;
        };
    })();

    const methods = useForm<IssueForm | PatchIssueForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: issue?.title ?? '',
            description: issue?.description ?? '',
            priority: issue?.priority ?? 'low',
            assignedToUserId: issue?.assignedToUserId ?? null,
            assignedDate: issue?.assignedDate ?? null,
            deadlineDate: issue?.deadlineDate ?? null,
            status: issue?.status ?? 'OPEN',
            images: issue?.images ?? [],
            storageType: issue?.storageType ?? 's3',
        },
    });

    return methods;
};
