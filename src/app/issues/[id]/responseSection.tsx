"use client";

import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import { useSession } from "next-auth/react";
type ResponseType = {
    id: number;
    user: string;
    timestamp: string;
    text: string;
    likes: number;
    replies: ResponseType[];
};

const ResponseSection = () => {
    const { data, status } = useSession()
    const [responses, setResponses] = useState<ResponseType[]>([]);
    const [isConnect, setIsConnect] = useState(false);
    const [newResponse, setNewResponse] = useState("");
    const [replyInput, setReplyInput] = useState({}) as any;

    // Connect to the server and fetch initial responses
    console.log(data?.user)
    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log("Connected");
            setIsConnect(true);

            // Fetch initial responses from the server
            socket.emit("get-responses");
        }

        function onDisconnect() {
            setIsConnect(false);
            console.log("Disconnected");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // Listen for new responses or replies from the server
        socket.on("update-responses", (data: ResponseType[]) => {
            setResponses(data);
        });

        socket.on("new-response", (response: ResponseType) => {
            setResponses((prev) => [response, ...prev]);
        });

        socket.on("new-reply", ({ parentId, reply }: { parentId: number; reply: ResponseType }) => {
            setResponses((prev) =>
                prev.map((response) =>
                    response.id === parentId
                        ? { ...response, replies: [...response.replies, reply] }
                        : response
                )
            );
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("update-responses");
            socket.off("new-response");
            socket.off("new-reply");
        };
    }, []);

    const handleAddResponse = () => {
        if (newResponse.trim() === "") return;

        const newComment = {
            user: "You", // Dynamically set user later
            timestamp: new Date().toISOString(),
            text: newResponse,
        };

        // Emit the new response to the server
        socket.emit("add-response", newComment, (savedResponse: ResponseType) => {
            setResponses((prev) => [savedResponse, ...prev]);
        });

        setNewResponse("");
    };

    const handleReply = (id: number, replyText: string) => {
        if (replyText.trim() === "") return;

        const newReply = {
            user: "You", // Dynamically set user later
            timestamp: new Date().toISOString(),
            text: replyText,
        };

        // Emit the reply to the server
        socket.emit("add-reply", { parentId: id, replyText: newReply }, (savedReply: ResponseType) => {
            setResponses((prev) =>
                prev.map((response) =>
                    response.id === id
                        ? { ...response, replies: [...response.replies, savedReply] }
                        : response
                )
            );
        });

        setReplyInput({ ...replyInput, [id]: "" });
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-md bg-white">
            {isConnect ? <h1>Yeah Connected </h1> : <h1>Not Connected </h1>}
            {
                data ? <h1>{data.user?.email}</h1> : <h2>nope</h2>
            }
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
                >
                    Respond
                </button>
            </div>

            {/* Responses List */}
            <div className="space-y-4">
                {responses.map((response) => (
                    <div
                        key={response.id}
                        className="flex flex-col p-4 border rounded-lg bg-gray-50"
                    >
                        {/* Main Response */}
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{response.user}</h3>
                                    <p className="text-sm text-gray-500">{response.timestamp}</p>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700">{response.text}</p>
                        </div>

                        {/* Interactive Options */}
                        <div className="mt-2 flex items-center space-x-4 text-gray-600">
                            <button className="flex items-center hover:text-gray-800">
                                <span className="mr-1">👏</span>
                                {response.likes}
                            </button>
                            <button
                                className="hover:text-gray-800"
                                onClick={() =>
                                    setReplyInput({
                                        ...replyInput,
                                        [response.id]: replyInput[response.id]
                                            ? ""
                                            : "Write your reply...",
                                    })
                                }
                            >
                                Reply
                            </button>
                        </div>

                        {replyInput[response.id] && (
                            <div className="mt-4">
                                <textarea
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={replyInput[response.id]}
                                    rows={2}
                                    value={replyInput[response.id]}
                                    onChange={(e) =>
                                        setReplyInput({
                                            ...replyInput,
                                            [response.id]: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    onClick={() =>
                                        handleReply(response.id, replyInput[response.id])
                                    }
                                >
                                    Add Reply
                                </button>
                            </div>
                        )}

                        {/* Nested Replies */}
                        <div className="mt-4 space-y-2 pl-4 border-l border-gray-300">
                            {response.replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className="flex flex-col bg-gray-100 p-3 rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-700">{reply.user}</h4>
                                            <p className="text-sm text-gray-500">{reply.timestamp}</p>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-600">{reply.text}</p>
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
// here is a logic 
// a user will send a message to a post typically the post owner
// so auth user send a message to the user under the post authUser->postOwner
// will be push notification if postOwner is onlinenpm