import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema, patchIssueSchema } from '@/lib/schemas/issueFormSchema';
import { PatchIssueForm, CreateIssueForm } from '@/lib/schemas/issueFormSchema';


export const useIssueForm = (existingIssue?: PatchIssueForm) => {
    const isEditMode = !!existingIssue;
    const schema = existingIssue ? patchIssueSchema : createIssueSchema;

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
    return useForm<CreateIssueForm | PatchIssueForm>({
        // resolver: zodResolver(isEditMode ? patchIssueSchema : createIssueSchema),
        resolver: debugResolver,

        defaultValues: isEditMode
            ? existingIssue
            : {
                title: '',
                description: '',
                priority: 'medium',
                status: 'OPEN',
                assignedToUserId: null,
                assignedDate: null,
                deadlineDate: null,
                images: [],
                storageType: 'cloudinary'
            }
    });
};
