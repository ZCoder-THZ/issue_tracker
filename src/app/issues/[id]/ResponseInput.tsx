import React from "react";

const ResponseInput = ({
    newResponse,
    setNewResponse,
    handleAddResponse,
    isConnected,
    isOwner
}: {
    newResponse: string;
    setNewResponse: React.Dispatch<React.SetStateAction<string>>;
    handleAddResponse: () => void;
    isConnected: boolean;
    isOwner: boolean;
}) => {
    console.log('isOwner', isOwner)
    return (
        <div className="mb-4">
            {
                isOwner ? '' : (
                    <div>
                        <textarea
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write a response..."
                            rows={3}
                            value={newResponse}
                            onChange={(e) => setNewResponse(e.target.value)}
                        />
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            onClick={handleAddResponse}
                            disabled={!isConnected}
                        >
                            Add Comment
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default ResponseInput;
