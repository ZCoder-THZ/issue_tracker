'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FilterComponent = ({ selectedStatus }: { selectedStatus: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={selectedStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] mb-1 bg-blue-500 text-white">
        <SelectValue placeholder="Filter by Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All</SelectItem>
        <SelectItem value="OPEN">Open</SelectItem>
        <SelectItem value="CLOSED">Closed</SelectItem>
        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterComponent;
