"use client";

import { useEffect, useState } from "react";
import { useSocketStore } from "@/stores/socketStore";
import { useSession } from "next-auth/react";
import useNotification from "../hooks/useNotification";


function NotificationPage() {
  const socket = useSocketStore((state) => state.socket);
  const { data: session } = useSession();
  const { getNotifications, notifications, handleSendNotification } = useNotification();

  // Fetch initial notifications
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    getNotifications()
  }, [socket, session]);




  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      <div className="mb-4">

        <button

          className="px-4 py-2 bg-blue-600 text-white rounded mt-2"
        >
          Send Test Notification
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p>No notifications yet</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded ${!notification.read ? "bg-blue-50" : "bg-white"}`}
            // onClick={() => !notification.read && markAsRead(notification.id)}


            >
              <div className="flex justify-between">
                <h3 className="font-medium">Noti Title{notification.title}</h3>
                {!notification.read && (
                  <span className="text-xs text-blue-600">NEW</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
