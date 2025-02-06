"use client";
// socket.ts
import { io } from "socket.io-client";

export const socket = io("https://zcoder.pro", {
    autoConnect: false, // Prevent automatic connection
});
