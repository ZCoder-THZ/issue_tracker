"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRole } from "@/lib/utils"

import { toast } from "react-toastify"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type Developer = {
  id: string
  name: string
  email: string
  role: string | number
}

interface ColumnProps {
  handleRoleChange: (id: string, role: string) => void
  handleSendNotification: (params: {
    id: number
    userId: string
    title: string
    message: string
    type: string
    read: boolean
    senderId?: string
    createdAt: string
  }) => void
  sessionUserId?: string
  sessionUserRole?: number
}

export const getColumns = ({
  handleRoleChange,
  handleSendNotification,
  sessionUserId,
  sessionUserRole
}: ColumnProps): ColumnDef<Developer>[] => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const dev = row.original;

        // Only show actions if current user is Admin (role 2) and not editing themselves
        const showActions = sessionUserRole === 2 && sessionUserId !== dev.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={!showActions}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {showActions && (
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(dev.id);
                    toast.success('Copied!');
                  }}
                >
                  Copy developer ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/devs/${dev.id}`}>View customer</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const dev = row.original;
        const roleValue = String(dev.role ?? "0");

        const canEditRole = sessionUserRole === 2 && sessionUserId !== dev.id;

        return (
          <div>
            {canEditRole ? (
              <Select
                value={roleValue}
                onValueChange={(value) => {
                  try {
                    handleSendNotification({
                      id: Math.random() ** 2,
                      userId: dev.id,
                      title: "Role Promoting",
                      message: `Your role changed to ${getRole(value)}`,
                      type: "role_change",
                      read: false,
                      senderId: sessionUserId,
                      createdAt: new Date().toISOString(),
                    });
                    handleRoleChange(dev.id, value);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder={getRole(roleValue)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tester</SelectItem>
                  <SelectItem value="1">Developer</SelectItem>
                  <SelectItem value="2">Admin</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div>{getRole(roleValue)}</div>
            )}
          </div>
        );
      },
    }
  ]