import React from "react";

type ResponseType = {
    id: number;
    userId: string;
    user: { name: string; email: string };
    timestamp: string;
    text: string;
    likes: number;
    replies: ResponseType[];
};

const ResponseItem = ({
    isOwner,
    response,
    handleLike,
    handleReply,
    toggleReplyBox,
    activeReplyId,
    replyInput,
    setReplyInput,
}: {
    response: ResponseType;
    isOwner: boolean;
    handleLike: (id: number, isReply?: boolean, parentId?: number) => void;
    handleReply: (id: number, replyText: string) => void;
    toggleReplyBox: (id: number) => void;
    activeReplyId: number | null;
    replyInput: Record<number, string>;
    setReplyInput: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}) => {

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between">
                <div>
                    <h3 className="font-semibold">username : {response.user?.email}</h3>
                    <p className="text-sm text-gray-500">{response.timestamp}</p>
                    <p>{response.text}</p>
                </div>
                <button className="text-blue-500 hover:underline" onClick={() => handleLike(response.id)}>
                    ❤️ {response.likes}
                </button>
            </div>

            <button className="text-blue-500 hover:underline mt-2" onClick={() => toggleReplyBox(response.id)}>
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
                        onClick={() => handleReply(response.id, replyInput[response.id])}
                        disabled={!replyInput[response.id]?.trim()}
                    >
                        Add Reply
                    </button>
                </div>
            )}

            {/* Replies List */}
            <div className="mt-4 space-y-2">
                {response?.replies?.map((reply) => (
                    <div key={reply.id} className="pl-4 border-l border-gray-200">
                        <div className="flex justify-between">
                            <div>
                                <h4 className="font-semibold">Username</h4>
                                <p className="text-sm text-gray-500">Email</p>
                                <p>{reply.text}</p>
                            </div>
                            <button className="text-blue-500 hover:underline" onClick={() => handleLike(reply.id, true, response.id)}>
                                ❤️ {reply.likes}
                            </button>

                            <button className="text-blue-500 hover:underline mt-2" onClick={() => toggleReplyBox(response.id)}>
                                Reply
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResponseItem;
