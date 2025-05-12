
import { useMutation, QueryClient } from "@tanstack/react-query";
import useNotification from "./useNotification";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocketStore } from "@/stores/socketIo/socketStore";

export const useIssueFormSubmit = (issue: any | undefined) => {
    const router = useRouter();
    const queryClient = new QueryClient();
    const { handleSendNotification } = useNotification();
    const { data: session } = useSession();
    const socket = useSocketStore((state) => state.socket);
    const mutation = useMutation({
        mutationFn: (formData: FormData) => {
            if (issue) {
                return axios.patch(`/api/issues/${issue.id}`, formData);
            } else {
                return axios.post('/api/issues', formData);
            }
        },
        onSuccess: ({ data }) => {


            queryClient.invalidateQueries({ queryKey: ['issues'] });

            if (socket && session?.user) {
                handleSendNotification({

                    title: issue ? 'Issue Updated' : 'New Issue',
                    message: `${session.user.name} ${issue ? 'updated' : 'created'} an issue `,
                    type: 'issue_creation',

                    senderId: session.user.id,
                    userId: data.assignedToUserId || 'default-user-id',
                    issueId: issue ? issue.id : data.issue.id
                });
            }


            toast.success(`Issue ${issue ? 'updated' : 'created'} successfully`);
            router.push('/issues');
            router.refresh();
        },
        onError: (error) => {
            console.log(error);

        },
    });
    return mutation
}