'use client';
import * as React from 'react';
import { useSession } from 'next-auth/react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useNotification from '@/hooks/useNotification';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';

import { getColumns } from './columns';
import { useDevs } from '@/hooks/useDevs';
import { useUpdateDevRole } from '@/hooks/useUpdateDevRole';

export const dynamic = 'force-dynamic';

export default function DataTableDemo() {
  const { data: session } = useSession();
  const { data: users, isLoading } = useDevs();
  const updateRole = useUpdateDevRole();
  const { handleSendNotification } = useNotification();

  const handleRoleChange = (id: string, role: string) => {
    updateRole.mutate({ id, role });
  };

  const columns = getColumns({ handleRoleChange, handleSendNotification, sessionUserId: session?.user?.id });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: users ?? [],
    columns:
      session?.user?.role === 2
        ? columns
        : columns.filter((c) => c.id !== 'actions'),
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      {/* — filter & column toggles — */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter emails…"
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={e => table.getColumn('email')?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter(c => c.getCanHide()).map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={v => col.toggleVisibility(!!v)}
                  className="capitalize"
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            value={(table.getColumn('role')?.getFilterValue() as string) ?? '0'}
            onValueChange={val => table.getColumn('role')?.setFilterValue(val)}

          >
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Roles</SelectItem>
              <SelectItem value="1">Tester</SelectItem>
              <SelectItem value="2">Developer</SelectItem>
              <SelectItem value="3">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* — data table — */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(h => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading…
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* — pagination — */}
      <div className="flex justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
