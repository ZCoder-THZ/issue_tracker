'use client'
import React, { useState } from "react";
import useResponses from "./useResponse";
import ResponseItem from "./ResponseItem";
import ResponseInput from "./ResponseInput";

const ResponseSection = ({ issueId, issueOwnerId }: { issueId: number, issueOwnerId: string }) => {
    const { responses, setResponses, newResponse, setNewResponse, handleAddResponse, isConnected, isOwner } = useResponses(issueId, issueOwnerId);
    const [replyInput, setReplyInput] = useState<Record<number, string>>({});
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
    console.log(responses, 'issue responses')
    // Like handler
    const handleLike = (id: number, isReply = false, parentId?: number) => {
        setResponses((prev) =>
            prev.map((response) =>
                response.id === id ? { ...response, likes: response.likes + 1 } : response
            )
        );
    };

    // Toggle reply input box
    const toggleReplyBox = (id: number) => {
        setActiveReplyId((prev) => (prev === id ? null : id));
    };

    // Handle adding a reply
    const handleReply = (id: number, replyText: string) => {
        if (!replyText.trim()) return;
        console.log('Replying to:', id, replyText);
        setResponses((prev) =>
            prev.map((response) =>
                response.id === id
                    ? {
                        ...response,
                        replies: [
                            ...response.replies,
                            {
                                id: Date.now(), // Temporary ID
                                userId: "current-user-id",
                                issueId: issueId,
                                user: { name: "Current User", email: "user@example.com" },
                                timestamp: new Date().toISOString(),
                                text: replyText,
                                likes: 0,
                                replies: [],
                            },
                        ],
                    }
                    : response
            )
        );
        console.log('responses to comment', responses)

        setReplyInput((prev) => ({
            ...prev,
            [id]: "",
        }));
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-md bg-white">
            <ResponseInput

                newResponse={newResponse} setNewResponse={setNewResponse} handleAddResponse={handleAddResponse} isConnected={isConnected} />
            <div className="space-y-4">
                {responses.length > 0 ? (
                    responses.map((response) => (
                        <ResponseItem
                            isOwner={isOwner}
                            key={response.id}
                            response={response}
                            handleLike={handleLike}
                            handleReply={handleReply}
                            toggleReplyBox={toggleReplyBox}
                            activeReplyId={activeReplyId}
                            replyInput={replyInput}
                            setReplyInput={setReplyInput}
                        />
                    ))
                ) : (
                    <p>No responses available.</p>
                )}
            </div>
        </div>
    );
};

export default ResponseSection;
