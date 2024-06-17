'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

function Notification({ userId }) {
  const { data, isLoading } = useQuery({
    queryKey: [`notifications`, userId],
    queryFn: fetchNotifications,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
  console.log(data);
  async function fetchNotifications() {
    const response = await axios.get('/api/profile/notifications/' + userId);
    return response.data.notifications;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="relative rounded-full"
        >
          <Bell />

          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {isLoading ? 0 : data?.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data?.map((item) => (
          <DropdownMenuItem key={item.id}>{item.message}</DropdownMenuItem>
        ))}{' '}
        {/* {data?.map((item) => (
          <DropdownMenuItem key={item.id}>{item.title}</DropdownMenuItem>
        ))} */}
        <DropdownMenuSeparator />
        <DropdownMenuItem></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Notification;
