"use client";
// socket.ts
import { io } from "socket.io-client";

export const socket = io("localhost:4000", {
    autoConnect: false, // Prevent automatic connection
});
