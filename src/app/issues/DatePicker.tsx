'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useFormContext } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  label: string;
  name: string;
  defaultValue?: Date; // Allow default value
}

const DatePicker = ({ label, name, defaultValue }: DatePickerProps) => {
  const { setValue, watch } = useFormContext();
  const date = watch(name) || defaultValue; // Use default if not set

  const handleSelectDate = (selectedDate: Date | undefined) => {
    setValue(name, selectedDate); // Update form field value
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(new Date(date), 'PPP') : <span>Pick a Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={handleSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default function AssignDates({
  assignedDate,
  deadlineDate,
}: {
  assignedDate?: Date;
  deadlineDate?: Date;
}) {
  return (
    <div className="flex flex-col gap-4">
      <DatePicker label="Assign Date" name="assignDate" defaultValue={assignedDate} />
      <DatePicker label="Deadline Date" name="deadlineDate" defaultValue={deadlineDate} />
    </div>
  );
}
