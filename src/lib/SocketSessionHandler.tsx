// components/SocketSessionHandler.tsx
'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/stores/socketStore';

export default function SocketSessionHandler() {
  const { data: session } = useSession();
  const { connect, disconnect, isConnected, socket } = useSocketStore();

  useEffect(() => {
    if (session && !isConnected) {
      console.log(session?.user)
      connect(session?.user?.id);
    }
    console.log(isConnected, socket)

    return () => {
      if (isConnected) disconnect();
    };
  }, [session, isConnected]);

  return null;
}