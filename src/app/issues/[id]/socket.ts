"use client";
// socket.ts
import { io } from "socket.io-client";

export const socket = io("http://13.250.57.111:4001", {
    autoConnect: false, // Prevent automatic connection
});
