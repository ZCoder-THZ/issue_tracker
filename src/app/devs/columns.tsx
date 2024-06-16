'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { getRole } from '@/lib/utils';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export type Dev = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
};

interface ColumnsComponentProps {
  handleRoleChange: (id: string, role: string) => void;
}

export const ColumnsComponent: React.FC<ColumnsComponentProps> = ({
  handleRoleChange,
}) => {
  const columns: ColumnDef<Dev>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link href={`/devs/${row.getValue('id')}`}>{row.getValue('id')}</Link>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link href={`/devs/${row.getValue('id')}`}>{row.getValue('name')}</Link>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'role',
      accessorFn: (row) => row.role,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{getRole(row.getValue('role'))}</div>
      ),
    },
    {
      accessorKey: 'image',
      header: 'User Image',
      cell: ({ row }) => (
        <div className="h-10 w-10 rounded-full">
          {row.getValue('image') ? (
            <Image
              src={row.getValue('image')}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : null}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const devs = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(devs.id);
                  toast.success('Copied!');
                }}
              >
                Copy developer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/devs/${row.getValue('id')}`}>View customer</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: 'role_actions',
      enableHiding: false,
      cell: ({ row }) => {
        const devs = row.original;

        return (
          <Select onValueChange={(value) => handleRoleChange(devs.id, value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tester</SelectItem>
              <SelectItem value="1">Developer</SelectItem>
              <SelectItem value="2">Admin</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
  ];

  return { columns };
};
