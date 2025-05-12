// stores/socketIo/connectedUserStore.ts
import { create } from 'zustand';

type ConnectedUserStore = {
    connectedUserIds: number[];
    setConnectedUserIds: (ids: number[]) => void;
};

export const useConnectedUserStore = create<ConnectedUserStore>((set) => ({
    connectedUserIds: [],
    setConnectedUserIds: (ids) => set({ connectedUserIds: ids }),
}));

