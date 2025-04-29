import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type Dev = {
    id: string;
    name: string;
    email: string;
    role: string | number;
    image?: string;
};

export function useDevs() {
    return useQuery<Dev[], Error>({
        queryKey: ['devs'],
        queryFn: () => axios.get('/api/devs').then(r => r.data.users),
        staleTime: 0,
    });
}
