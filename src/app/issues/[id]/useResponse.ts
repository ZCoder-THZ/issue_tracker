import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useSession } from "next-auth/react";
import { set } from "date-fns";

export type ResponseType = {
    id: number;
    userId: string;
    user: { name: string; email: string };
    timestamp: string;
    text: string;
    likes: number;
    replies: ResponseType[];
};

const useResponses = (issueId: number, issueOwnerId: string) => {
    const { data: session } = useSession();
    const [responses, setResponses] = useState<ResponseType[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [newResponse, setNewResponse] = useState("");
    const [isOwner, setIsOwner] = useState(false);



    useEffect(() => {
        if (session?.user) {
            socket.auth = { email: session.user.email };
            socket.connect();
        }

        socket.on("connected", () => setIsConnected(true));
        socket.on("fetch-comments", (comments: ResponseType[]) => setResponses(comments));
        socket.on("disconnect", () => setIsConnected(false));

        return () => {
            socket.off("connected");
            socket.off("fetch-comments");
            socket.off("disconnect");
        };
    }, [session?.user?.email, issueId]);

    useEffect(() => {
        if (issueId) {
            socket.emit("get-comments", issueId);
            if (session?.user?.id === issueOwnerId) {
                setIsOwner(true)
            }
        }

    }, [issueId]);

    const handleAddResponse = () => {
        console.log('clicked')
        if (!newResponse.trim()) return;

        const newComment = {
            user: session?.user?.name || session?.user?.email || "Anonymous",
            issueId,
            userId: session?.user?.id,
            timestamp: new Date().toISOString(),
            text: newResponse,
            likes: 0,
            replies: [],
        };

        socket.emit("add-comment", newComment, (savedResponse: ResponseType) => {
            setResponses((prev) => [savedResponse, ...prev]);
        });

        setNewResponse("");
    };

    return { responses, setResponses, newResponse, setNewResponse, handleAddResponse, isConnected, isOwner };
};

export default useResponses;
