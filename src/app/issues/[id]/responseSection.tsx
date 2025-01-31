"use client";

import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
type ResponseType = {
    id: number;
    userId: string;
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
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null); // Track which reply box is visible
    const router = useRouter()
    // Connect to the server and manage events
    useEffect(() => {
        if (session?.user) {
            socket.auth = { email: session.user.email };
            socket.connect();
        }

        socket.on("connected", () => setIsConnect(!isConnect));
        socket.on("fetch-comments", (comments: ResponseType[]) => {
            if (Array.isArray(comments)) {
                setResponses(comments);
            } else {
                console.error("Expected an array but got:", comments);
            }
        });



        socket.on("disconnect", () => setIsConnect(false));

        return () => {
            socket.off("connected");
            socket.off("fetch-comments");
            socket.off("disconnect");
        };
    }, [session?.user?.email, replyInput, issueId]);

    useEffect(() => {
        console.log('triggered')

        if (issueId) {
            socket.on("connected", () => setIsConnect(!isConnect));

            socket.emit("get-comments", issueId);
        }

    }, [issueId]);

    const handleAddResponse = () => {
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

        console.log("Adding comment:", newComment);
        socket.emit("add-comment", newComment, (savedResponse: ResponseType) => {
            setResponses((prev) => [savedResponse, ...prev]);
        });

        setNewResponse("");
    };

    const handleReply = (id: number, replyText: string) => {
        if (!replyText.trim()) return;

        const newReply = {
            user: session?.user?.name || session?.user?.email || "Anonymous",
            userId: session?.user?.id,
            timestamp: new Date().toISOString(),
            text: replyText,
            likes: 0,
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
        setActiveReplyId(null); // Hide the reply box after submitting
    };

    const handleLike = (id: number, isReply = false, parentId?: number) => {
        if (isReply && parentId !== undefined) {
            setResponses((prev) =>
                prev.map((response) =>
                    response.id === parentId
                        ? {
                            ...response,
                            replies: response.replies.map((reply) =>
                                reply.id === id ? { ...reply, likes: reply.likes + 1 } : reply
                            ),
                        }
                        : response
                )
            );
        } else {
            setResponses((prev) =>
                prev.map((response) =>
                    response.id === id ? { ...response, likes: response.likes + 1 } : response
                )
            );
        }
    };

    const toggleReplyBox = (id: number) => {
        setActiveReplyId((prev) => (prev === id ? null : id)); // Toggle reply input visibility
    };


    return (
        <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-md bg-white">
            <div className="mb-4">

                {session ? <h1>{session.user?.email}</h1> : <h2>No session</h2>}
            </div>

            {/* Response Input */}
            {/* Only show the response input box if the user is connected and not the issue owner */}
            {isConnect && session?.user?.id !== responses[0]?.userId && (
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
            )}





            {/* Responses List */}
            <div className="space-y-4">
                {responses.length > 0 ? (
                    responses.map((response) => (
                        <div key={response.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-semibold">{response.user}</h3>
                                    <p className="text-sm text-gray-500">{response.timestamp}</p>
                                    <p>{response.text}</p>
                                </div>
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => handleLike(response.id)}
                                >
                                    ❤️ {response.likes}
                                </button>
                            </div>

                            <button
                                className="text-blue-500 hover:underline mt-2"
                                onClick={() => toggleReplyBox(response.id)}
                            >
                                Reply
                            </button>

                            {/* Reply Input Box */}
                            {activeReplyId === response.id && (
                                <div className="mt-2">
                                    <textarea
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Write your reply..."
                                        rows={2}
                                        value={replyInput[response.id] || ""}
                                        onChange={(e) =>
                                            setReplyInput((prev) => ({
                                                ...prev,
                                                [response.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <button
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                        onClick={() =>
                                            handleReply(response.id, replyInput[response.id])
                                        }
                                        disabled={!replyInput[response.id]?.trim()}
                                    >
                                        Add Reply
                                    </button>
                                </div>
                            )}

                            {/* Replies List */}
                            <div className="mt-4 space-y-2">
                                {response.replies.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="pl-4 border-l border-gray-200"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <h4 className="font-semibold">{reply.user}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {reply.timestamp}
                                                </p>
                                                <p>{reply.text}</p>
                                            </div>
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() =>
                                                    handleLike(reply.id, true, response.id)
                                                }
                                            >
                                                ❤️ {reply.likes}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No responses available.</p>
                )}
            </div>
        </div>
    );
};

export default ResponseSection;
