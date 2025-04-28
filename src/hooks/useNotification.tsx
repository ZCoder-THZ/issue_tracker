
"use client"

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/stores/socketStore';
import { toast } from "react-toastify";

interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    userId: string,
    senderId: string,
    createdAt: string;
    type?: string;
}
function useNotification() {
    const socket = useSocketStore((state) => state.socket);
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);


    const getNotifications = () => {
        if (!socket || !session?.user?.id) return;
        socket.emit('get-notifications', (response: { success: boolean; notifications: Notification[] }) => {
            if (response.success) {
                setNotifications(response.notifications);
                setUnreadCount(response.notifications.filter(n => !n.read).length);
            }
        });
    }
    const handleSendNotification = (data: Notification) => {
        try {
            socket?.emit("send-admin-notification", data);
            toast.success("Test notification sent");
        } catch (error) {
            toast.error("Failed to send notification");
        }
    };

    const markAsRead = (notificationId: string) => {
        socket?.emit(
            "mark-as-read",
            notificationId,
            (response: { success: boolean }) => {
                if (response.success) {
                    setNotifications((prev) =>
                        prev.map((n) =>
                            n.id === notificationId ? { ...n, read: true } : n,
                        ),
                    );
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }
            },
        );
    };
    const markAllAsRead = () => {
        if (!socket || !session?.user?.id) return;

        socket.emit("mark-all-read", (response: { success: boolean }) => {
            if (response.success) {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
                setUnreadCount(0);
            }
        });
    };
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
        };

        socket.on("new-notification", handleNewNotification);

        return () => {
            socket.off("new-notification", handleNewNotification);
        };
    }, [socket]);
    const handleNewNotification = (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
    };


    return {
        getNotifications,
        notifications,
        setNotifications,
        handleSendNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
        setUnreadCount,
        handleNewNotification,
    }


}

export default useNotification


