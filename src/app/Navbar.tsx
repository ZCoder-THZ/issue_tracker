'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircleUser, Menu, Package2, Bell, Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import classnames from 'classnames';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Skeleton from 'react-loading-skeleton';
import DarkMode from '@/components/DarkMode';
import { useSocketStore } from '@/stores/socketStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

import useNotification from '@/hooks/useNotification';

const links = [
  {
    name: 'Dashboard',
    href: '/',
  },
  {
    name: 'Issues',
    href: '/issues',
  },
  {
    name: 'Devs',
    href: '/devs',
  },
];


export default function Dashboard() {
  const { status, data: session } = useSession();
  const currentPath = usePathname();
  const { socket } = useSocketStore();
  const { notifications, getNotifications, markAsRead, markAllAsRead, unreadCount, } = useNotification()

  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    console.log(session, 'session')
    getNotifications()

  }, [socket, session]);





  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <header className="sticky top-0 container mx-auto p-4 flex h-16 items-center gap-4 md:px-6 w-full max-w-[1800px]">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="hidden sm:inline-block">Acme Inc</span>
          </Link>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={classnames(
                "transition-colors hover:text-foreground",
                {
                  'text-muted-foreground': currentPath !== link.href,
                  'text-foreground font-medium': currentPath === link.href,
                }
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span>Acme Inc</span>
              </Link>
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={classnames(
                    "hover:text-foreground transition-colors",
                    {
                      'text-muted-foreground': currentPath !== link.href,
                      'text-foreground': currentPath === link.href,
                    }
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:gap-2 lg:gap-4">
          {status === 'authenticated' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-[80vh] overflow-y-auto" align="end">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={classnames(
                        "flex flex-col items-start gap-1 py-3",
                        { "bg-accent/50": !notification.read }
                      )}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex justify-between w-full">
                        <span className="font-medium">{notification.title}</span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <span className="text-xs text-primary">New</span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      {notification.issue && (
                        <Link
                          href={`/issues/${notification.issue.id}`}
                          className="text-xs text-primary hover:underline mt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Issue: {notification.issue.title}
                        </Link>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="text-muted-foreground justify-center py-4">
                    No notifications
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center justify-center">
                  <Button variant="ghost" asChild>
                    <Link href="/notifications">View all notifications</Link>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DarkMode />

          {status === 'loading' ? (
            <div className="h-8 w-8 rounded-full">
              <Skeleton circle height={32} width={32} />
            </div>
          ) : status === 'authenticated' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  {session?.user?.image ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <CircleUser className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout" className="w-full">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link href="/api/auth/signin">Login</Link>
            </Button>
          )}
        </div>
      </header>
    </div>
  );
}