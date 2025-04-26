'use client'
import React, { useState } from "react";
import useResponses from "./useResponse";
import ResponseItem from "./ResponseItem";
import ResponseInput from "./ResponseInput";
import { useSocketStore } from '@/stores/socketStore'

const ResponseSection = ({ issueId, issueOwnerId }: { issueId: number, issueOwnerId: string }) => {

    const { isConnected, socket } = useSocketStore();
    if (issueOwnerId == socket?.auth?.userId) console.log('user owned')
    if (isConnected) return <div>Connected</div>


    return (<div>Not connected</div>)


};

export default ResponseSection;
