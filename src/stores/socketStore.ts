// lib/stores/socket-store.ts

import { create } from 'zustand';
import io from 'socket.io-client';

type SocketState = {
    isConnected: boolean;
    socket: any | null;
    connect: (token: string) => void;
    disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
    isConnected: false,
    socket: null,

    connect: (userId) => {
        if (get().isConnected) return;

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            auth: {
                userId
            },
            autoConnect: true,
            reconnectionAttempts: 3,
        });

        socket
            .on('connect', () => set({ isConnected: true, socket }))
            .on('disconnect', () => set({ isConnected: false, socket: null }));

        set({ socket });
    },

    disconnect: () => {
        get().socket?.disconnect();
        set({ isConnected: false, socket: null });
    },
}));