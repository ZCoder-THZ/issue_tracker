"use client";

import { useEffect } from "react";
import { useSocketStore } from "@/stores/socketIo/socketStore";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import Link from "next/link";
import { Bell, BellRing, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/socketIo/notificationStore";
function NotificationPage() {
    const { notifications } = useNotificationStore();
    const {

        markAsRead,
        markAllAsRead,
    } = useNotification();

    const unreadCount = notifications.filter(n => !n.read).length;
    console.log(notifications)

    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Card className="p-6 shadow-md dark:bg-gray-900">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bell className="w-7 h-7 text-primary" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold dark:text-gray-100">Notifications</h1>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="dark:text-gray-300 dark:hover:text-white dark:border-gray-700"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Mark all as read
                        </Button>
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                        <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800">
                            <BellRing className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium dark:text-gray-100">No notifications yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md dark:text-gray-400">
                            When you get notifications, they will appear here. Stay tuned for updates!
                        </p>
                    </div>
                ) : (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-6 dark:bg-gray-800">
                            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                            <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {renderNotifications(notifications, markAsRead)}
                        </TabsContent>

                        <TabsContent value="unread" className="space-y-4">
                            {unreadNotifications.length > 0 ?
                                renderNotifications(unreadNotifications, markAsRead) :
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No unread notifications</div>
                            }
                        </TabsContent>

                        <TabsContent value="read" className="space-y-4">
                            {readNotifications.length > 0 ?
                                renderNotifications(readNotifications, markAsRead) :
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No read notifications</div>
                            }
                        </TabsContent>
                    </Tabs>
                )}
            </Card>
        </div>
    );
}


function renderNotifications(notificationList: any, markAsRead: any) {
    return (
        <div className="space-y-3">
            {notificationList.map((notification: any) => (
                <div
                    key={notification.id}
                    className={cn(
                        "p-4 rounded-lg border transition-all hover:shadow-md",
                        !notification.read
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    )}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className={cn(
                                    "font-medium",
                                    !notification.read ? "text-blue-700 dark:text-blue-400" : "dark:text-gray-200"
                                )}>
                                    {notification.title}
                                </h3>
                                {!notification.read && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                                {
                                    notification?.issueId && (
                                        <Link
                                            href={`/issues/${notification.issueId}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            View Issue
                                        </Link>
                                    )
                                }
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {new Date(notification.createdAt).toLocaleString()}
                            </p>
                        </div>

                        {!notification.read && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                onClick={() => markAsRead(notification.id)}
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default NotificationPage;