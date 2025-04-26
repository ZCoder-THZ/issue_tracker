'use client';

import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socketStore';

function Page() {
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    // Listen for admin notifications from server
    socket.on('admin-notification', (data) => {   // <-- fixed event name
      console.log('Received admin notification:', data);
      alert(`New Admin Notification: ${data.message}`);
    });

    return () => {
      socket.off('admin-notification');  // <-- fixed event name
    };
  }, [socket]);

  const handleSendNotification = () => {
    console.log('Clicking send notification')
    socket?.emit('send-admin-notification', {  // <-- fixed event name
      message: 'Test Notification from frontend'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Admin Notifications Testing</h1>
      <p>Listening for admin notifications...</p>

      <button
        onClick={handleSendNotification}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send Notification Request
      </button>
    </div>
  );
}

export default Page;
