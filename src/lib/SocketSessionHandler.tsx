'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/stores/socketStore';
import useNotification from '@/hooks/useNotification';

export default function SocketSessionHandler() {
  const { data: session } = useSession();
  const { connect, disconnect, isConnected, socket } = useSocketStore();
  const {
    getNotifications
  } = useNotification();



  useEffect(() => {
    if (session && !isConnected) {

      connect(session?.user?.id);
    }

    if (isConnected && session) {
      getNotifications()
    }

    return () => {
      if (isConnected) disconnect();
    };
  }, [session, isConnected]);




  return null;
}