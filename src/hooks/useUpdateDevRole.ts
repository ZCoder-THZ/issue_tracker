
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

type RoleUpdate = { id: string; role: string };

export function useUpdateDevRole() {
    const qc = useQueryClient();
    const router = useRouter();

    return useMutation<void, Error, RoleUpdate>({
        mutationFn: ({ id, role }) =>
            axios.patch('/api/devs', { id, role }).then(r => r.data),
        onSuccess: () => {
            qc.invalidateQueries({});
            toast.success('Role updated successfully');
            router.refresh();
        },
        onError: (err) => {
            console.error(err);
            toast.error('Failed to update role');
        },
    });
}
