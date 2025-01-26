"use client";

import React, { useEffect, useState } from "react";
import { socket } from "./socket"; // Import singleton instance
import { useSession } from "next-auth/react";

type ResponseType = {
    id: number;
    user: string;
    timestamp: string;
    text: string;
    likes: number;
    replies: ResponseType[];
};

const ResponseSection = ({ issueId }: { issueId: number }) => {
    const { data: session } = useSession();
    const [responses, setResponses] = useState<ResponseType[]>([]);
    const [isConnect, setIsConnect] = useState(false);
    const [newResponse, setNewResponse] = useState("");
    const [replyInput, setReplyInput] = useState<Record<number, string>>({});

    // Connect to the server and manage events
    useEffect(() => {
        if (session?.user) {
            socket.auth = { email: session.user.email };
            socket.connect();
        }

        socket.on("connected", () => {
            setIsConnect(true);
        });

        socket.on("get-comments-response", (comments: ResponseType[]) => {
            setResponses(comments);
        });

        socket.on("disconnect", () => {
            setIsConnect(false);
        });

        return () => {
            socket.off("connected");
            socket.off("get-comments-response");
            socket.off("disconnect");
        };
    }, [session?.user?.email]);

    useEffect(() => {

        socket.emit('get-comments', issueId)
        console.log('event triggerd')
    },
        [issueId]
    )
    const handleAddResponse = () => {
        if (!newResponse.trim()) return;

        const newComment = {
            user: session?.user?.name || session?.user?.email || "Anonymous",
            timestamp: new Date().toISOString(),
            text: newResponse,
        };

        socket.emit("add-response", newComment, (savedResponse: ResponseType) => {
            setResponses((prev) => [savedResponse, ...prev]);
        });

        setNewResponse("");
    };

    const handleReply = (id: number, replyText: string) => {
        if (!replyText.trim()) return;

        const newReply = {
            user: session?.user?.name || session?.user?.email || "Anonymous",
            timestamp: new Date().toISOString(),
            text: replyText,
        };

        socket.emit(
            "add-reply",
            { parentId: id, replyText: newReply },
            (savedReply: ResponseType) => {
                setResponses((prev) =>
                    prev.map((response) =>
                        response.id === id
                            ? { ...response, replies: [...response.replies, savedReply] }
                            : response
                    )
                );
            }
        );

        setReplyInput((prev) => ({ ...prev, [id]: "" }));
    };



    return (
        <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-md bg-white">
            {isConnect ? <h1>Yeah Connected</h1> : <h1>Not Connected</h1>}
            {session ? <h1>{session.user?.email}</h1> : <h2>No session</h2>}

            {/* Response Input */}
            <div className="mb-4">
                <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="What are your thoughts?"
                    rows={2}
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                />
                <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    onClick={handleAddResponse}
                    disabled={!newResponse.trim()}
                >
                    Respond
                </button>
            </div>

            {/* Responses List */}
            <div className="space-y-4">
                {responses.map((response) => (
                    <div key={response.id} className="p-4 border rounded-lg bg-gray-50">
                        <div>
                            <h3 className="font-semibold">{response.user}</h3>
                            <p className="text-sm">{response.timestamp}</p>
                            <p>{response.text}</p>
                        </div>
                        {/* Replies */}
                        <div className="mt-2">
                            <textarea
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Write your reply..."
                                rows={2}
                                value={replyInput[response.id] || ""}
                                onChange={(e) =>
                                    setReplyInput((prev) => ({ ...prev, [response.id]: e.target.value }))
                                }
                            />
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                onClick={() => handleReply(response.id, replyInput[response.id])}
                                disabled={!replyInput[response.id]?.trim()}
                            >
                                Add Reply
                            </button>
                        </div>
                        <div className="mt-4 pl-4 border-l">
                            {response.replies.map((reply) => (
                                <div key={reply.id} className="mb-2">
                                    <h4 className="font-semibold">{reply.user}</h4>
                                    <p className="text-sm">{reply.timestamp}</p>
                                    <p>{reply.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResponseSection;
