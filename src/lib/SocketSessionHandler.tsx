'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/stores/socketIo/socketStore';
import useNotification from '@/hooks/useNotification';
import { useConnectedUserStore } from '@/stores/socketIo/connectedUsers';
export default function SocketSessionHandler() {
  const { data: session } = useSession();
  const { connect, disconnect, isConnected, socket } = useSocketStore();
  const {setConnectedUserIds}=useConnectedUserStore();
  const {
    getNotifications
  } = useNotification();



  useEffect(() => {
    if (session && !isConnected) {

      connect(session?.user?.id);
    }

    if (isConnected && session) {
      getNotifications()
            socket.emit('get-connected-users',(users:any[])=>
            setConnectedUserIds(users)
            )
      
    }

    return () => {
      if (isConnected) disconnect();
    };
  }, [session, isConnected]);




  return null;
}