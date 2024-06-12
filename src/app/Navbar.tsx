'use client';
import React from 'react';
import Link from 'next/link';
import { CircleUser, Menu, Package2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import classnames from 'classnames';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Skeleton from 'react-loading-skeleton';
import DarkMode from '@/components/DarkMode';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

  return (
    <div className="border-b">
      <header className="sticky  top-0 flex h-16 items-center gap-4  px-10 md:px-10 mx-auto w-full max-w">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={classnames({
                'text-muted-foreground hover:text-foreground':
                  currentPath !== link.href,
                'text-foreground hover:text-muted-foreground':
                  currentPath === link.href,
              })}
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
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={classnames({
                    'text-muted-foreground hover:text-foreground':
                      currentPath !== link.href,
                    'text-foreground hover:text-muted-foreground':
                      currentPath === link.href,
                  })}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          {status === 'loading' ? (
            <div className="h-30 w-40 rounded-full">
              <Skeleton />
            </div>
          ) : status === 'authenticated' ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    {session?.user?.image ? (
                      <Avatar>
                        <AvatarImage src={session?.user?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    ) : (
                      <CircleUser className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/api/auth/signout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
          <DarkMode />
        </div>
      </header>
    </div>
  );
}
