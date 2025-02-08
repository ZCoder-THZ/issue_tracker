'use client'
import React, { useState } from "react";
import useResponses from "./useResponse";
import ResponseItem from "./ResponseItem";
import ResponseInput from "./ResponseInput";

const ResponseSection = ({ issueId, issueOwnerId }: { issueId: number, issueOwnerId: string }) => {
    const { handleReplyEmit, responses, setResponses, newResponse, setNewResponse, handleAddResponse, isConnected, isOwner, session } = useResponses(issueId, issueOwnerId);
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


        handleReplyEmit(id, replyText);


        setResponses((prev) =>
            prev.map((response) =>
                response.id === id
                    ? {
                        ...response,
                        replies: [
                            ...response.replies,
                            {
                                id: Date.now(), // Temporary ID
                                userId: session?.user?.id,
                                issueId: issueId,
                                user: { name: session?.user?.name, email: session?.user?.email },
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

        setReplyInput((prev) => ({
            ...prev,
            [id]: "",
        }));
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-md bg-white">
            <ResponseInput

                newResponse={newResponse} setNewResponse={setNewResponse} handleAddResponse={handleAddResponse} isConnected={isConnected}
                isOwner={
                    isOwner
                }
            />
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
