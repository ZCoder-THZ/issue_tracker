'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-toastify';
import { Button } from '@radix-ui/themes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function DeleteIssue({ issueId }: { issueId: number }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const deleteIssueMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/issues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      router.refresh();
      toast.success('Issue deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete issue');
      console.log(error);
    },
  });

  if (!isClient) {
    return null;
  }

  const handleDelete = () => {
    deleteIssueMutation.mutate(issueId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button color="crimson" variant="soft">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the issue
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteIssue;
