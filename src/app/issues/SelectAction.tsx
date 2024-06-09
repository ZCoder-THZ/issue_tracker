'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SelectAction({ issue }: { issue: any }) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['devs'],
    queryFn: () => axios.get('/api/devs').then((res) => res.data.users),
  });

  const assignUserMutation = useMutation({
    mutationFn: (issueData: { user_id: string }) => {
      return axios.patch(`/api/issues/${issue?.id}`, issueData);
    },
    onSuccess: (resData) => {
      toast.success('User assigned successfully');
      router.refresh();
    },
    onError: (error) => {
      toast.error('Failed to assign user');
      console.error(error);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (statusData: { status: string }) => {
      return axios.patch(`/api/issues/${issue?.id}`, statusData);
    },
    onSuccess: (resData) => {
      toast.success('Status updated successfully');
      router.refresh();
    },
    onError: (error) => {
      toast.error('Failed to update status');
      console.error(error);
    },
  });

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
  };

  useEffect(() => {
    if (selectedUserId) {
      assignUserMutation.mutate({ user_id: selectedUserId });
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedStatus) {
      updateStatusMutation.mutate({ status: selectedStatus });
    }
  }, [selectedStatus]);

  return (
    <Card x-chunk="dashboard-07-chunk-3">
      <CardHeader>
        <CardTitle>Assign Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="users">Users</Label>
            <Select
              onValueChange={handleUserSelect}
              {...(issue?.assignedToUserId && {
                defaultValue: issue.assignedToUserId,
              })}
            >
              <SelectTrigger id="users" aria-label="Select user">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={handleStatusSelect}
              defaultValue={issue?.status}
            >
              <SelectTrigger id="status" aria-label="Select status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Active</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SelectAction;
