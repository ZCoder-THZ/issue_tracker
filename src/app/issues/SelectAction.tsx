'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// app/dashboard/[id]/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import IssueBadge from '@/components/Status';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery, QueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@radix-ui/themes';
function SelectAction({ issue }: { issue: any }) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState(null); // State to manage the selected user ID
  const { data, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then((res) => res.data.users),
  });

  const mutation = useMutation({
    mutationFn: (issueData: { user_id: String }) => {
      return axios.patch(`/api/issues/${issue?.id}`, issueData);
    },
    onSuccess: (resData) => {
      console.log(resData);
      toast.success('Assigned  successfully');
      router.refresh();
    },
    onError: (error) => {
      // Handle error
      console.log(error);
    },
  });

  const handleUserSelect = (userId: String) => {
    setSelectedUserId(userId); // Update the selected user ID
  };

  const handleSubmit = () => {
    console.log(selectedUserId);
    mutation.mutate({
      selectedUserId,
    });
  };

  return (
    <Card x-chunk="dashboard-07-chunk-3 ">
      <CardHeader>
        <CardTitle>Assign Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Users</Label>
            <Select onValueChange={handleUserSelect}>
              <SelectTrigger id="status" aria-label="Select user">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {data?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>Submit</Button>{' '}
          {/* Add a button to trigger the mutation */}
        </div>
      </CardContent>
    </Card>
  );
}

export default SelectAction;
