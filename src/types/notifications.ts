export type Issue = {
    id: number;
    title: string;
};

export interface Notification {
    id: string | null;
    title: string;
    message: string;
    read: boolean;
    userId: string,
    senderId?: string,
    createdAt: Date;
    type?: string;
    issue?: Issue;
    issueId?: number;

}