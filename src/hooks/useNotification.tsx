
'use client'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from "react-toastify";

import { Notification } from '@/types/notifications';
import { useSocketStore } from '@/stores/socketIo/socketStore';
import { useNotificationStore } from '@/stores/socketIo/notificationStore';

function useNotification() {
    const socket = useSocketStore((state) => state.socket);
    const { data: session } = useSession();


    const {
        notifications,
        unreadCount,
        setNotifications,
        clearAll
    } = useNotificationStore();

    const getNotifications = () => {
        if (!socket || !session?.user?.id) return;

        socket.emit('get-notifications', (response: { success: boolean; notifications: Notification[] }) => {
            if (response.success) {
                // Update the store with existing notifications
                response.notifications.forEach(notification => {
                    setNotifications(notification);
                });
            }
        });
    };

    const handleSendNotification = (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
        try {
            socket?.emit("send-admin-notification", data);
            toast.success("Test notification sent");
        } catch (error) {
            toast.error("Failed to send notification");
        }
    };

    const markAsRead = (notificationId: string) => {
        if (!socket || !session?.user?.id) return;

        socket?.emit(
            "mark-as-read",
            notificationId,
            (response: { success: boolean }) => {
                if (response.success) {

                    useNotificationStore.setState(state => ({
                        notifications: state.notifications.map(n =>
                            n.id === notificationId ? { ...n, read: true } : n
                        ),
                        unreadCount: Math.max(0, state.unreadCount - 1)
                    }));
                }
            },
        );
    };

    const markAllAsRead = () => {
        if (!socket || !session?.user?.id) return;

        socket.emit("mark-all-read", (response: { success: boolean }) => {
            if (response.success) {
                // Update all notifications to read in the store
                useNotificationStore.setState(state => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true })),
                    unreadCount: 0
                }));
            }
        });
    };

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification: Notification) => {
            // Use the store's setNotifications method
            setNotifications(notification);
        };

        socket.on("new-notification", handleNewNotification);

        return () => {
            socket.off("new-notification", handleNewNotification);
        };
    }, [socket, setNotifications]);

    return {
        getNotifications,
        notifications,
        handleSendNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
        clearAll,
    };
}

export default useNotification;

