import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import { Notification } from "../types/notifications";

type NotificationStore = {
    notifications: Notification[];
    unreadCount: number;
    setNotifications: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'> | Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    // removeNotification: (id: number) => void;
    clearAll: () => void;
};

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,

            setNotifications: (notification) => {
                set((state) => {
                    const isComplete =
                        'id' in notification && 'read' in notification && 'createdAt' in notification;

                    const newNotification: Notification = isComplete
                        ? (notification as Notification)
                        : {
                            ...notification,
                            id: uuidv4(), // generate a unique ID
                            read: false,
                            createdAt: new Date(),
                        };

                    const alreadyExists = state.notifications.some(
                        (n) => n.id === newNotification.id
                    );
                    if (alreadyExists) return state;

                    return {
                        notifications: [newNotification, ...state.notifications],
                        unreadCount: newNotification.read
                            ? state.unreadCount
                            : state.unreadCount + 1,
                    };
                });
            },

            markAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    unreadCount: Math.max(
                        0,
                        state.unreadCount - (state.notifications.find((n) => n.id === id && !n.read) ? 1 : 0)
                    ),
                }));
            },

            markAllAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                }));
            },

            // removeNotification: (id) => {
            //     set((state) => {
            //         const notification = state.notifications.find((n) => n.id === id);
            //         return {
            //             notifications: state.notifications.filter((n) => n.id !== id),
            //             unreadCount:
            //                 notification && !notification.read
            //                     ? Math.max(0, state.unreadCount - 1)
            //                     : state.unreadCount,
            //         };
            //     });
            // },

            clearAll: () => {
                set({ notifications: [], unreadCount: 0 });
            },
        }),
        {
            name: 'notification-storage',
            partialize: (state) => ({
                notifications: state.notifications,
                unreadCount: state.unreadCount,
            }),
        }
    )
);
