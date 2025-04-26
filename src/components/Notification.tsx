// components/NotificationDropdown.tsx
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';

import Link from 'next/link';

export default function NotificationDropdown() {


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
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
      <DropdownMenuContent className="w-96 max-h-[80vh] overflow-y-auto" align="end">
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

        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-muted-foreground justify-center py-4">
            No notifications
          </DropdownMenuItem>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start gap-1 py-3 ${!notification.read ? 'bg-accent/50' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex justify-between w-full">
                <span className="font-medium">{notification.title}</span>
                {!notification.read && (
                  <span className="text-xs text-primary">New</span>
                )}
              </div>
              <p className="text-sm">{notification.message}</p>

              {notification.issue && (
                <Link
                  href={`/issues/${notification.issue.id}`}
                  className="text-xs text-primary hover:underline mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Issue: {notification.issue.title}
                </Link>
              )}

              <div className="text-xs text-muted-foreground mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}